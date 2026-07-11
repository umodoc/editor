import { mergeAttributes } from '@tiptap/core'
import Image from '@tiptap/extension-image'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import NodeView from './node-view.vue'

const getImageSourceElement = (element) => {
  if (!(element instanceof HTMLElement)) {
    return null
  }
  return element.tagName.toLowerCase() === 'img'
    ? element
    : element.querySelector('img')
}

const getImageAttribute = (element, name) =>
  getImageSourceElement(element)?.getAttribute(name)

const parseDimension = (element, name) => {
  const sourceElement = getImageSourceElement(element) || element
  const rawValue =
    sourceElement.style?.[name] || sourceElement.getAttribute(name)
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

const createImageAttributes = () => ({
  vnode: { default: true },
  type: { default: 'image' },
  name: { default: null },
  size: { default: null },
  id: { default: null },
  src: {
    default: null,
    parseHTML: (element) => getImageAttribute(element, 'src'),
  },
  config: { default: null },
  content: { default: null },
  alt: {
    default: null,
    parseHTML: (element) => getImageAttribute(element, 'alt'),
  },
  title: {
    default: null,
    parseHTML: (element) => getImageAttribute(element, 'title'),
  },
  width: {
    default: null,
    parseHTML: (element) => parseDimension(element, 'width'),
  },
  height: {
    default: null,
    parseHTML: (element) => parseDimension(element, 'height'),
  },
  left: { default: 0 },
  top: { default: 0 },
  angle: { default: null },
  draggable: { default: false },
  rotatable: { default: false },
  equalProportion: { default: true },
  flipX: { default: false },
  flipY: { default: false },
  uploaded: { default: false },
  error: { default: false },
  previewType: { default: 'image' },
  inline: { default: false },
  showTitle: { default: false },
})

const createInsertImageCommand =
  (typeName, inline) =>
  (options, replace = false) =>
  ({ commands, editor }) => {
    const content = {
      type: typeName,
      attrs: { ...options, inline },
    }
    if (replace) {
      return commands.insertContent(content)
    }
    return commands.insertContentAt(editor.state.selection.anchor, content)
  }

const getSelectedAncestorNode = ($pos, typeName) => {
  const { depth: maxDepth } = $pos
  for (let depth = maxDepth; depth > 0; depth -= 1) {
    const node = $pos.node(depth)
    if (node?.type?.name === typeName) {
      return {
        node,
        pos: $pos.before(depth),
      }
    }
  }
  return null
}

const BaseImage = Image.extend({
  atom: true,
  selectable: true,
  addAttributes() {
    return createImageAttributes()
  },
  parseHTML() {
    return [{ tag: 'img' }]
  },
})

export const BlockImage = BaseImage.extend({
  atom: true,
  content: 'inline*',
  defining: true,
  isolating: true,
  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => {
        const { selection } = editor.state
        if (!selection.empty) {
          return false
        }
        const currentImage = getSelectedAncestorNode(selection.$from, this.name)
        if (!currentImage || currentImage.node.content.size > 0) {
          return false
        }
        if (selection.from !== currentImage.pos + 1) {
          return false
        }
        return editor
          .chain()
          .deleteRange({
            from: currentImage.pos,
            to: currentImage.pos + currentImage.node.nodeSize,
          })
          .run()
      },
    }
  },
  parseHTML() {
    return [
      {
        tag: 'figure[data-type="image"]',
        contentElement: 'figcaption',
      },
      { tag: 'img' },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    const { src, alt, title, width, height, ...figureAttributes } =
      HTMLAttributes
    return [
      'figure',
      mergeAttributes(figureAttributes, { 'data-type': 'image' }),
      [
        'img',
        mergeAttributes(this.options.HTMLAttributes, {
          src,
          alt,
          title,
          width,
          height,
        }),
      ],
      ['figcaption', 0],
    ]
  },
  addNodeView() {
    return VueNodeViewRenderer(NodeView)
  },
  addCommands() {
    return {
      setImage: createInsertImageCommand(this.name, false),
    }
  },
})

export const InlineImage = BaseImage.extend({
  name: 'inlineImage',
  inline: true,
  group: 'inline',
  addAttributes() {
    return {
      ...this.parent?.(),
      inline: { default: true },
      equalProportion: { default: false },
      width: { default: 150 },
      height: { default: 80 },
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
      setInlineImage: createInsertImageCommand(this.name, true),
    }
  },
})
