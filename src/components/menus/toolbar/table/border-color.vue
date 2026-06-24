<template>
  <menus-button
    ico="table"
    :text="t('table.borderColor')"
    menu-type="popup"
    huge
    :disabled="!editor?.can().setCellAttribute('borderColor', '')"
    :popup-visible="popupVisible"
    @toggle-popup="togglePopup"
  >
    <template #content>
      <t-space>
        <div>{{ t('table.cellBorderColor.cell') }}</div>
        <picker-color default-color="" @change="cellBorderColorChange" />
      </t-space>
      <t-divider size="5px" />
      <t-space direction="vertical">
        <div v-for="item in options" :key="item.value">
          <t-space>
            <div>{{ item.label }}</div>
            <t-popup
              trigger="click"
              placement="right-bottom"
              :visible="item.popVisible"
            >
              <t-tag
                theme="primary"
                :color="item.color"
                @click="togglePop(item)"
                >{{ item.color }}</t-tag
              >
              <template #content>
                <t-card>
                  <picker-color
                    default-color=""
                    @change="borderColorChange($event, item)"
                  />
                </t-card>
              </template>
            </t-popup>
          </t-space>
        </div>
      </t-space>
    </template>
  </menus-button>
</template>

<script setup>
import { onMounted, inject } from 'vue'
import { CellSelection } from '@tiptap/pm/tables'
import { toRef } from 'vue'

const emits = defineEmits(['change'])

const { popupVisible, togglePopup } = usePopup()

const editor = inject('editor')
const defaultColor = '#000'
const options = ref([
  {
    value: 'borderTop',
    label: t('table.cellBorderColor.top'),
    color: defaultColor,
    side: 'top',
    popVisible: false,
  },
  {
    value: 'borderBottom',
    label: t('table.cellBorderColor.bottom'),
    color: defaultColor,
    side: 'bottom',
    popVisible: false,
  },
  {
    value: 'borderLeft',
    label: t('table.cellBorderColor.left'),
    color: defaultColor,
    side: 'left',
    popVisible: false,
  },
  {
    value: 'borderRight',
    label: t('table.cellBorderColor.right'),
    color: defaultColor,
    side: 'right',
    popVisible: false,
  },
])

const togglePop = (record) => {
  record.popVisible = !record.popVisible
}
/**
 * 判断是否为单元格节点
 */
function isTableCellNode(node) {
  return ['tableCell', 'tableHeader'].includes(node.type.name)
}

/**
 * 获取左侧同行单元格
 */
function getLeftCellNode(_pos, row, col, doc) {
  if (col <= 0) return null
  let targetPos = null
  let targetNode = null
  let found = false
  doc.descendants((node, nodePos) => {
    if (found) return false
    if (!isTableCellNode(node)) return true
    const $cell = doc.resolve(nodePos)
    const r = $cell.index($cell.depth - 1)
    const c = $cell.index()
    if (r === row && c === col - 1) {
      targetPos = nodePos
      targetNode = node
      found = true
      return false
    }
  })
  return found ? { pos: targetPos, node: targetNode } : null
}

/**
 * 获取上方同列单元格
 */
function getTopCellNode(_pos, row, col, doc) {
  if (row <= 0) return null
  let targetPos = null
  let targetNode = null
  let found = false
  doc.descendants((node, nodePos) => {
    if (found) return false
    if (!isTableCellNode(node)) return true
    const $cell = doc.resolve(nodePos)
    const r = $cell.index($cell.depth - 1)
    const c = $cell.index()
    if (r === row - 1 && c === col) {
      targetPos = nodePos
      targetNode = node
      found = true
      return false
    }
  })
  return found ? { pos: targetPos, node: targetNode } : null
}

/**
 * 获取右侧同行单元格
 */
function getRightCellNode(_pos, row, col, doc) {
  let targetPos = null
  let targetNode = null
  let found = false
  doc.descendants((node, nodePos) => {
    if (found) return false
    if (!isTableCellNode(node)) return true
    const $cell = doc.resolve(nodePos)
    const r = $cell.index($cell.depth - 1)
    const c = $cell.index()
    if (r === row && c === col + 1) {
      targetPos = nodePos
      targetNode = node
      found = true
      return false
    }
  })
  return found ? { pos: targetPos, node: targetNode } : null
}

/**
 * 获取下方同列单元格
 */
