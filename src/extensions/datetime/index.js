import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import NodeView from './node-view.vue'

export default Node.create({
  name: 'datetime',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: false,

  addAttributes() {
    return {
      type: { default: 'datetime' },
      date: { default: null },
      text: { default: `[${t('insert.date')}]` },
      format: { default: null },
      withTime: { default: false },
      capitalize: { default: false },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-type="datetime"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, { 'data-type': 'datetime' }),
      HTMLAttributes.text,
    ]
  },

  addNodeView() {
    return VueNodeViewRenderer(NodeView)
  },

  addCommands() {
    return {
      insertDatetime:
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
