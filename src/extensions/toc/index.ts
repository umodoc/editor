import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import NodeView from './node-view.vue'
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    addTableOfContents: {
      addTableOfContents: (option: any) => ReturnType
    }
  }
}
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
    return VueNodeViewRenderer(NodeView)
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
        (options) =>
        ({ chain }) => {
          return chain()
            .insertContent({
              type: this.name,
              attrs: options,
            })
            .run()
        },
    }
  },
})
