import nzh from 'nzh'

const LIST_ITEM_NODE_NAMES = new Set(['listItem', 'taskItem'])
const LIST_NODE_NAMES = new Set(['orderedList', 'bulletList', 'taskList'])
const BULLET_MARKERS = {
  disc: '•',
  circle: '◦',
  square: '▪',
}
const metricResizeCallbacks = new WeakMap()
let listItemMetricResizeObserver = null

export const normalizeOrderedListStart = (value) => {
  const nextValue = Number(value)
  return Number.isFinite(nextValue) && nextValue > 0 ? nextValue : 1
}

const toRoman = (value) => {
  if (!Number.isInteger(value) || value <= 0) {
    return String(value || '')
  }
  const map = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ]
  let current = value
  let result = ''
  map.forEach(([number, symbol]) => {
    while (current >= number) {
      result += symbol
      current -= number
    }
  })
  return result
}

const toLatin = (value) => {
  if (!Number.isInteger(value) || value <= 0) {
    return String(value || '')
  }
  let current = value
  let result = ''
  while (current > 0) {
    current -= 1
    result = String.fromCharCode(97 + (current % 26)) + result
    current = Math.floor(current / 26)
  }
  return result
}

export const formatOrderedValue = (value, listType) => {
  switch (listType) {
    case 'decimal-leading-zero':
      return value < 10 ? `0${value}` : String(value)
    case 'lower-roman':
      return toRoman(value).toLowerCase()
    case 'upper-roman':
      return toRoman(value)
    case 'lower-latin':
      return toLatin(value)
    case 'upper-latin':
      return toLatin(value).toUpperCase()
    case 'trad-chinese-informal':
      return nzh.cn.encodeS(value)
    case 'simp-chinese-formal':
      return nzh.cn.encodeB(value)
    default:
      return String(value)
  }
}

const getListItemResolvedPos = (state, listItemPos = null) => {
  if (!state) {
    return null
  }

  if (typeof listItemPos === 'number') {
    return state.doc.resolve(listItemPos + 1)
  }

  return state.selection.$from
}

const getListItemDepth = ($pos) => {
  if (!$pos) {
    return null
  }

  const { depth: maxDepth } = $pos
  for (let depth = maxDepth; depth > 0; depth -= 1) {
    const { type } = $pos.node(depth)
    if (LIST_ITEM_NODE_NAMES.has(type?.name)) {
      return depth
    }
  }

  return null
}

export const getListItemContext = (state, listItemPos = null) => {
  const $pos = getListItemResolvedPos(state, listItemPos)
  if (!$pos) {
    return null
  }

  const listItemDepth = getListItemDepth($pos)
  if (listItemDepth === null) {
    return null
  }

  const listDepth = listItemDepth - 1
  const listNode = $pos.node(listDepth)
  if (!LIST_NODE_NAMES.has(listNode?.type?.name)) {
    return null
  }

  const listItemNode = $pos.node(listItemDepth)
  const listPos = $pos.before(listDepth)
  const resolvedListItemPos = $pos.before(listItemDepth)
  const listItemIndex = $pos.index(listDepth)

  const baseContext = {
    $pos,
    listDepth,
    listPos,
    listNode,
    listTypeName: listNode.type.name,
    listItemDepth,
    listItemNode,
    listItemPos: resolvedListItemPos,
    listItemIndex,
    itemTypeName: listItemNode.type.name,
    checked: listItemNode.attrs?.checked === true,
  }

  if (listNode.type.name === 'orderedList') {
    const orderedListStart = normalizeOrderedListStart(listNode.attrs.start)
    const currentNumber = orderedListStart + listItemIndex
    const markerSegments = []

    for (let depth = 1; depth < listItemDepth; depth += 1) {
      const currentNode = $pos.node(depth)
      if (currentNode?.type?.name !== 'orderedList') {
        continue
      }
      const start = normalizeOrderedListStart(currentNode.attrs.start)
      const index = $pos.index(depth)
      const value = start + index
      markerSegments.push(formatOrderedValue(value, currentNode.attrs.listType))
    }

    const parentDepth = listDepth - 1
    const parentNode = $pos.node(parentDepth)
    const orderedListIndexInParent = $pos.index(parentDepth)
    let previousOrderedList = null

    for (let index = orderedListIndexInParent - 1; index >= 0; index -= 1) {
      const sibling = parentNode.child(index)
      if (sibling?.type?.name === 'orderedList') {
        previousOrderedList = sibling
        break
      }
    }

    return {
      ...baseContext,
      orderedListDepth: listDepth,
      orderedListPos: listPos,
      orderedListNode: listNode,
      orderedListStart,
      currentNumber,
      markerText: `${markerSegments.join('.')}.`,
      previousOrderedList,
      previousOrderedListStart: previousOrderedList
        ? normalizeOrderedListStart(previousOrderedList.attrs.start)
        : null,
    }
  }

  if (listNode.type.name === 'bulletList') {
    const listType = listNode.attrs.listType || 'disc'

    return {
      ...baseContext,
      listType,
      markerText: BULLET_MARKERS[listType] || BULLET_MARKERS.disc,
    }
  }

  return {
    ...baseContext,
    markerText: '',
  }
}

