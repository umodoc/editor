import OrderedList from '@tiptap/extension-ordered-list'

// https://www.npmjs.com/package/tiptap-extension-ordered-list
export default OrderedList.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      listStyleType: {
        default: 'decimal',
        parseHTML: (element) => {
          const listStyleType = element.style['list-style-type']
          return { listStyleType: listStyleType || 'decimal' }
        },
        renderHTML: ({ listStyleType }) => {
          return {
            style: `list-style-type: ${listStyleType?.listStyleType || listStyleType}`,
          }
        },
      },
    }
  },
})
