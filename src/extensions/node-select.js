import { Extension } from '@tiptap/core'
import { NodeSelection, Plugin, PluginKey } from '@tiptap/pm/state'

export default Extension.create({
  name: 'selectNode',
  addOptions() {
    return {
      types: ['horizontalRule', 'pageBreak', 'blockMath', 'inlineMath'],
    }
  },
  addProseMirrorPlugins() {
    const { types } = this.options

    return [
      new Plugin({
        key: new PluginKey('select-node'),
        props: {
          handleDOMEvents: {
            click(view, event) {
              const { state, dispatch } = view

              const pos = view.posAtCoords({
                left: event.clientX,
                top: event.clientY,
              })

              if (!pos) return false

              const resolvedPos = pos.inside >= 0 ? pos.inside : pos.pos

              const node = state.doc.nodeAt(resolvedPos)

              if (!node || !types.includes(node.type.name)) {
                return false
              }

              const selection = NodeSelection.create(state.doc, resolvedPos)

              dispatch(state.tr.setSelection(selection))
              view.focus()

              return true
            },
          },
        },
      }),
    ]
  },
})
