import OrderedList from '@tiptap/extension-ordered-list'

// https://www.npmjs.com/package/tiptap-extension-ordered-list
export default OrderedList.extend({
  content: 'listItem*',
  addAttributes() {
    return {
      ...this.parent?.(),
      listStyleType: {
        default: 'decimal',
        parseHTML: (element) => {
          //@ts-ignore
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
