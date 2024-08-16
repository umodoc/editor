import { Extension } from '@tiptap/core'

export default Extension.create({
  name: 'nodeAlign',
  addOptions() {
    return {
      defaultAlignment: 'center',
      alignments: ['flex-start', 'center', 'flex-end'],
      types: ['image', 'video', 'audio', 'iframe', 'file'],
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          nodeAlign: {
            default: this.options.defaultAlignment,
            parseHTML: (element) => {
              return (
                element.style.justifyContent || this.options.defaultAlignment
              )
            },
            renderHTML: (attributes) => {
              if (attributes.nodeAlign === this.options.defaultAlignment) {
                return {}
              }
              return { style: `justify-content: ${attributes.nodeAlign}` }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setNodeAlign:
        (alignment) =>
        ({ commands }) => {
          if (!this.options.alignments.includes(alignment)) {
            return false
          }
          return this.options.types.every((type) =>
            commands.updateAttributes(type, { nodeAlign: alignment }),
          )
        },
      unsetNodeAlign:
        () =>
        ({ commands }) => {
          return this.options.types.every((type) =>
            commands.resetAttributes(type, 'nodeAlign'),
          )
        },
    }
  },
})
