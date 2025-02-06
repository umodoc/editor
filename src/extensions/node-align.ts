import { Extension } from '@tiptap/core'
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    setNodeAlign: {
      setNodeAlign: (options: any) => ReturnType
    }
    unsetNodeAlign: {
      unsetNodeAlign: () => ReturnType
    }
  }
}
export default Extension.create({
  name: 'nodeAlign',
  addOptions() {
    return {
      defaultAlignment: 'center',
      alignments: ['flex-start', 'center', 'flex-end'],
      types: ['image', 'video', 'audio', 'iframe', 'file', 'echarts'],
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
          return this.options.types.every((type: string) =>
            commands.updateAttributes(type, { nodeAlign: alignment }),
          )
        },
      unsetNodeAlign:
        () =>
        ({ commands }) => {
          return this.options.types.every((type: string) =>
            commands.resetAttributes(type, 'nodeAlign'),
          )
        },
    }
  },
})
