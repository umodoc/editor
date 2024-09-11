import TextAlign from '@tiptap/extension-text-align'

export default TextAlign.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      types: ['heading', 'paragraph'],
      alignments: ['left', 'center', 'right', 'justify', 'distributed'],
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          textAlign: {
            default: this.options.defaultAlignment,
            parseHTML: (element) => {
              if (element.style.textAlignLast) {
                return 'distributed'
              }
              return element.style.textAlign || this.options.defaultAlignment
            },
            renderHTML: (attributes) => {
              if (attributes.textAlign === this.options.defaultAlignment) {
                return {}
              }
              if (attributes.textAlign === 'distributed') {
                return { style: 'text-align-last: justify' }
              }
              return { style: `text-align: ${attributes.textAlign}` }
            },
          },
        },
      },
    ]
  },
  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      'Mod-Shift-d': () => this.editor.commands.setTextAlign('distributed'),
    }
  },
})
