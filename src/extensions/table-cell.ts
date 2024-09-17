import TableCell from '@tiptap/extension-table-cell'

export default TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-align'),
        renderHTML: ({ align }) => ({ 'data-align': align }),
      },
      backgroundColor: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-bg-color'),
        renderHTML: ({ backgroundColor }) => {
          const attrs: { 'data-bg-color': any; style?: string } = {
            'data-bg-color': backgroundColor,
          }
          if (backgroundColor) {
            attrs.style = `background-color: ${backgroundColor}`
          }
          return attrs
        },
      },
    }
  },
})
