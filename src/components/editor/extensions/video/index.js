import { Node, mergeAttributes } from '@tiptap/core'
import { vnodeViewRenderer } from '@tiptap/vue-3'
import NodeView from './node-view.vue'

export default Node.create({
  name: 'video',
  group: 'block',
  atom: true,
  addAttributes() {
    return {
      id: {
        default: null,
      },
      file: {
        default: null,
      },
      src: {
        default: null,
      },
      width: {
        default: null,
      },
      height: {
        default: null,
      },
      draggable: {
        default: false,
      },
      uploaded: {
        default: false,
      },
    }
  },
  parseHTML() {
    return [{ tag: 'video' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['video', mergeAttributes(HTMLAttributes)]
  },
  addNodeView() {
    return vnodeViewRenderer(NodeView)
  },
  addCommands() {
    return {
      setVideo:
        (options) =>
        ({ commands, editor }) => {
          return commands.insertContentAt(editor.state.selection.anchor, {
            type: this.name,
            attrs: options,
          })
        },
    }
  },
})
