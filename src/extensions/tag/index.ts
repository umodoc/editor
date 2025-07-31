import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import NodeView from './node-view.vue'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    insertTag: {
      insertTag: (options: any) => ReturnType
    }
  }
}

export default Node.create({
  name: 'tag',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      type: { default: 'default' },
      text: { default: t('bubbleMenu.tag.content') },
      color: { default: '#999' },
      backgroundColor: { default: 'rgba(0, 0, 0, 0.05)' },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-type="tag"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, { 'data-type': 'tag' }),
      HTMLAttributes.text,
    ]
  },

  addNodeView() {
    return VueNodeViewRenderer(NodeView)
  },

  addCommands() {
    return {
      insertTag:
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
