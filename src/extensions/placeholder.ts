import { Extension } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    setPlaceholder: {
      setPlaceholder: (options: any) => ReturnType
    }
  }
}

export default Extension.create({
  name: 'placeholder',
  addCommands() {
    return {
      setPlaceholder:
        () =>
        ({ editor, chain, state }) => {
          if (!editor.isEmpty || state.doc.content.size > 4) {
            return false
          }
          chain().setContent(`<p></p>`).focus(3).run()
          return true
        },
    }
  },
})
