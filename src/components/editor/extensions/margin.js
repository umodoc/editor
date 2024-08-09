import { Extension } from '@tiptap/core'

export default Extension.create({
  name: 'margin',
  addOptions() {
    return {
      types: ['heading', 'paragraph'],
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          margin: {
            default: {},
            renderHTML: (attributes) => {
              if (!Object.keys(attributes.margin).length) return {}
              const { top: top = 0, bottom: bottom = 0 } = attributes.margin
              return { style: `margin-top: ${top}; margin-bottom: ${bottom};` }
            },
            parseHTML: (element) => {
              const margin = {}
              const computedStyle = window.getComputedStyle(element)
              const top = computedStyle.getPropertyValue('margin-top')
              const bottom = computedStyle.getPropertyValue('margin-bottom')
              top && (margin.top = top)
              bottom && (margin.bottom = bottom)
              return margin
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setMargin:
        (options) =>
        ({ editor, commands }) => {
          return this.options.types.every((type) => {
            const { margin } = editor.getAttributes(type)
            return commands.updateAttributes(type, {
              margin: Object.assign({}, margin, options),
            })
          })
        },
      unsetMargin:
        () =>
        ({ commands }) => {
          return this.options.types.every((type) =>
            commands.resetAttributes(type, 'margin'),
          )
        },
    }
  },
})
