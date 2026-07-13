import { mergeAttributes, Node } from '@tiptap/core'
import { Fragment as PMFragment, Slice } from '@tiptap/pm/model'
import { NodeSelection, Plugin, PluginKey } from '@tiptap/pm/state'

import { shortId } from '@/utils/short-id'

const REFNUM_ATTR = 'data-ref-num'
const REF_CLASS = 'umo-node-footnote-ref'

const normalizeHoverTitle = (value) => {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
}

export default Node.create({
  name: 'footnoteReference',
  inline: true,
  content: 'text*',
  group: 'inline',
  atom: true,
  draggable: true,
  parseHTML() {
    return [
      {
        tag: `sup`,
        priority: 1000,
        getAttrs(node) {
          const anchor = node.querySelector(`a.${REF_CLASS}:first-child`)
          if (!anchor) {
            return false
          }
          const id = anchor.getAttribute('data-fn-id')
          const ref = anchor.getAttribute(REFNUM_ATTR)
          return {
            'data-fn-id': id || shortId(10),
            referenceNumber: ref || anchor.innerText,
          }
        },
        contentElement(node) {
          return node.firstChild
        },
      },
    ]
  },
  addAttributes() {
    return {
      class: {
        default: REF_CLASS,
      },
      'data-fn-id': {
        renderHTML(attributes) {
          return {
            'data-fn-id': attributes['data-fn-id'] || shortId(10),
          }
        },
      },
      referenceNumber: {},
      caption: {
        default: '',
      },
      href: {
        renderHTML(attributes) {
          return {
            href: `#fn:${attributes['referenceNumber']}`,
          }
        },
      },
    }
  },
  renderHTML({ HTMLAttributes }) {
    const { referenceNumber, ...attributes } = HTMLAttributes
    const attrs = mergeAttributes(this.options.HTMLAttributes, attributes)
    attrs[REFNUM_ATTR] = referenceNumber

    return [
      'sup',
      { id: `fnref:${referenceNumber}` },
      ['a', attrs, `[${HTMLAttributes.referenceNumber}]`],
    ]
  },
  addProseMirrorPlugins() {
    const { editor } = this
    const mapNode = (node) => {
      if (node.type.name === this.name) {
        const newAttrs = { ...node.attrs, 'data-fn-id': shortId(10) }
        return node.type.create(newAttrs, node.content, node.marks)
      }
      if (node.content && node.content.size > 0) {
        const newChildren = []
        let changed = false
        node.content.forEach((child) => {
          const mapped = mapNode(child)
          if (mapped !== child) {
            changed = true
          }
          newChildren.push(mapped)
        })
        if (changed) {
          return node.copy(PMFragment.from(newChildren))
        }
      }
      return node
    }
    return [
      new Plugin({
        key: new PluginKey('footnotePasteHandler'),
        props: {
          transformPasted(slice) {
            const mappedNodes = []
            let changed = false

            slice.content.forEach((node) => {
              const mapped = mapNode(node)
              if (mapped !== node) {
                changed = true
              }
              mappedNodes.push(mapped)
            })

            if (!changed) {
              return slice
            }

            return new Slice(
              PMFragment.from(mappedNodes),
              slice.openStart,
              slice.openEnd,
            )
          },
        },
      }),
      new Plugin({
        key: new PluginKey('footnoteRefClick'),
        props: {
          handleDoubleClickOn(view, pos, node, nodePos, event) {
            if (node.type.name !== 'footnoteReference') return false
            event.preventDefault()
            const id = node.attrs['data-fn-id']
            return editor.commands.focusFootnote(id)
          },
          handleClickOn(view, pos, node, nodePos, event) {
            if (node.type.name !== 'footnoteReference') return false
            event.preventDefault()
            const { selection } = editor.state.tr
            if (selection instanceof NodeSelection && selection.node.eq(node)) {
              const id = node.attrs['data-fn-id']
              return editor.commands.focusFootnote(id)
            } else {
              editor.chain().setNodeSelection(nodePos).run()
              return true
            }
          },
        },
      }),
      new Plugin({
        key: new PluginKey('footnoteRefHoverTitle'),
        props: {
          handleDOMEvents: {
            mouseover(view, event) {
              const target = event?.target
              if (!(target instanceof Element)) return false
              const anchor = target.closest(`a.${REF_CLASS}`)
              if (!anchor) return false
              const id = anchor.getAttribute('data-fn-id')
              if (!id) return false
              const matchedFootnote = editor.$node('footnote', {
                'data-fn-id': id,
              })
              const caption = normalizeHoverTitle(
                matchedFootnote?.node?.textContent,
              )
              if (!caption) return false
              anchor.setAttribute('title', caption)
              return false
            },
          },
        },
      }),
    ]
  },
  addCommands() {
    return {
      addFootnote:
        () =>
        ({ state, tr }) => {
          const node = this.type.create({
            'data-fn-id': shortId(10),
          })
          tr.insert(state.selection.anchor, node)
          return true
        },
    }
  },
  addInputRules() {
    return [
      {
        find: /\[\^(.*?)\]/,
        type: this.type,
        undoable: true,
        handler({ range, match, chain }) {
          const start = range.from
          const end = range.to
          if (match[1]) {
            chain().deleteRange({ from: start, to: end }).addFootnote().run()
          }
        },
      },
    ]
  },
})
