import { mergeAttributes, Node, wrappingInputRule } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import NodeView from './node-view.vue'

export default Node.create({
  name: 'callout',
  group: 'block',
  content: 'paragraph+',
  defining: true,
  exitable: true,
  selectable: false,
  addAttributes() {
    return {
      type: { default: 'primary' },
      icon: {
        default: '⭐️',
      },
      backgroundColor: { default: 'rgb(217, 231, 255)' },
    }
  },
  parseHTML() {
    return [
      {
        tag: 'div[data-type="callout"]',
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'callout' }),
      0,
    ]
  },
  addNodeView() {
    return VueNodeViewRenderer(NodeView)
  },
  addCommands() {
    return {
      insertCallout:
        (options) =>
        ({ chain }) => {
          return chain()
            .insertContent({
              type: this.name,
              attrs: options,
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            })
            .run()
        },
    }
  },
  addInputRules() {
    return [
      wrappingInputRule({
        find: /^:::callout $/,
        type: this.type,
        getAttributes: (match) => {
          return { type: match[1] }
        },
      }),
    ]
  },
  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { state, view } = editor
        const { dispatch } = view
        const { selection } = state
        const { $from } = selection
        const node = $from.node(-1)

        if (node?.type.name === 'callout') {
          if (node.content.size <= 2) {
            const pos = selection.from + 1
            const tr = state.tr.insert(
              pos,
              state.schema.nodes.paragraph.create(),
            )
            tr.setSelection(
              state.selection.constructor.near(tr.doc.resolve(pos)),
            )
            dispatch(tr)
            return true
          }
        }

        return false
      },
    }
  },
})
