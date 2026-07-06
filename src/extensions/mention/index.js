import { mergeAttributes } from '@tiptap/core'
import Mention from '@tiptap/extension-mention'

export default Mention.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: 'umo-node-mention',
        contenteditable: 'false',
      },
    }
  },
  addAttributes() {
    return {
      id: {
        default: null,
      },
      label: {
        default: null,
      },
      bio: {
        default: null,
      },
    }
  },
  renderHTML({ node, HTMLAttributes }) {
    const label = node.attrs.label || node.attrs.id || ''
    const bio = node.attrs.bio || ''
    const tooltip = bio ? `${label} (${bio})` : label

    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-tooltip': tooltip,
      }),
      `${this.options?.suggestion?.char || '@'}${label}`,
    ]
  },
  addCommands() {
    return {
      insertMention:
        () =>
        ({ commands }) => {
          return commands.insertContent(
            ` ${this.options?.suggestion?.char || '@'}`,
          )
        },
    }
  },
})
