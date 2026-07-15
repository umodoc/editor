import { OrderedList } from '@tiptap/extension-list'
import { Fragment, Slice } from '@tiptap/pm/model'
import { TextSelection } from '@tiptap/pm/state'

import {
  getContinueOrderedListStart,
  getOrderedListContext,
  isContinueOrderedListNumberingUnchanged,
  normalizeOrderedListStart,
} from './list-item/utils'

const focusListItem = (tr, listItemPos) => {
  const nextPos = Math.min(listItemPos + 2, tr.doc.content.size)
  return tr.setSelection(TextSelection.near(tr.doc.resolve(nextPos)))
}

const updateOrderedListStart = (tr, context, start) => {
  tr.setNodeMarkup(context.orderedListPos, undefined, {
    ...context.orderedListNode.attrs,
    start: normalizeOrderedListStart(start),
  })
  return focusListItem(tr, context.listItemPos)
}

const splitOrderedListAtItem = (tr, context, start) => {
  const firstChildren = []
  const secondChildren = []

  context.orderedListNode.forEach((child, _offset, index) => {
    if (index < context.listItemIndex) {
      firstChildren.push(child)
      return
    }
    secondChildren.push(child)
  })

  const firstList = context.orderedListNode.type.create(
    {
      ...context.orderedListNode.attrs,
      start: context.orderedListStart,
    },
    firstChildren,
  )
  const secondList = context.orderedListNode.type.create(
    {
      ...context.orderedListNode.attrs,
      start: normalizeOrderedListStart(start),
    },
    secondChildren,
  )

  tr.replace(
    context.orderedListPos,
    context.orderedListPos + context.orderedListNode.nodeSize,
    new Slice(Fragment.fromArray([firstList, secondList]), 0, 0),
  )

  const secondListPos = context.orderedListPos + firstList.nodeSize
  return focusListItem(tr, secondListPos + 1)
}

const applyOrderedListStartAtItem = (tr, context, start) => {
  return context.listItemIndex > 0
    ? splitOrderedListAtItem(tr, context, start)
    : updateOrderedListStart(tr, context, start)
}

const isStartNewOrderedListUnchanged = (context) =>
  context.listItemIndex === 0 && context.orderedListStart === 1

const isOrderedListStartUnchanged = (context, start) => {
  const nextStart = normalizeOrderedListStart(start)

  return context.listItemIndex === 0
    ? nextStart === context.orderedListStart
    : nextStart === context.currentNumber
}

const withOrderedListContext =
  ({ listItemPos, getStart, shouldSkip }) =>
  ({ state, dispatch }) => {
    const context = getOrderedListContext(state, listItemPos)
    if (!context) {
      return false
    }

    if (shouldSkip?.(context)) {
      return true
    }

    const nextStart = normalizeOrderedListStart(getStart(context))
    const tr = applyOrderedListStartAtItem(state.tr, context, nextStart)

    if (dispatch) {
      dispatch(tr.scrollIntoView())
    }

    return true
  }

const createOrderedListStartCommand =
  ({ getStart, shouldSkip }) =>
  ({ listItemPos, start } = {}) =>
    withOrderedListContext({
      listItemPos,
      getStart: (context) => getStart(context, start),
      shouldSkip: shouldSkip
        ? (context) => shouldSkip(context, start)
        : undefined,
    })

export default OrderedList.extend({
  content: 'listItem*',
  addAttributes() {
    return {
      ...this.parent?.(),
      listType: {
        default: 'decimal',
        parseHTML: (element) =>
          element.style.getPropertyValue('list-style-type') || 'decimal',
        renderHTML: ({ listType }) => {
          return {
            style: `list-style-type: ${listType}`,
            'data-type': listType,
          }
        },
      },
      start: {
        default: 1,
        parseHTML: (element) => {
          const start = element.getAttribute('data-start')
          return start ? Number(start) : 1
        },
        renderHTML: (attributes) => {
          if (attributes.start === 1) {
            return {}
          }
          return {
            'data-start': attributes.start,
          }
        },
      },
    }
  },
  addCommands() {
    return {
      ...this.parent?.(),
      continueOrderedListNumberingAtItem: createOrderedListStartCommand({
        getStart: getContinueOrderedListStart,
        shouldSkip: isContinueOrderedListNumberingUnchanged,
      }),
      startNewOrderedListAtItem: createOrderedListStartCommand({
        getStart: () => 1,
        shouldSkip: isStartNewOrderedListUnchanged,
      }),
      setOrderedListStartAtItem: createOrderedListStartCommand({
        getStart: (_context, start) => start,
        shouldSkip: isOrderedListStartUnchanged,
      }),
    }
  },
})
