import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import NodeView from './node-view.vue'
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    setIframe: {
      setIframe: (options: any) => ReturnType
    }
  }
}
export default Node.create({
  name: 'iframe',
  inline: false,
  group: 'block',
  atom: true,
  addAttributes() {
    return {
      vnode: {
        default: true,
      },
      src: {
        default: null,
      },
      width: {
        default: 400,
      },
      height: {
        default: 200,
      },
    }
  },
  parseHTML() {
    return [{ tag: 'iframe' }]
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'iframe',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ]
  },
  addNodeView() {
    return VueNodeViewRenderer(NodeView)
  },
  addCommands() {
    return {
      setIframe:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
    }
  },
})
