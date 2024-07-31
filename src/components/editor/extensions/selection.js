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
          editor.commands.selectParentNode()
          return editor.state.selection.node
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
            const { id, src } = node
            options.value.onFileDelete(id, src)
          }
          editor.commands.deleteSelection()
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
