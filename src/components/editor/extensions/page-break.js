import { Node, mergeAttributes } from '@tiptap/core'

export default Node.create({
  name: 'pageBreak',
  group: 'block',
  addOptions() {
    return {
      HTMLAttributes: {
        class: 'page-break',
        'data-line-number': false,
      },
    }
  },
  parseHTML() {
    return [{ tag: 'div[class*="page-break"]' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },
  addCommands() {
    return {
      setPageBreak:
        () =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
          }),
    }
  },
  addKeyboardShortcuts() {
    return {
      'Mod-Enter': () => this.editor.commands.setPageBreak(),
    }
  },
})
