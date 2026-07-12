import { mergeAttributes, nodeInputRule, nodePasteRule } from '@tiptap/core'
import Image from '@tiptap/extension-image'
import { NodeSelection, Plugin, PluginKey } from '@tiptap/pm/state'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import NodeView from './node-view.vue'

const IMAGE_NODE_NAMES = ['image', 'inlineImage']

const PIXEL_DIMENSION_REGEX = /^\d+(\.\d+)?px$/i
const NUMBER_DIMENSION_REGEX = /^\d+(\.\d+)?$/
const IMAGE_PARSE_CACHE = new WeakMap()

const createInitialImageAttrs = (attrs = {}) => {
  if (attrs.initialAttrs) {
    return attrs
  }
  const snapshot = { ...attrs }
  delete snapshot.initialAttrs
  return {
    ...attrs,
    initialAttrs: JSON.stringify(snapshot),
  }
}

const parseInitialImageAttrs = (value) => {
  if (!value) {
    return null
  }
  try {
    const parsed = JSON.parse(value)
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

const parseDimensionValue = (rawValue) => {
  if (!rawValue) {
    return null
  }
  const normalizedValue = String(rawValue).trim()
  if (PIXEL_DIMENSION_REGEX.test(normalizedValue)) {
    return Number.parseFloat(normalizedValue)
  }
  if (NUMBER_DIMENSION_REGEX.test(normalizedValue)) {
    return Number.parseFloat(normalizedValue)
  }
  return null
}

const getParsedImageElement = (element) => {
  if (!(element instanceof HTMLElement)) {
    return {
      sourceElement: null,
      attrs: {},
      dimensions: {},
    }
  }
  const cached = IMAGE_PARSE_CACHE.get(element)
  if (cached) {
    return cached
  }
  const sourceElement =
    element.tagName.toLowerCase() === 'img'
      ? element
      : element.querySelector('img')
  const parsed = {
    sourceElement,
    attrs: {
      src: sourceElement?.getAttribute('src') ?? null,
      alt: sourceElement?.getAttribute('alt') ?? null,
      title: sourceElement?.getAttribute('title') ?? null,
    },
    dimensions: {
      width: parseDimensionValue(
        sourceElement?.style?.width || sourceElement?.getAttribute('width'),
      ),
      height: parseDimensionValue(
        sourceElement?.style?.height || sourceElement?.getAttribute('height'),
      ),
    },
  }
  IMAGE_PARSE_CACHE.set(element, parsed)
  if (sourceElement && sourceElement !== element) {
    IMAGE_PARSE_CACHE.set(sourceElement, parsed)
  }
  return parsed
}

const getImageAttribute = (element, name) =>
  getParsedImageElement(element).attrs[name] ?? null

const parseDimension = (element, name) =>
  getParsedImageElement(element).dimensions[name] ?? null

const wrapImageElementAsFigure = (element) => {
  const doc = element?.ownerDocument
  if (!doc || !(element instanceof HTMLElement)) {
    return
  }
  if (element.closest('figure[data-type="image"], inline-img')) {
    return
  }
  const figure = doc.createElement('figure')
  figure.setAttribute('data-type', 'image')
  figure.appendChild(element.cloneNode(true))
  figure.appendChild(doc.createElement('figcaption'))
  element.replaceWith(figure)
}

const normalizePastedHtmlImages = (html) => {
  if (!html || typeof DOMParser === 'undefined') {
    return html
  }
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  doc.querySelectorAll('img').forEach(wrapImageElementAsFigure)
  return doc.body?.innerHTML || html
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
  showTitle: { default: false },
  inline: { default: false },
  initialAttrs: {
    default: null,
    renderHTML: () => ({}),
  },
})

const createInsertImageCommand =
  (typeName, inline) =>
  (options, replace = false) =>
  ({ commands, editor }) => {
    const content = {
      type: typeName,
      attrs: createInitialImageAttrs({ ...options, inline }),
    }
    if (replace) {
      return commands.insertContent(content)
    }
    return commands.insertContentAt(editor.state.selection.anchor, content)
  }

const isMatchedImageType = (currentType, typeName) =>
  Array.isArray(typeName)
    ? typeName.includes(currentType)
    : currentType === typeName

const getSelectedImagePosition = (selection, typeName) => {
  if (isMatchedImageType(selection?.node?.type?.name, typeName)) {
    return selection.from
  }
  const currentNode = getSelectedAncestorNode(selection?.$from, typeName)
  return currentNode?.pos ?? null
}

const getSelectedAncestorNode = ($pos, typeName) => {
  if (!$pos) {
    return null
  }
  const { depth: maxDepth } = $pos
  for (let depth = maxDepth; depth > 0; depth -= 1) {
    const node = $pos.node(depth)
    if (isMatchedImageType(node?.type?.name, typeName)) {
      return {
        node,
        pos: $pos.before(depth),
      }
    }
  }
  return null
}

const getSelectedImageNode = (selection) => {
  if (isMatchedImageType(selection?.node?.type?.name, IMAGE_NODE_NAMES)) {
    return {
      node: selection.node,
      pos: selection.from,
    }
  }
  return getSelectedAncestorNode(selection?.$from, IMAGE_NODE_NAMES)
}

const getResetImageAttrs = (node) => {
  const initialAttrs = parseInitialImageAttrs(node?.attrs?.initialAttrs)
  if (!initialAttrs) {
    return null
  }
  return {
    ...initialAttrs,
    initialAttrs: node.attrs.initialAttrs,
  }
}

const BaseImage = Image.extend({
  atom: true,
  selectable: true,
  addStorage() {
    return {
      cropper: {
        activePos: null,
      },
    }
  },
  addAttributes() {
    return createImageAttributes()
  },
  parseHTML() {
    return [{ tag: 'img' }]
  },
  addCommands() {
    return {
      resetImageToInitial:
        () =>
        ({ state, dispatch }) => {
          const currentImage = getSelectedImageNode(state.selection)
          if (!currentImage) {
            return false
          }
          const nextAttrs = getResetImageAttrs(currentImage.node)
          if (!nextAttrs) {
            return false
          }
          if (dispatch) {
            const nextNode = currentImage.node.type.create(
              nextAttrs,
              currentImage.node.content,
              currentImage.node.marks,
            )
            const tr = state.tr.replaceWith(
              currentImage.pos,
              currentImage.pos + currentImage.node.nodeSize,
              nextNode,
            )
            tr.setSelection(NodeSelection.create(tr.doc, currentImage.pos))
            dispatch(tr)
          }
          return true
        },
    }
  },
})

export const BlockImage = BaseImage.extend({
  atom: false,
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
        contentElement: (element) =>
          element.querySelector('figcaption, .umo-node-image-alt-content') ||
          element.ownerDocument.createElement('figcaption'),
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
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('image-paste-normalize'),
        props: {
          transformPastedHTML: (html) => normalizePastedHtmlImages(html),
        },
      }),
    ]
  },
  addCommands() {
    return {
      ...this.parent?.(),
      setImage: createInsertImageCommand(this.name, false),
      toggleImageCrop:
        () =>
        ({ state, tr, dispatch }) => {
          const pos = getSelectedImagePosition(state.selection, this.name)
          if (typeof pos !== 'number') {
            return false
          }
          if (dispatch) {
            dispatch(
              tr.setMeta('imageCrop', {
                action: 'toggle',
                pos,
              }),
            )
          }
          return true
        },
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
      ...this.parent?.(),
      setInlineImage: createInsertImageCommand(this.name, true),
    }
  },
})
