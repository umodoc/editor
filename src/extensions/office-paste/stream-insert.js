import {
  DOMParser as ProseMirrorDOMParser,
  Fragment,
  Slice,
} from '@tiptap/pm/model'
import { PluginKey, TextSelection } from '@tiptap/pm/state'
import { isInTable } from '@tiptap/pm/tables'

import { yieldToMain } from '@/utils/time-slice'

// 单批解析的节点权重上限。图片的节点视图远比普通元素昂贵
const PARSE_BATCH_WEIGHT = 400
const IMAGE_WEIGHT = 40
// 每个事务都有与文档大小成正比的固定开销（目录、高亮、分页等），
// 因此限制的是事务数量而不是单个事务的大小，否则总耗时会随文档增大平方增长
const MAX_INSERT_TRANSACTIONS = 48
const MIN_INSERT_SIZE = 2000

const SECTION_WRAPPER = /^(WordSection|Section)\d+$/

const isIgnorableNode = (node) =>
  node.nodeType === 8 || (node.nodeType === 3 && node.textContent.trim() === '')

// Word 将正文包在分节 div 内，展开后才有可分批的顶层节点
const collectTopLevelNodes = (root) =>
  Array.from(root.childNodes).flatMap((node) => {
    if (isIgnorableNode(node)) {
      return []
    }
    return node.nodeName === 'DIV' && SECTION_WRAPPER.test(node.className)
      ? collectTopLevelNodes(node)
      : [node]
  })

const getNodeWeight = (node) => {
  if (node.nodeType !== 1) {
    return 1
  }
  const elements = node.getElementsByTagName('*').length
  const images = node.getElementsByTagName('img').length
  return 1 + elements + images * IMAGE_WEIGHT
}

export const getParseBatches = (doc) => {
  const batches = []
  let batch = []
  let weight = 0
  collectTopLevelNodes(doc.body).forEach((node) => {
    const nodeWeight = getNodeWeight(node)
    if (batch.length && weight + nodeWeight > PARSE_BATCH_WEIGHT) {
      batches.push(batch)
      batch = []
      weight = 0
    }
    batch.push(node)
    weight += nodeWeight
  })
  if (batch.length) {
    batches.push(batch)
  }
  return batches
}

const parseBatches = async (view, doc, batches, slice) => {
  const parser =
    view.someProp('clipboardParser') ||
    view.someProp('domParser') ||
    ProseMirrorDOMParser.fromSchema(view.state.schema)
  const nodes = []
  for (const batch of batches) {
    const container = doc.createElement('div')
    container.append(...batch)
    let parsed = parser.parseSlice(container, { preserveWhitespace: false })
    view.someProp('transformPasted', (transform) => {
      parsed = transform(parsed, view)
    })
    parsed.content.forEach((node) => nodes.push(node))
    await slice()
  }
  return nodes
}

export const streamInsertKey = new PluginKey('office-paste-stream')

// 插入点随文档变化映射，分批期间用户可以继续编辑
export const streamInsertState = {
  init: () => null,
  apply(tr, position) {
    const meta = tr.getMeta(streamInsertKey)
    if (meta !== undefined) {
      return meta
    }
    // assoc 为 -1：其他插件（如 TrailingNode）恰好在此处添加内容时，插入点必须留在其之前
    return position === null ? null : tr.mapping.map(position, -1)
  },
}

// 清出一个块级插入点，返回替换范围
const prepareInsertRange = (tr) => {
  if (!tr.selection.empty) {
    tr.deleteSelection()
  }
  const { $from } = tr.selection
  if ($from.parent.content.size === 0 && $from.depth > 0) {
    return { from: $from.before(), to: $from.after() }
  }
  if ($from.parentOffset === 0) {
    return { from: $from.before(), to: $from.before() }
  }
  if ($from.parentOffset === $from.parent.content.size) {
    return { from: $from.after(), to: $from.after() }
  }
  const position = $from.pos + 1
  tr.split($from.pos)
  return { from: position, to: position }
}

// 只在没有 rowspan 跨越的行之间切分：残缺的表格会被 fixTables 永久修剪合并单元格
const splitTableRows = (table, size) => {
  const groups = []
  let rows = []
  let total = 0
  let spanEnd = 0
  table.forEach((row, _offset, index) => {
    rows.push(row)
    total += row.nodeSize
    row.forEach((cell) => {
      spanEnd = Math.max(spanEnd, index + (cell.attrs.rowspan || 1))
    })
    if (total >= size && spanEnd <= index + 1) {
      groups.push(rows)
      rows = []
      total = 0
    }
  })
  if (rows.length) {
    groups.push(rows)
  }
  return groups
}

