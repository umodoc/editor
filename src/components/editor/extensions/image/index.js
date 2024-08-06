import { VueNodeViewRenderer } from '@tiptap/vue-3'
import Image from '@tiptap/extension-image'
import NodeView from './node-view.vue'

export default Image.extend({
  atom: true,
  addAttributes() {
    return {
      vueNode: {
        default: true,
      },
      id: {
        default: null,
      },
      type: {
        default: 'image',
      },
      file: {
        default: null,
      },
      src: {
        default: null,
      },
      content: {
        default: null,
      },
      width: {
        default: null,
      },
      height: {
        default: null,
      },
      left: {
        default: 0,
      },
      top: {
        default: 0,
      },
      angle: {
        default: null,
      },
      draggable: {
        default: false,
      },
      rotatable: {
        default: false,
      },
      equalProportion: {
        default: true,
      },
      flipX: {
        default: false,
      },
      flipY: {
        default: false,
      },
      uploaded: {
        default: false,
      },
      error: {
        default: false,
      },
    }
  },
  parseHTML() {
    return [{ tag: 'img' }]
  },
  addNodeView() {
    return VueNodeViewRenderer(NodeView)
  },
  addCommands() {
    return {
      setImage:
        (options, replace) =>
        ({ commands, editor }) => {
          if (replace) {
            return commands.insertContent({
              type: this.name,
              attrs: options,
            })
          }
          return commands.insertContentAt(editor.state.selection.anchor, {
            type: this.name,
            attrs: options,
          })
        },
    }
  },
})