export const getOrderedListContext = (state, listItemPos = null) => {
  const context = getListItemContext(state, listItemPos)
  return context?.listTypeName === 'orderedList' ? context : null
}

export const getActiveListItemPos = (state) =>
  getListItemContext(state)?.listItemPos ?? null

export const getContinueOrderedListStart = (context) => {
  if (!context) {
    return null
  }

  if (context.listItemIndex > 0) {
    return context.currentNumber
  }

  if (context.previousOrderedList) {
    return (
      context.previousOrderedListStart + context.previousOrderedList.childCount
    )
  }

  return context.orderedListStart
}

export const isContinueOrderedListNumberingUnchanged = (context) => {
  if (!context) {
    return true
  }

  const nextStart = getContinueOrderedListStart(context)
  if (context.listItemIndex > 0) {
    const previousSegmentEnd =
      context.orderedListStart + context.listItemIndex - 1
    return previousSegmentEnd + 1 === nextStart
  }

  if (!context.previousOrderedList) {
    return true
  }

  return nextStart === context.orderedListStart
}

const LIST_STRUCTURE_NODE_NAMES = new Set([
  'orderedList',
  'bulletList',
  'taskList',
  'listItem',
  'taskItem',
])

const hasListNodeInRange = (doc, from, to) => {
  let found = false

  doc.nodesBetween(from, to, (node) => {
    if (LIST_STRUCTURE_NODE_NAMES.has(node.type?.name)) {
      found = true
      return false
    }
    return true
  })

  return found
}

export const hasListStructureChange = (tr) => {
  if (!tr.docChanged) {
    return false
  }

  let changed = false

  tr.mapping.maps.forEach((map) => {
    if (changed) {
      return
    }

    map.forEach((_oldStart, _oldEnd, newStart, newEnd) => {
      if (changed) {
        return
      }

      const from = Math.max(0, Math.min(newStart, newEnd) - 1)
      const to = Math.min(tr.doc.content.size, Math.max(newStart, newEnd) + 1)

      if (hasListNodeInRange(tr.doc, from, to)) {
        changed = true
      }
    })
  })

  return changed
}

const getListItemMetricResizeObserver = () => {
  if (typeof window === 'undefined' || typeof ResizeObserver === 'undefined') {
    return null
  }

  if (!listItemMetricResizeObserver) {
    listItemMetricResizeObserver = new ResizeObserver((entries) => {
      entries.forEach(({ target }) => {
        metricResizeCallbacks.get(target)?.()
      })
    })
  }

  return listItemMetricResizeObserver
}

export const observeListItemMetricResize = (element, callback) => {
  if (!element || typeof callback !== 'function') {
    return
  }

  metricResizeCallbacks.set(element, callback)
  getListItemMetricResizeObserver()?.observe(element)
}

export const unobserveListItemMetricResize = (element) => {
  if (!element) {
    return
  }

  metricResizeCallbacks.delete(element)
  getListItemMetricResizeObserver()?.unobserve(element)
}
