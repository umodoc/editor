import { type Editor, findParentNode, getNodeType } from '@tiptap/core'
import { Fragment, type Node, type Schema, Slice } from '@tiptap/pm/model'
import type { EditorState, Transaction } from '@tiptap/pm/state'
import { ReplaceStep } from '@tiptap/pm/transform'

import type {
  ComputedFn,
  NodesComputed,
  PageState,
  SplitInfo,
  SplitParams,
} from '@/extensions/page/types'
import { getId } from '@/extensions/page/utils'

import { getAbsentHtmlH, getBreakPos, getDefault, getDomHeight } from './core'
import {
  BULLETLIST,
  CASSIE_BLOCK_EXTEND,
  EXTEND,
  HEADING,
  LIST_TYPE,
  LISTITEM,
  ORDEREDLIST,
  PAGE,
  PARAGRAPH,
  TABLE,
  TABLE_ROW,
  TASKITEM,
  TASKLIST,
} from './node-names'

export const sameListCalculation: ComputedFn = (
  splitContex,
  node,
  pos,
  parent,
  dom,
) => {
  const { height: pHeight, margin } = getDomHeight(dom)
  if (splitContex.isOverflow(pHeight)) {
    splitContex.addHeight(margin)
    return true
  }
  splitContex.addHeight(pHeight)
  return false
}
let count = 1

export const sameItemCalculation: ComputedFn = (
  splitContex,
  node,
  pos,
  parent,
  dom,
) => {
  const chunks = splitContex.splitResolve(pos)
  const { height: pHeight, margin } = getDomHeight(dom)
  if (splitContex.isOverflow(pHeight)) {
    if (pHeight > splitContex.getHeight()) {
      splitContex.addHeight(margin)
      return true
    }
    if (parent?.firstChild === node) {
      splitContex.setBoundary(chunks[chunks.length - 2][2], chunks.length - 2)
    } else {
      splitContex.setBoundary(pos, chunks.length - 1)
    }
  } else {
    splitContex.addHeight(pHeight)
  }
  return false
}

export const defaultNodesComputed: NodesComputed = {
  [ORDEREDLIST]: sameListCalculation,
  [BULLETLIST]: sameListCalculation,
  [LISTITEM]: sameItemCalculation,
  [TASKLIST]: sameListCalculation,
  [TASKITEM]: sameItemCalculation,
  [TABLE_ROW]: (splitContex, node, pos, parent, dom) => {
    const chunks = splitContex.splitResolve(pos)
    if (splitContex.isOverflow(0)) {
      if (count > 1) {
        count = 1
        splitContex.setBoundary(chunks[chunks.length - 2][2], chunks.length - 2)
      } else {
        splitContex.setBoundary(pos, chunks.length - 1)
        count += 1
      }
      return false
    }
    const { height: pHeight } = getDomHeight(dom)
    if (splitContex.isOverflow(pHeight)) {
      if (pHeight > splitContex.getHeight()) {
        splitContex.addHeight(pHeight)
        return false
      }
      //如果当前行是list的第一行并且已经超过分页高度 直接返回上一层级的切割点
      if (parent?.firstChild === node) {
        splitContex.setBoundary(chunks[chunks.length - 2][2], chunks.length - 2)
      } else {
        //如果不是第一行 直接返回当前行的切割点
        splitContex.setBoundary(pos, chunks.length - 1)
      }
    } else {
      splitContex.addHeight(pHeight)
    }
    return false
  },
  [TABLE]: (splitContex, node, pos, parent, dom) => {
    const { height: pHeight, margin } = getDomHeight(dom)
    //如果列表的高度超过分页高度 直接返回继续循环 tr 或者li
    if (splitContex.isOverflow(pHeight)) {
      splitContex.addHeight(margin)
      return true
    }
    //没有超过分页高度 累加高度
    splitContex.addHeight(pHeight)
    return false
  },
  [HEADING]: (splitContex, node, pos, parent, dom) => {
    const { height: pHeight } = getDomHeight(dom)
    if (!splitContex.isOverflow(pHeight)) {
      splitContex.addHeight(pHeight)
      return false
    }

    const chunks = splitContex.splitResolve(pos)
    if (pHeight > splitContex.getHeight()) {
      const point = getBreakPos(node, dom, splitContex)
      if (point) {
        splitContex.setBoundary(pos + point, chunks.length)
        return false
      }
    } else {
      //直接返回当前段落
      splitContex.setBoundary(pos, chunks.length - 1)
    }
    return false
  },

  [PARAGRAPH]: (splitContex, node, pos, parent, dom) => {
    const { height: pHeight } = getDomHeight(dom)
    if (!splitContex.isOverflow(pHeight)) {
      splitContex.addHeight(pHeight)
      return false
    }
    const chunks = splitContex.splitResolve(pos)
    if (pHeight > splitContex.getDefaultHeight()) {
      const point = getBreakPos(node, dom, splitContex)
      if (point) {
        splitContex.setBoundary(pos + point, chunks.length)
        return false
      }
    }
    if (parent?.firstChild === node) {
      splitContex.setBoundary(chunks[chunks.length - 2][2], chunks.length - 2)
      return false
    }
    splitContex.setBoundary(pos, chunks.length - 1)
    return false
  },
  [PAGE]: (splitContex, node, pos, parent, dom, startIndex, forcePageId, i) => {
    return startIndex === i && parent?.type.name === 'doc'
  },
  default: (splitContex, node, pos, parent, dom) => {
    const { height: pHeight } = getDomHeight(dom)
    if (!splitContex.isOverflow(pHeight)) {
      splitContex.addHeight(pHeight)
      return false
    }

    const chunks = splitContex.splitResolve(pos)
    if (parent?.firstChild === node) {
      const chunksNext = splitContex.splitResolve(pos + node.nodeSize)
      splitContex.setBoundary(pos + node.nodeSize, chunksNext.length - 1)
      return false
    }
    splitContex.setBoundary(pos, chunks.length - 1)
    return false
  },
}

