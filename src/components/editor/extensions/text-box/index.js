import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import NodeView from './node-view.vue'

export default Node.create({
  name: 'textBox',
  group: 'block',
  content: 'inline*',
  addAttributes() {
    return {
      width: {
        default: 200,
      },
      height: {
        default: 40,
      },
      angle: {
        default: null,
      },
      left: {
        default: 0,
      },
      top: {
        default: 0,
      },
      draggable: {
        default: true,
      },
      rotatable: {
        default: true,
      },
    }
  },
  parseHTML() {
    return [{ tag: 'text-box' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['text-box', mergeAttributes(HTMLAttributes), 0]
  },
  addNodeView() {
    return VueNodeViewRenderer(NodeView)
  },
  addCommands() {
    return {
      setTextBox:
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
