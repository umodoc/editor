import { Mark, mergeAttributes } from '@tiptap/core'

export default Mark.create({
  name: 'letterSpacing',

  addOptions() {
    return {
      types: ['textStyle'],
    }
  },

  addAttributes() {
    return {
      spacing: {
        default: null,
        parseHTML: (element) =>
          element.style.letterSpacing?.replace(/['"]+/g, ''),
        renderHTML: (attributes) => {
          if (!attributes.spacing) {
            return {}
          }
          return {
            style: `letter-spacing: ${attributes.spacing}`,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: (element) => {
          const hasSpacing = element.style.letterSpacing
          if (!hasSpacing) return false
          return {}
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ]
  },
  addCommands() {
    return {
      setLetterSpacing:
        (spacing) =>
        ({ chain }) => {
          return chain().setMark(this.name, { spacing }).run()
        },
      unsetLetterSpacing:
        () =>
        ({ chain }) => {
          return chain().unsetMark(this.name).run()
        },
    }
  },
})
