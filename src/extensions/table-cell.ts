import TableCell from '@tiptap/extension-table-cell'

export default TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: null,
        parseHTML: (element) => {
          const align = element.getAttribute('align') ?? null
          return align
        },
        renderHTML: ({ align }) => ({ align }),
      },
      backgroundColor: {
        default: null,
        parseHTML: (element) => {
          const style = element.getAttribute('style') ?? ''
          const match = style.match(/background(?:-color)?:\s*([^;]+)/i)
          return match ? match[1].trim() : null
        },
        renderHTML: ({ backgroundColor }) => {
          const attrs: { 'data-bg-color'?: any; style?: string } = {
            'data-bg-color': backgroundColor,
          }
          if (backgroundColor) {
            attrs.style = `background-color: ${backgroundColor};`
          }
          return attrs
        },
      },
    }
  },
})
