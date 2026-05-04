import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import NodeView from './node-view.vue'

export default Node.create({
  name: 'optionBox',
  group: 'inline',
  inline: true,
  atom: true,
  addAttributes() {
    return {
      target: {
        default: 'checkbox',
      },
      items: {
        default: [],
        parseHTML: (element) => {
          const _data = element.hasAttribute('items')
            ? element.getAttribute('items')
            : null
          return _data ? JSON.parse(_data) : null
        },
        renderHTML: (attributes) => ({
          items: attributes.items ? JSON.stringify(attributes.items) : null,
        }),
      },
      checkAll: {
        default: false,
      },
      checked: {
        default: true,
      },
      updated: {
        default: false,
      },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-type="option-box"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    const showText = HTMLAttributes['items'] || ''

    return [
      'span',
      mergeAttributes(HTMLAttributes, { 'data-type': 'option-box' }),
      showText,
    ]
  },
  addNodeView() {
    return VueNodeViewRenderer(NodeView)
  },
  addCommands() {
    return {
      insertOptionBox:
        (options) =>
        ({ chain, editor }) => {
          const { to } = editor?.state?.selection || {}
          return chain()
            .insertContentAt(to - 1, {
              type: this.name,
              attrs: options,
            })
            .run()
        },
      updateOptionBox:
        (options) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, options)
        },
    }
  },
})
