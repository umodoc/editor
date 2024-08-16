import {
  Fragment,
  Node as ProseMirrorNode,
  NodeType,
  Slice,
} from '@tiptap/pm/model'
import { TextSelection } from '@tiptap/pm/state'
import { canSplit } from '@tiptap/pm/transform'
import { getNodeType } from '@tiptap/core'
import { getSplittedAttributes } from './index'
import { getId } from './core'

/**
 * 覆盖系统默认分割方法
 * @param typeOrName
 */
export const splitListItem =
  (typeOrName) =>
  ({ tr, state, dispatch, editor }) => {
    const type = getNodeType(typeOrName, state.schema)
    const { $from, $to } = state.selection

    const node = state.selection.node

    if ((node && node.isBlock) || $from.depth < 2 || !$from.sameParent($to)) {
      return false
    }
    const grandParent = $from.node(-1)

    if (grandParent.type !== type) {
      return false
    }

    const extensionAttributes = editor.extensionManager.attributes

    if (
      $from.parent.content.size === 0 &&
      $from.node(-1).childCount === $from.indexAfter(-1)
    ) {
      if (
        $from.depth === 2 ||
        $from.node(-3).type !== type ||
        $from.index(-2) !== $from.node(-2).childCount - 1
      ) {
        return false
      }

      if (dispatch) {
        let wrap = Fragment.empty

        const depthBefore = $from.index(-1) ? 1 : $from.index(-2) ? 2 : 3
        for (let d = $from.depth - depthBefore; d >= $from.depth - 3; d -= 1) {
          wrap = Fragment.from($from.node(d).copy(wrap))
        }
        const depthAfter =
          $from.indexAfter(-1) < $from.node(-2).childCount
            ? 1
            : $from.indexAfter(-2) < $from.node(-3).childCount
              ? 2
              : 3

        const newNextTypeAttributes = getSplittedAttributes(
          extensionAttributes,
          $from.node().type.name,
          $from.node().attrs,
        )
        const nextType =
          type.contentMatch.defaultType.createAndFill(newNextTypeAttributes) ||
          undefined

        wrap = wrap.append(
          Fragment.from(type.createAndFill(null, nextType) || undefined),
        )

        const start = $from.before($from.depth - (depthBefore - 1))

        tr.replace(
          start,
          $from.after(-depthAfter),
          new Slice(wrap, 4 - depthBefore, 0),
        )

        let sel = -1

        tr.doc.nodesBetween(start, tr.doc.content.size, (n, pos) => {
          if (sel > -1) {
            return false
          }

          if (n.isTextblock && n.content.size === 0) {
            sel = pos + 1
          }
        })

        if (sel > -1) {
          tr.setSelection(TextSelection.near(tr.doc.resolve(sel)))
        }

        tr.scrollIntoView()
      }

      return true
    }

    const nextType =
      $to.pos === $from.end() ? grandParent.contentMatchAt(0).defaultType : null
    const newTypeAttributes = getSplittedAttributes(
      extensionAttributes,
      grandParent.type.name,
      grandParent.attrs,
    )
    const newNextTypeAttributes = getSplittedAttributes(
      extensionAttributes,
      $from.node().type.name,
      $from.node().attrs,
    )
    newTypeAttributes.id = getId()
    newNextTypeAttributes.id = getId()
    tr.delete($from.pos, $to.pos)
    const types = nextType
      ? [
          { type, attrs: newTypeAttributes },
          { type: nextType, attrs: newNextTypeAttributes },
        ]
      : [{ type, attrs: newTypeAttributes }]

    if (!canSplit(tr.doc, $from.pos, 2)) {
      return false
    }

    if (dispatch) {
      const { selection, storedMarks } = state
      const { splittableMarks } = editor.extensionManager
      const marks =
        storedMarks || (selection.$to.parentOffset && selection.$from.marks())

      tr.split($from.pos, 2, types).scrollIntoView()

      if (!marks || !dispatch) {
        return true
      }

      const filteredMarks = marks.filter((mark) =>
        splittableMarks.includes(mark.type.name),
      )

      tr.ensureMarks(filteredMarks)
    }
    return true
  }
