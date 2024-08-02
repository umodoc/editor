import BulletList from '@tiptap/extension-bullet-list'

// https://www.npmjs.com/package/tiptap-extension-bullet-list
export default BulletList.extend({
  content: 'listItem+',
  addAttributes() {
    return {
      ...this.parent?.(),
      listStyleType: {
        default: 'disc',
        parseHTML: (element) => {
          const listStyleType = element.style['list-style-type']
          return { listStyleType: listStyleType || 'disc' }
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
