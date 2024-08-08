import { mergeAttributes, Node } from '@tiptap/core'
import { vnodeViewRenderer } from '@tiptap/vue-3'

import NodeView from './node-view.vue'

export default Node.create({
  name: 'toc',
  group: 'block',
  atom: true,
  addAttributes() {
    return {
      vnode: {
        default: true,
      },
    }
  },
  parseHTML() {
    return [{ tag: 'toc' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['toc', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },
  addNodeView() {
    return vnodeViewRenderer(NodeView)
  },
  addGlobalAttributes() {
    return [
      {
        types: ['heading'],
        attributes: {},
      },
    ]
  },
  addCommands() {
    return {
      addTableOfContents:
        () =>
        ({ editor }) => {
          editor.chain().focus().insertContent({ type: this.name }).run()
        },
    }
  },
})
