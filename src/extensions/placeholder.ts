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
  addOptions() {
    return {
      types: ['paragraph'],
      // @ts-ignore
      placeholder: null,
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          placeholder: {
            default: this.options.placeholder,
            parseHTML: (element) => element.getAttribute('data-placeholder'),
            renderHTML: ({ placeholder }) => ({ 'data-placeholder': placeholder }),
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setPlaceholder: () => ({ editor,chain,state }) => {
        const { options } = useStore()
        if (!editor.isEmpty || state.doc.content.size > 4) {
          return false
        }
        // @ts-ignore
        const placeholder = l(options.value.document.placeholder)
        chain()
          .setContent(`<p data-placeholder="${placeholder}"></p>`)
          .focus(3)
          .run()
        return true
      },
    }
  },
})
