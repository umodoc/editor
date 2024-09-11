import { mergeAttributes,Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import NodeView from './node-view.vue'
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    setTextBox: {
      setTextBox: (options: any) => ReturnType
    }
  }
}
export default Node.create({
  name: 'textBox',
  group: 'block',
  content: 'inline*',
  addAttributes() {
    return {
      vnode: {
        default: true,
      },
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