/**
 * 分页上下文类
 */
export class SplitContext {
  #doc: Node //文档
  #accumolatedHeight = 0 //累加高度
  #pageBoundary: SplitInfo | null = null //返回的切割点
  #height = 0 //分页的高度
  #paragraphDefaultHeight = 0 //p标签的默认高度
  attributes: Record<string, unknown> = {}
  schema: Schema

  /**
   * 获取文档
   * @returns 文档
   */
  getDoc() {
    return this.#doc
  }

  /**
   * 构造函数
   * @param schema schema
   * @param doc 文档
   * @param height 分页高度
   * @param paragraphDefaultHeight p标签的默认高度
   */
  constructor(
    schema: Schema,
    doc: Node,
    height: number,
    paragraphDefaultHeight: number,
  ) {
    this.#doc = doc
    this.#height = height
    this.#paragraphDefaultHeight = paragraphDefaultHeight
    this.schema = schema
  }

  getHeight() {
    return this.#height
  }

  /**
   * 获取默认高度
   * @returns 默认高度
   */
  getDefaultHeight() {
    return this.#paragraphDefaultHeight
  }

  /**
   * 判断是否溢出
   * @param height 增加的高度
   * @returns 是否溢出
   */
  isOverflow(height: number) {
    return this.#accumolatedHeight + height >= this.#height
  }

  /**
   * 增加高度
   * @param height 增加的高度
   */
  addHeight(height: number) {
    this.#accumolatedHeight += height
  }

  /**
   * 设置切割点
   * @param pos 切割点位置
   * @param depth 切割点深度
   */
  setBoundary(pos: number, depth: number) {
    this.#pageBoundary = {
      pos,
      depth,
    }
  }

  /**
   * 获取切割点
   * @returns 切割点
   */
  pageBoundary() {
    return this.#pageBoundary
  }

  /**
   * 解析切割点
   * @param pos 切割点位置
   * @returns 解析结果
   */
  splitResolve(pos: number) {
    // @ts-expect-error, requires fix
    const array = this.#doc.resolve(pos).path
    const chunks = []
    if (array.length <= 3) {
      return array
    }
    const size = 3
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  }

  /**
   * 获取最后一页
   * @returns 最后一页
   */
  lastPage() {
    return this.#doc.lastChild
  }
}

/*
 * PageComputedContext 分页核心计算class
 * */
export class PageComputedContext {
  nodesComputed: NodesComputed
  state: EditorState
  tr: Transaction
  pageState: PageState
  editor: Editor
  restDomIds: string[] = []
  forcePageId: string | null
  startIndex: number

  constructor(
    editor: Editor,
    nodesComputed: NodesComputed,
    pageState: PageState,
    state: EditorState,
  ) {
    this.editor = editor
    this.nodesComputed = nodesComputed
    this.tr = state.tr
    this.state = state
    this.pageState = pageState
    this.restDomIds = []
    this.forcePageId = null
    this.startIndex = 0
  }

