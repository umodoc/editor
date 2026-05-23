import { mergeAttributes, nodeInputRule, nodePasteRule } from '@tiptap/core'
import Image from '@tiptap/extension-image'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import NodeView from './node-view.vue'

const parseDimension = (element, name) => {
  const styleValue = element.style?.[name]
  const attrValue = element.getAttribute(name)
  const rawValue = styleValue || attrValue

  if (!rawValue) {
    return null
  }

  const normalizedValue = String(rawValue).trim()

  if (/^\d+(\.\d+)?px$/i.test(normalizedValue)) {
    return Number.parseFloat(normalizedValue)
  }

  if (/^\d+(\.\d+)?$/.test(normalizedValue)) {
    return Number.parseFloat(normalizedValue)
  }

  return null
}

const customImage = Image.extend({
  atom: true,
  selectable: true,
  addAttributes() {
    return {
      vnode: {
        default: true,
      },
      type: {
        default: 'image',
      },
      name: {
        default: null,
      },
      size: {
        default: null,
      },
      id: {
        default: null,
      },
      src: {
        default: null,
      },
      config: {
        default: null,
      },
      content: {
        default: null,
      },
      width: {
        default: null,
        parseHTML: (element) => parseDimension(element, 'width'),
      },
      height: {
        default: null,
        parseHTML: (element) => parseDimension(element, 'height'),
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
      previewType: {
        default: 'image',
      },
      inline: {
        default: false,
      },
    }
  },
  parseHTML() {
    return [{ tag: 'img' }]
  },
  addPasteRules() {
    return [
      ...(this.parent?.() || []),
      nodePasteRule({
        find: /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)"?)?\)/g,
        type: this.type,
        getAttributes: (match) => {
          const [, alt, src, title] = match
          return { src, alt, title }
        },
      }),
    ]
  },
  addInputRules() {
    return [
      ...(this.parent?.() || []),
      nodeInputRule({
        find: /!\[([\S]+)\]\(([^)\s]+)(?:\s+"([\S]+)"?)?\)/g,
        type: this.type,
        getAttributes: (match) => {
          const [, alt, src, title] = match
          return { src, alt, title }
        },
      }),
    ]
  },
})
// 节点块级别扩展
export const BlockImage = customImage.extend({
  ...customImage,
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
              attrs: { ...options, inline: false },
            })
          }
          return commands.insertContentAt(editor.state.selection.anchor, {
            type: this.name,
            attrs: { ...options, inline: false },
          })
        },
    }
  },
})
// 行内扩展
export const InlineImage = customImage.extend({
  ...customImage,
  name: 'inlineImage',
  // 行内元素
  inline: true,

  // 属于行内组
  group: 'inline',
  addAttributes() {
    return {
      ...this.parent?.(),
      inline: {
        default: true,
      },
      equalProportion: {
        default: false,
      },
      width: {
        default: 150,
      },
      height: {
        default: 80,
      },
    }
  },
  parseHTML() {
    return [{ tag: 'inline-img' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['inline-img', mergeAttributes(HTMLAttributes)]
  },
  addNodeView() {
    return VueNodeViewRenderer(NodeView)
  },
  addCommands() {
    return {
      setInlineImage:
        (options) =>
        ({ commands, editor }) => {
          // return commands.insertContent({
          //   type: this.name,
          //   attrs: { ...options, inline: true },
          // })
          return commands.insertContentAt(editor.state.selection.anchor, {
            type: this.name,
            attrs: { ...options, inline: true },
          })
        },
    }
  },
})
