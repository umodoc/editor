import { Extension } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    setFontSize: {
      setFontSize: (fontSize: any) => ReturnType
    }
    unsetFontSize: {
      unsetFontSize: () => ReturnType
    }
  }
}
export interface FontSizeOption {
  types: string[]
  defaultFontSize: string
}
export default Extension.create<FontSizeOption>({
  name: 'fontSize',
  addOptions() {
    return {
      types: ['textStyle'],
      defaultFontSize: '14px',
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: this.options.defaultFontSize,
            parseHTML: (element) =>
              element.style.fontSize || this.options.defaultFontSize,
            renderHTML: (attributes) => {
              if (attributes.fontSize === this.options.defaultFontSize) {
                return {}
              }
              return { style: `font-size: ${attributes.fontSize}` }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) => {
          return chain().setMark('textStyle', { fontSize }).run()
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain()
            .setMark('textStyle', { fontSize: null })
            .removeEmptyTextStyle()
            .run()
        },
    }
  },
})
