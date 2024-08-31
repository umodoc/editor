import OrderedList from '@tiptap/extension-ordered-list'

// https://www.npmjs.com/package/tiptap-extension-ordered-list
export default OrderedList.extend({
  content: 'listItem*',
  addAttributes() {
    return {
      ...this.parent?.(),
      listType: {
        default: 'decimal',
        parseHTML: (element) => element.style['list-style-type'] || 'decimal',
        renderHTML: ({ listType }) => {
          return {
            style: `list-style-type: ${listType}`,
          }
        },
      },
    }
  },
})
