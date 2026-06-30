import {
  chainCommands,
  createParagraphNear,
  newlineInCode,
  splitBlock,
} from '@tiptap/pm/commands'
import { keymap } from '@tiptap/pm/keymap'
import { TextSelection } from '@tiptap/pm/state'
import { canSplit, liftTarget } from '@tiptap/pm/transform'

const findParentNodeByType = ($pos, typeName) => {
  for (let { depth } = $pos; depth > 0; depth--) {
    const node = $pos.node(depth)
    if (node.type.name === typeName) {
      return {
        node,
        depth,
        index: depth > 0 ? $pos.index(depth - 1) : 0,
        pos: depth > 0 ? $pos.before(depth) : 0,
      }
    }
  }
  return null
}

const findParentColumn = ($pos) => findParentNodeByType($pos, 'column')

const findParentColumnContainer = ($pos) =>
  findParentNodeByType($pos, 'columnContainer')

const getNodeOffset = (parent, targetIndex) => {
  let offset = 0
  for (let index = 0; index < targetIndex; index += 1) {
    offset += parent.child(index).nodeSize
  }
  return offset
}

const deleteEmptyColumnBackward = (state, dispatch) => {
  const { $cursor } = state.selection
  if (!$cursor || !state.selection.empty) return false
  if ($cursor.parent.type.name !== 'paragraph') return false
  if ($cursor.parentOffset !== 0 || $cursor.parent.content.size > 0)
    return false

  const column = findParentColumn($cursor)
  const container = findParentColumnContainer($cursor)
  if (!column || !container) return false
  if (container.node.childCount <= 1) return false
  if (
    column.node.childCount !== 1 ||
    column.node.firstChild?.type?.name !== 'paragraph' ||
    column.node.firstChild.content.size > 0
  ) {
    return false
  }

  const tr = state.tr.delete(column.pos, column.pos + column.node.nodeSize)
  const hasPrevColumn = column.index > 0
  const selectionPos = hasPrevColumn
    ? container.pos +
      1 +
      getNodeOffset(container.node, column.index - 1) +
      container.node.child(column.index - 1).nodeSize -
      2
    : container.pos + 2
  const direction = hasPrevColumn ? -1 : 1

  tr.setSelection(TextSelection.near(tr.doc.resolve(selectionPos), direction))
  if (dispatch) {
    dispatch(tr.scrollIntoView())
  }
  return true
}

export const liftEmptyBlock = (state, dispatch) => {
  const { $cursor } = state.selection
  if (!$cursor || $cursor.parent.content.size) return false
  if ('column' === $cursor.node($cursor.depth - 1).type.name) return false
  if ($cursor.depth > 1 && $cursor.after() !== $cursor.end(-1)) {
    const before = $cursor.before()
    if (canSplit(state.doc, before)) {
      if (dispatch) dispatch(state.tr.split(before).scrollIntoView())
      return true
    }
  }
  const range = $cursor.blockRange(),
    target = range && liftTarget(range)
  if (target === null) return false
  if (dispatch) dispatch(state.tr.lift(range, target).scrollIntoView())
  return true
}

export const columnsKeymap = keymap({
  Backspace: deleteEmptyColumnBackward,
  Enter: chainCommands(
    newlineInCode,
    createParagraphNear,
    liftEmptyBlock,
    splitBlock,
  ),
  'Mod-a': (state, dispatch) => {
    const { selection } = state
    const { $from } = selection
    const found = findParentColumn($from)
    if (found) {
      const { depth } = found
      const start = $from.start(depth)
      const end = $from.end(depth)
      const tr = state.tr.setSelection(
        TextSelection.create(state.doc, start, end),
      )
      if (dispatch) dispatch(tr)
      return true
    }
    return false
  },
})