function getBottomCellNode(_pos, row, col, doc) {
  let targetPos = null
  let targetNode = null
  let found = false
  doc.descendants((node, nodePos) => {
    if (found) return false
    if (!isTableCellNode(node)) return true
    const $cell = doc.resolve(nodePos)
    const r = $cell.index($cell.depth - 1)
    const c = $cell.index()
    if (r === row + 1 && c === col) {
      targetPos = nodePos
      targetNode = node
      found = true
      return false
    }
  })
  return found ? { pos: targetPos, node: targetNode } : null
}

/**
 * 获取单元格选区范围信息（对齐Word选区计算）
 * @returns {null|{minRow,maxRow,minCol,maxCol,cells:Array<{pos,row,col,node}>}}
 */
function getCellSelectionRange() {
  if (!editor.value) return null
  const { state } = editor.value
  const { selection } = state

  // 官方判断单元格选区
  if (!(selection instanceof CellSelection)) return null

  let minRow = Infinity,
    maxRow = -Infinity
  let minCol = Infinity,
    maxCol = -Infinity
  const cells = []

  // ✅ 官方正确遍历选中单元格，自动包含 th + td
  selection.forEachCell((cellNode, cellPos) => {
    // 解析单元格位置
    const $cell = state.doc.resolve(cellPos)
    const rowIndex = $cell.index($cell.depth - 1)
    const colIndex = $cell.index()

    minRow = Math.min(minRow, rowIndex)
    maxRow = Math.max(maxRow, rowIndex)
    minCol = Math.min(minCol, colIndex)
    maxCol = Math.max(maxCol, colIndex)
    cells.push({
      pos: cellPos,
      row: rowIndex,
      col: colIndex,
      node: cellNode,
    })
  })
  return { minRow, maxRow, minCol, maxCol, cells }
}

/**
 * 设置选区单侧外边框颜色（Word逻辑：仅外围边生效 + 双向同步邻格边框，解决collapse边框遮盖）
 * @param {'top'|'bottom'|'left'|'right'} side
 * @param {string|null} color
 */
