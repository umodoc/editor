import { Extension, mergeAttributes, Node } from '@tiptap/core'
import { Plugin, TextSelection } from '@tiptap/pm/state'
import { ReplaceStep } from '@tiptap/pm/transform'

import { columnsKeymap } from './keymap'
import { gridResizingPlugin } from './resize'

const Column = Node.create({
  name: 'column',
  group: 'block',
  content: 'block+',
  addAttributes() {
    return {
      colWidth: {
        default: 200,
        parseHTML: (element) => {
          const width = element.style.width.replace('px', '')
          return Number(width) || 200
        },
        renderHTML: (attributes) => {
          const style = attributes.colWidth
            ? `width: ${attributes.colWidth}px;`
            : ''
          return { style }
        },
      },
    }
  },
  parseHTML() {
    return [
      {
        tag: 'div.umo-node-column',
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { class: 'umo-node-column' }),
      0,
    ]
  },
})

const ColumnContainer = Node.create({
  name: 'columnContainer',
  group: 'block',
  content: 'column+',
  parseHTML() {
    return [
      {
        tag: 'div.umo-node-column-container',
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        class: 'umo-node-column-container',
      }),
      0,
    ]
  },
})

const findParentNodeByType = ($pos, typeName) => {
  const { depth: maxDepth } = $pos
  for (let depth = maxDepth; depth > 0; depth -= 1) {
    const node = $pos.node(depth)
    if (node.type.name === typeName) {
      return {
        node,
        depth,
        pos: $pos.before(depth),
      }
    }
  }
  return null
}

const insertedColumnContainer = (tr) => {
  for (const step of tr.steps) {
    if (!(step instanceof ReplaceStep) || step.slice.size === 0) {
      continue
    }

    let found = false
    step.slice.content.descendants((node) => {
      if (node?.type?.name === 'columnContainer') {
        found = true
        return false
      }
      return true
    })

    if (found) {
      return true
    }
  }

  return false
}

const getInsertedContainerAtSelection = ($from) => {
  const parentContainer = findParentNodeByType($from, 'columnContainer')
  if (parentContainer) {
    return parentContainer
  }

  if ($from.nodeBefore?.type?.name === 'columnContainer') {
    return {
      node: $from.nodeBefore,
      pos: $from.pos - $from.nodeBefore.nodeSize,
    }
  }

  if ($from.nodeAfter?.type?.name === 'columnContainer') {
    return {
      node: $from.nodeAfter,
      pos: $from.pos,
    }
  }

  return null
}

const focusFirstColumnPlugin = () =>
  new Plugin({
    appendTransaction(transactions, _oldState, newState) {
      if (transactions.some((tr) => tr.getMeta('columnsAutoFocus'))) {
        return null
      }
      if (!transactions.some((tr) => tr.docChanged)) {
        return null
      }
      if (!transactions.some(insertedColumnContainer)) {
        return null
      }

      const { selection } = newState
      if (!selection.empty) {
        return null
      }

      const { $from } = selection
      const containerInfo = getInsertedContainerAtSelection($from)
      if (!containerInfo) {
        return null
      }

      const { node: container, pos: containerPos } = containerInfo
      const firstColumn = container.firstChild
      const firstBlock = firstColumn?.firstChild
      if (firstColumn?.type?.name !== 'column' || !firstBlock?.isTextblock) {
        return null
      }

      const firstColumnTextPos = containerPos + 2
      if (selection.from === firstColumnTextPos) {
        return null
      }

      return newState.tr
        .setMeta('columnsAutoFocus', true)
        .setSelection(TextSelection.create(newState.doc, firstColumnTextPos))
        .scrollIntoView()
    },
  })

export default Extension.create({
  name: 'columns',
  addExtensions() {
    return [Column, ColumnContainer]
  },
  addCommands() {},
  addProseMirrorPlugins() {
    return [
      focusFirstColumnPlugin(),
      gridResizingPlugin({ handleWidth: 2, columnMinWidth: 50 }),
      columnsKeymap,
    ]
  },
})
