import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import NodeView from './node-view.vue'

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
        default: null,
      },
      height: {
        default: 300,
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
