import { Node, mergeAttributes, wrappingInputRule } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { shortId } from '@/utils/short-id'
import NodeView from './node-view.vue'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    insertCallout: {
      insertCallout: (options: any) => ReturnType
    }
  }
}

export default Node.create({
  name: 'callout',
  group: 'block',
  content: 'paragraph+',
  defining: true,
  exitable: true,
  selectable: false,
  addAttributes() {
    return {
      id: {
        default: shortId(6),
      },
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
})
