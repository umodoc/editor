import { Extension } from '@tiptap/core'

export default Extension.create({
  name: 'selection',
  addCommands() {
    return {
      getSelectionText:
        () =>
        ({ editor }) => {
          const { from, to, empty } = editor.state.selection
          if (empty) {
            return ''
          }
          return editor.state.doc.textBetween(from, to, '')
        },
      getSelectionNode:
        () =>
        ({ editor }) => {
          for (const node of Array.from(editor.vueRenderers)) {
            if (node[1].props.selected) {
              return node[1]
            }
          }
        },
      deleteSelectionNode:
        () =>
        ({ editor, chain }) => {
          if (
            editor.isActive('image') ||
            editor.isActive('video') ||
            editor.isActive('audio') ||
            editor.isActive('file')
          ) {
            const node = editor.commands.getSelectionNode()
            if (!node) {
              return
            }
            const { options } = useStore()
            const { id, src } = node.props.node.attrs
            options.value.onFileDelete(id, src)
          }
          return chain().deleteSelection().run()
        },
    }
  },
  addKeyboardShortcuts() {
    return {
      Backspace: () => this.editor.commands.deleteSelectionNode(),
      Delete: () => this.editor.commands.deleteSelectionNode(),
    }
  },
})