function setSelectionOuterBorderColor(side, color) {
  const editorIns = editor.value
  if (!editorIns) return
  const { state } = editorIns
  const { doc } = state

  const range = getCellSelectionRange()
  // 单选单元格降级逻辑
  if (!range) {
    const cellPos = state.selection.$head.pos
    const $cell = doc.resolve(cellPos)
    const cellNode = $cell.parent
    const rowIndex = $cell.index($cell.depth - 1)
    const colIndex = $cell.index()

    let { tr } = state
    // 1、修改当前单元格目标边框
    const propSelf = `border-${side}-color`
    let styleSelf = cellNode.attrs.style || ''
    styleSelf = styleSelf
      .replace(new RegExp(`${propSelf}\\s*:[^;]+;?`, 'gi'), '')
      .trim()
    if (color) styleSelf += `${propSelf}: ${color};`
    tr = tr.setNodeMarkup(cellPos, null, {
      ...cellNode.attrs,
      style: styleSelf || null,
    })

    // 2、按方向同步对面相邻单元格反向边框（核心逻辑：改B左边=同步A右边）
    if (side === 'left') {
      const leftCell = getLeftCellNode(cellPos, rowIndex, colIndex, doc)
      if (leftCell) {
        let s = leftCell.node.attrs.style || ''
        s = s.replace(/border-right-color\s*:[^;]+;?/gi, '').trim()
        if (color) s += `border-right-color: ${color};`
        tr = tr.setNodeMarkup(leftCell.pos, null, {
          ...leftCell.node.attrs,
          style: s || null,
        })
      }
    }
    if (side === 'top') {
      const topCell = getTopCellNode(cellPos, rowIndex, colIndex, doc)
      if (topCell) {
        let s = topCell.node.attrs.style || ''
        s = s.replace(/border-bottom-color\s*:[^;]+;?/gi, '').trim()
        if (color) s += `border-bottom-color: ${color};`
        tr = tr.setNodeMarkup(topCell.pos, null, {
          ...topCell.node.attrs,
          style: s || null,
        })
      }
    }
    if (side === 'right') {
      const rightCell = getRightCellNode(cellPos, rowIndex, colIndex, doc)
      if (rightCell) {
        let s = rightCell.node.attrs.style || ''
        s = s.replace(/border-left-color\s*:[^;]+;?/gi, '').trim()
        if (color) s += `border-left-color: ${color};`
        tr = tr.setNodeMarkup(rightCell.pos, null, {
          ...rightCell.node.attrs,
          style: s || null,
        })
      }
    }
    if (side === 'bottom') {
      const bottomCell = getBottomCellNode(cellPos, rowIndex, colIndex, doc)
      if (bottomCell) {
        let s = bottomCell.node.attrs.style || ''
        s = s.replace(/border-top-color\s*:[^;]+;?/gi, '').trim()
        if (color) s += `border-top-color: ${color};`
        tr = tr.setNodeMarkup(bottomCell.pos, null, {
          ...bottomCell.node.attrs,
          style: s || null,
        })
      }
    }

    if (tr.docChanged) {
      editorIns.view.dispatch(tr)
      editorIns.commands.focus()
    }
    return
  }

  // 多选单元格批量处理
  const { minRow, maxRow, minCol, maxCol, cells } = range
  let { tr } = state

  cells.forEach(({ pos, row, col, node }) => {
    let isOuterEdge = false
    switch (side) {
      case 'left':
        isOuterEdge = col === minCol
        break
      case 'right':
        isOuterEdge = col === maxCol
        break
      case 'top':
        isOuterEdge = row === minRow
        break
      case 'bottom':
        isOuterEdge = row === maxRow
        break
    }
    if (!isOuterEdge) return

    // 修改当前单元格对应边颜色
    const propSelf = `border-${side}-color`
    let styleSelf = node.attrs.style || ''
    styleSelf = styleSelf
      .replace(new RegExp(`${propSelf}\\s*:[^;]+;?`, 'gi'), '')
      .trim()
    if (color) styleSelf += `${propSelf}: ${color};`
    tr = tr.setNodeMarkup(pos, null, {
      ...node.attrs,
      style: styleSelf || null,
    })

    // 同步相邻反向边框
    if (side === 'left') {
      const leftCell = getLeftCellNode(pos, row, col, doc)
      if (leftCell) {
        let s = leftCell.node.attrs.style || ''
        s = s.replace(/border-right-color\s*:[^;]+;?/gi, '').trim()
        if (color) s += `border-right-color: ${color};`
        tr = tr.setNodeMarkup(leftCell.pos, null, {
          ...leftCell.node.attrs,
          style: s || null,
        })
      }
    }
    if (side === 'top') {
      const topCell = getTopCellNode(pos, row, col, doc)
      if (topCell) {
        let s = topCell.node.attrs.style || ''
        s = s.replace(/border-bottom-color\s*:[^;]+;?/gi, '').trim()
        if (color) s += `border-bottom-color: ${color};`
        tr = tr.setNodeMarkup(topCell.pos, null, {
          ...topCell.node.attrs,
          style: s || null,
        })
      }
    }
    if (side === 'right') {
      const rightCell = getRightCellNode(pos, row, col, doc)
      if (rightCell) {
        let s = rightCell.node.attrs.style || ''
        s = s.replace(/border-left-color\s*:[^;]+;?/gi, '').trim()
        if (color) s += `border-left-color: ${color};`
        tr = tr.setNodeMarkup(rightCell.pos, null, {
          ...rightCell.node.attrs,
          style: s || null,
        })
      }
    }
    if (side === 'bottom') {
      const bottomCell = getBottomCellNode(pos, row, col, doc)
      if (bottomCell) {
        let s = bottomCell.node.attrs.style || ''
        s = s.replace(/border-top-color\s*:[^;]+;?/gi, '').trim()
        if (color) s += `border-top-color: ${color};`
        tr = tr.setNodeMarkup(bottomCell.pos, null, {
          ...bottomCell.node.attrs,
          style: s || null,
        })
      }
    }
  })

  if (tr.docChanged) {
    editorIns.view.dispatch(tr)
    editorIns.commands.focus()
  }
}

/**
 * 整体单元格四周边框统一改色（顶部“单元格”入口）
 */
const cellBorderColorChange = (color) => {
  popupVisible.value = false
  const targetColor = color === '' ? null : color
  // 四条边全部按Word外框逻辑设置
  setSelectionOuterBorderColor('top', targetColor)
  setSelectionOuterBorderColor('bottom', targetColor)
  setSelectionOuterBorderColor('left', targetColor)
  setSelectionOuterBorderColor('right', targetColor)
}

/**
 * 单方向边框颜色修改（上下左右单独下拉选色）
 */
const borderColorChange = (color, record) => {
  record.popVisible = false
  record.color = color
  const targetColor = color === '' ? null : color
  setSelectionOuterBorderColor(record.side, targetColor)
}
</script>