// 超大表格无法作为顶层节点分批，先插入首部，其余的行逐批追加
const createInsertUnits = (nodes, size) =>
  nodes.flatMap((node) => {
    if (node.type.spec.tableRole !== 'table' || node.nodeSize <= size) {
      return [{ node, size: node.nodeSize }]
    }
    const [firstRows, ...restRows] = splitTableRows(node, size)
    const first = node.copy(Fragment.fromArray(firstRows))
    return [
      { node: first, size: first.nodeSize },
      ...restRows.map((rows) => ({
        rows,
        size: rows.reduce((sum, row) => sum + row.nodeSize, 0),
      })),
    ]
  })

const takeUnits = (units, index, size) => {
  if (units[index].rows) {
    return [units[index]]
  }
  const taken = []
  let total = 0
  for (let i = index; i < units.length && total < size; i += 1) {
    if (units[i].rows) {
      break
    }
    taken.push(units[i])
    total += units[i].size
  }
  return taken
}

const appendTableRows = (tr, position, rows) => {
  const content = Fragment.fromArray(rows)
  const table = tr.doc.resolve(position).nodeBefore
  if (table?.type.spec.tableRole === 'table') {
    tr.insert(position - 1, content)
  } else {
    // 用户在表格之后的编辑导致插入点偏移时，退化为独立的表格
    tr.insert(position, rows[0].type.schema.nodes.table.create(null, content))
  }
  return tr.mapping.map(position)
}

export const canStreamInsert = (view, batches) => {
  const { selection } = view.state
  if (
    !(selection instanceof TextSelection) ||
    !selection.$from.parent.isTextblock
  ) {
    return false
  }
  if (batches.length > 1) {
    return true
  }
  // 单个表格粘贴到表格内时，需要由 prosemirror-tables 合并到现有单元格
  const [node] = batches[0] ?? []
  return (
    !!node && getNodeWeight(node) > PARSE_BATCH_WEIGHT && !isInTable(view.state)
  )
}

export const streamInsert = async (view, doc, batches, slice) => {
  const nodes = await parseBatches(view, doc, batches, slice)
  if (!nodes.length || view.isDestroyed) {
    return Slice.empty
  }

  const totalSize = nodes.reduce((sum, node) => sum + node.nodeSize, 0)
  const size = Math.max(
    MIN_INSERT_SIZE,
    Math.ceil(totalSize / MAX_INSERT_TRANSACTIONS),
  )
  const units = createInsertUnits(nodes, size)
  let index = 0
  let firstTransaction = null
  let expectedSelection = null

  while (index < units.length && !view.isDestroyed) {
    const taken = takeUnits(units, index, size)
    const previousDoc = view.state.doc
    const { tr } = view.state
    let position
    if (taken[0].rows) {
      position = appendTableRows(
        tr,
        streamInsertKey.getState(view.state),
        taken[0].rows,
      )
    } else {
      const content = new Slice(
        Fragment.fromArray(taken.map(({ node }) => node)),
        0,
        0,
      )
      const start = firstTransaction
        ? streamInsertKey.getState(view.state)
        : null
      const range = firstTransaction
        ? { from: start, to: start }
        : prepareInsertRange(tr)
      const stepsBefore = tr.steps.length
      tr.replaceRange(range.from, range.to, content)
      position = tr.mapping.slice(stepsBefore).map(range.to)
    }
    tr.setMeta(streamInsertKey, position)
    tr.setMeta('paste', true)
    tr.setMeta('uiEvent', 'paste')
    if (index + taken.length < units.length) {
      // 目录只需在最后一批之后重新计算
      tr.setMeta('toc', true)
    }
    if (firstTransaction) {
      // 让后续事务并入同一撤销步骤，一次撤销即可还原整个粘贴
      tr.setMeta('appendedTransaction', firstTransaction)
    } else {
      tr.setSelection(TextSelection.near(tr.doc.resolve(position), -1))
      firstTransaction = tr
    }
    view.dispatch(tr)
    if (view.state.doc === previousDoc) {
      // 事务被过滤（如超出字数限制），继续插入没有意义
      break
    }
    expectedSelection = expectedSelection ?? view.state.selection
    index += taken.length
    await yieldToMain()
    if (expectedSelection && view.state.selection.eq(expectedSelection)) {
      expectedSelection = view.state.selection
    } else {
      expectedSelection = false
    }
  }

  if (!view.isDestroyed) {
    const position = streamInsertKey.getState(view.state)
    const { tr } = view.state
    tr.setMeta(streamInsertKey, null)
    tr.setMeta('addToHistory', false)
    if (expectedSelection) {
      tr.setSelection(TextSelection.near(tr.doc.resolve(position), -1))
      tr.scrollIntoView()
    }
    view.dispatch(tr)
  }
  return new Slice(Fragment.fromArray(nodes), 0, 0)
}
