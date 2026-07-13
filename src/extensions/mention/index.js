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
      ...this.parent?.(),
      bio: {
        default: null,
        parseHTML: (element) =>
          element.getAttribute('data-bio') || element.getAttribute('bio'),
        renderHTML: (attributes) => {
          if (!attributes.bio) {
            return {}
          }
          return {
            'data-bio': attributes.bio,
          }
        },
      },
    }
  },
  parseHTML() {
    return [
      {
        tag: 'span[data-type="mention"]',
      },
      {
        // 兼容历史错误输出：旧 HTML 缺少 data-type/data-id/data-label
        tag: 'span.umo-node-mention',
        getAttrs: (element) => ({
          id:
            element.getAttribute('data-id') ||
            element.getAttribute('id') ||
            null,
          label:
            element.getAttribute('data-label') ||
            element.getAttribute('label') ||
            null,
          bio:
            element.getAttribute('data-bio') ||
            element.getAttribute('bio') ||
            null,
          mentionSuggestionChar:
            element.getAttribute('data-mention-suggestion-char') || '@',
        }),
      },
    ]
  },
  renderHTML({ node, HTMLAttributes }) {
    const label = node.attrs.label || node.attrs.id || ''
    const bio = node.attrs.bio || ''
    const tooltip = bio ? `${label} (${bio})` : label
    const mentionChar =
      node.attrs.mentionSuggestionChar || this.options?.suggestion?.char || '@'

    return [
      'span',
      mergeAttributes(
        {
          'data-type': this.name,
        },
        this.options.HTMLAttributes,
        HTMLAttributes,
        {
          title: tooltip,
        },
      ),
      `${mentionChar}${label}`,
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
