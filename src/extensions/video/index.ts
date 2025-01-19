import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import NodeView from './node-view.vue'
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    setVideo: {
      setVideo: (options: any) => ReturnType
    }
  }
}
export default Node.create({
  name: 'video',
  group: 'block',
  atom: true,
  addAttributes() {
    return {
      vnode: {
        default: true,
      },
      file: {
        default: null,
      },
      id: {
        default: null,
      },
      name: {
        default: null,
      },
      size: {
        default: null,
      },
      src: {
        default: null,
      },
      width: {
        default: null,
      },
      height: {
        default: 200,
      },
      draggable: {
        default: false,
      },
      uploaded: {
        default: false,
      },
      previewType: {
        default: 'video',
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
    return VueNodeViewRenderer(NodeView)
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
