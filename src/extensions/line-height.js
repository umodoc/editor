import { Extension } from '@tiptap/core'
import { NodeSelection } from '@tiptap/pm/state'

export default Extension.create({
  name: 'lineHeight',
  addOptions() {
    return {
      types: ['heading', 'paragraph'],
      defaultLineHeight: 1.75,
    }
  },
  findClosestTargetNode(state, typeNames) {
    const { selection } = state
    if (selection instanceof NodeSelection) {
      const { node } = selection
      if (node && typeNames.includes(node.type.name)) {
        return { node, pos: selection.from }
      }
    }
    const { $from } = selection
    for (let { depth } = $from; depth > 0; depth -= 1) {
      const node = $from.node(depth)
      if (typeNames.includes(node.type.name)) {
        return { node, pos: $from.before(depth) }
      }
    }
    return null
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: this.options.defaultLineHeight,
            parseHTML: (element) =>
              element.style.lineHeight || this.options.defaultLineHeight,
            renderHTML: (attributes) => {
              if (attributes.lineHeight === this.options.defaultLineHeight) {
                return {}
              }
              return { style: `line-height: ${attributes.lineHeight}` }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setLineHeight:
        (lineHeight) =>
        ({ editor, state, dispatch }) => {
          const typeNames = this.options.types.filter(
            (type) => editor.schema.nodes[type],
          )

          let { tr } = state
          let updated = false

          state.doc.nodesBetween(
            state.selection.from,
            state.selection.to,
            (node, pos) => {
              if (!typeNames.includes(node.type.name)) return
              if (node.attrs.lineHeight === lineHeight) {
                updated = true
                return
              }
              tr = tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                lineHeight,
              })
              updated = true
            },
          )

          if (!updated) {
            const target = this.findClosestTargetNode(state, typeNames)
            if (!target) return false
            if (target.node.attrs.lineHeight === lineHeight) {
              return true
            }
            tr = tr.setNodeMarkup(target.pos, undefined, {
              ...target.node.attrs,
              lineHeight,
            })
            updated = true
          }

          if (dispatch && tr.docChanged) {
            dispatch(tr)
          }
          return updated
        },
      unsetLineHeight:
        () =>
        ({ editor, state, dispatch }) => {
          const { defaultLineHeight } = this.options
          const typeNames = this.options.types.filter(
            (type) => editor.schema.nodes[type],
          )

          let { tr } = state
          let updated = false

          state.doc.nodesBetween(
            state.selection.from,
            state.selection.to,
            (node, pos) => {
              if (!typeNames.includes(node.type.name)) return
              if (node.attrs.lineHeight === defaultLineHeight) {
                updated = true
                return
              }
              tr = tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                lineHeight: defaultLineHeight,
              })
              updated = true
            },
          )

          if (!updated) {
            const target = this.findClosestTargetNode(state, typeNames)
            if (!target) return false
            if (target.node.attrs.lineHeight === defaultLineHeight) {
              return true
            }
            tr = tr.setNodeMarkup(target.pos, undefined, {
              ...target.node.attrs,
              lineHeight: defaultLineHeight,
            })
            updated = true
          }

          if (dispatch && tr.docChanged) {
            dispatch(tr)
          }
          return updated
        },
    }
  },
})