  //核心执行逻辑
  run() {
    const { selection, doc } = this.state
    const { inserting, deleting, runState, initSplit, splitPage } =
      this.pageState
    if (!runState) {
      return null
    }
    this.prepare()
    if (splitPage) {
      return this.forceSplit()
    }
    if (initSplit) {
      return this.initComputed()
    }
    if (!inserting && deleting && selection.$head.node(1) === doc.lastChild) {
      return this.tr
    }
    if (inserting || deleting) {
      //const startTime = performance.now()
      this.computed()
      this.checkNodeAndFix()
    }

    return this.tr
  }

  prepare() {
    const { doc } = this.tr
    const { selection } = this.state
    // @ts-expect-error, requires fix
    this.startIndex = doc.content.findIndex(selection.head).index
  }

  computed() {
    const { tr } = this
    const curNunmber = this.startIndex + 1
    if (tr.doc.childCount > 1 && tr.doc.content.childCount !== curNunmber) {
      this.mergeDocument()
    }
    this.splitDocument()
    return this.tr
  }

  /**
   * 文档开始加载的时候进行初始化分页
   */
  initComputed() {
    this.mergeDefaultDocument(1)
    this.splitDocument()
    return this.tr
  }

  /**
   * @description 递归分割page
   */
  splitDocument() {
    const { schema } = this.state
    for (;;) {
      // 获取最后一个page计算高度，如果返回值存在的话证明需要分割
      const splitInfo = this.getNodeHeight()
      if (!splitInfo) {
        return
      }
      const type = getNodeType(PAGE, schema)
      this.lift({
        pos: splitInfo.pos,
        depth: splitInfo.depth,
        typesAfter: [{ type }],
        schema,
      } as SplitParams)
      this.startIndex += 1
    }
  }

  /**
   * 重第count页开始合并page
   * @param count
   */
  mergeDefaultDocument(count: number) {
    const { tr } = this
    if (this.forcePageId) {
      while (true) {
        // @ts-expect-error, requires fix
        const nodeSize = tr.doc.content.content
          .slice(0, count)
          .map((item: Node) => item.nodeSize)
          .reduce((a: number, b: number) => a + b, 0)
        let depth = 1
        if (tr.doc.child(count).attrs.id === this.forcePageId) {
          break
        }
        const currentPage = tr.doc.content.child(count - 1)
        const nextPage = tr.doc.content.child(count)
        if (
          (nextPage.firstChild?.type === currentPage.lastChild?.type ||
            nextPage.firstChild?.type.name.includes(EXTEND)) &&
          nextPage.firstChild?.attrs.extend
        ) {
          depth = 2
          this.restDomIds.push(currentPage.lastChild?.attrs.id)
        }
        tr.join(nodeSize, depth)
      }
    } else {
      //把所有的page 合并成一个 page
      while (tr.doc.content.childCount > count) {
        const nodesize = tr.doc.content.lastChild
          ? tr.doc.content.lastChild.nodeSize
          : 0
        let depth = 1
        //如果 前一页的最后一个node 和后一页的node 是同类 则合并
        if (tr.doc.content.lastChild !== tr.doc.content.firstChild) {
          //获取倒数第二页
          const prePage = tr.doc.content.child(tr.doc.content.childCount - 2)
          //获取最后一页
          const lastPage = tr.doc.content.lastChild
          //如果最后一页的第一个子标签和前一页的最后一个子标签类型一致 或者是扩展类型(是主类型的拆分类型) 进行合并的时候 深度为2

          if (
            (lastPage?.firstChild?.type === prePage.lastChild?.type ||
              lastPage?.firstChild?.type.name.includes(EXTEND)) &&
            lastPage?.firstChild?.attrs.extend
          ) {
            depth = 2
            this.restDomIds.push(prePage.lastChild?.attrs.id)
          }
        }
        tr.join(tr.doc.content.size - nodesize, depth)
      }
    }
    this.tr = tr
  }

  /**
   * @method mergeDocument
   * @description  合并剩余文档 将剩余文档进行分页
   *  深度判断：如果剩余页的 第一个子标签是 扩展类型(是主类型的拆分类型) 进行合并的时候 深度为2
   *  如果第一个标签不是扩展类型 则深度为1
   */
  mergeDocument() {
    const { tr } = this

    let id = null
    for (let i = this.startIndex + 1; i < tr.doc.content.childCount; i++) {
      const node = tr.doc.content.child(i)
      if (node.attrs.force) {
        // eslint-disable-next-line prefer-destructuring
        id = node.attrs.id
        break
      }
    }
    this.forcePageId = id
    //把所有的page 合并成一个 page
    this.mergeDefaultDocument(this.startIndex + 1)
  }

