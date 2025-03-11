import BulletList from '@tiptap/extension-bullet-list'

// https://www.npmjs.com/package/tiptap-extension-bullet-list
export default BulletList.extend({
  content: 'listItem*',
  addAttributes() {
    return {
      ...this.parent?.(),
      listType: {
        default: 'disc',
        parseHTML: (element) =>
          element.style.getPropertyValue('list-style-type') || 'disc',
        renderHTML: ({ listType }) => {
          return {
            style: `list-style-type: ${listType}`,
            type: listType,
          }
        },
      },
    }
  },
})