  forceSplit() {
    const { selection, schema } = this.state
    const { $anchor } = selection
    const splitInfo = { pos: $anchor.pos, depth: $anchor.depth }
    const parentNode = findParentNode((node) =>
      LIST_TYPE.includes(node.type.name),
    )(selection)
    if (parentNode) {
      splitInfo.pos = parentNode.start
      splitInfo.depth = parentNode.depth
    }
    const type = getNodeType(PAGE, schema)
    this.lift({
      pos: splitInfo.pos,
      depth: splitInfo.depth,
      typesAfter: [{ type }],
      schema,
      force: true,
    })
    return this.tr
  }

  /**
   * @description 分页主要逻辑 修改系统tr split方法 添加默认 extend判断 默认id重新生成
   * @author Cassie
   * @method splitPage 分割页面
   * @param pos
   * @param depth
   * @param typesAfter
   * @param schema
   * @param force
   */
  lift({ pos, depth = 1, typesAfter, schema, force = false }: SplitParams) {
    const { tr } = this
    const $pos = tr.doc.resolve(pos)
    let before = Fragment.empty
    let after = Fragment.empty
    for (
      let d = $pos.depth, e = $pos.depth - depth, i = depth - 1;
      d > e;
      d--, i--
    ) {
      //新建一个和 $pos.node(d) 一样的节点 内容是 before
      before = Fragment.from($pos.node(d).copy(before))
      const typeAfter = typesAfter?.[i]
      const n = $pos.node(d)
      let na: Node | null = $pos.node(d).copy(after)
      //处理id重复的问题
      if (na.attrs.id) {
        let extend = {}
        if (na.attrs.extend === false) {
          extend = { extend: true }
        }
        //重新生成id
        const attr = Object.assign({}, n.attrs, { id: getId(), ...extend })
        na = schema.nodes[n.type.name].createAndFill(attr, after)
      }
      after = Fragment.from(
        typeAfter
          ? typeAfter.type.create(
              {
                id: getId(),
                pageNumber: (na?.attrs.pageNumber ?? 0) + 1,
                force,
              },
              after,
            )
          : na,
      )
    }
    tr.step(
      new ReplaceStep(pos, pos, new Slice(before.append(after), depth, depth)),
    )
    this.tr = tr
  }

  /**
   * desc 检查并修正分页造成的段落分行问题
   */
  checkNodeAndFix() {
    let { tr } = this
    const { doc } = tr
    const { schema } = this.state
    let beforeBolck: Node | null = null
    doc.descendants((node, pos) => {
      if (node.type === schema.nodes[PARAGRAPH] && node.attrs.extend === true) {
        if (beforeBolck) {
          // console.log('beforeBolck: ' + beforeBolck)
          const mappedPos = tr.mapping.map(pos)
          if (beforeBolck.type !== schema.nodes[PARAGRAPH]) {
            tr = tr.step(
              new ReplaceStep(mappedPos - 1, mappedPos + 1, Slice.empty),
            )
          }
          return false
        }
        beforeBolck = node
      }
      //如果进入了新的扩展块 直接 清除 上次的 记录
      if (node.type === schema.nodes[CASSIE_BLOCK_EXTEND]) {
        beforeBolck = null

        return true
      }
    })
    this.tr = tr
    return this.tr
  }

  /**
   * @description 获取需要分页的点 然后返回
   * @author Cassie
   * @method getNodeHeight 获取节点高度
   */
  getNodeHeight() {
    const { doc } = this.tr
    const { bodyOptions } = this.pageState
    const splitContex = new SplitContext(
      this.state.schema,
      doc,
      bodyOptions?.bodyHeight,
      getDefault(),
    )
    const { nodesComputed } = this
    const { restDomIds } = this
    const { forcePageId } = this
    const { startIndex } = this
    let breakDescendants = false
    doc.descendants((node, pos, parentNode, i) => {
      if (breakDescendants || node.attrs.id === forcePageId) {
        breakDescendants = true
        return false
      }

      if (!splitContex.pageBoundary()) {
        let dom = document.getElementById(node.attrs.id)
        if (
          restDomIds.includes(node.attrs.id) ||
          (!dom && node.type.name !== PAGE)
        ) {
          dom = getAbsentHtmlH(node, this.state.schema)
        }
        return (nodesComputed[node.type.name] || nodesComputed.default)(
          splitContex,
          node,
          pos,
          parentNode,
          dom as HTMLElement,
          startIndex,
          forcePageId ?? '',
          i,
        )
      }
      return false
    })
    return splitContex.pageBoundary() ? splitContex.pageBoundary() : null
  }
}
