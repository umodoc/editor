import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

const insertNewlinePluginKey = new PluginKey('insert-newline')
const edgeThreshold = 8
const horizontalPadding = 12
const excludedNodeTypes = ['footnotes']
const allowedTextblockTypes = ['image']

const isWidgetBlock = (node) => {
  return (
    node.isBlock &&
    (!node.isTextblock || allowedTextblockTypes.includes(node.type.name))
  )
}

const canInsertParagraphAt = (state, pos) => {
  const { paragraph } = state.schema.nodes
  if (!paragraph) {
    return false
  }

  const $pos = state.doc.resolve(pos)
  const index = $pos.index()
  return $pos.parent.canReplaceWith(index, index, paragraph)
}

const getBlockCandidates = (view) => {
  const blocks = []
  const { doc } = view.state

  doc.descendants((node, pos) => {
    if (!isWidgetBlock(node) || excludedNodeTypes.includes(node.type.name)) {
      return
    }

    const end = pos + node.nodeSize
    if (!canInsertParagraphAt(view.state, end)) {
      return
    }

    const dom = view.nodeDOM(pos)
    if (!(dom instanceof Element)) {
      return
    }

    const rect = dom.getBoundingClientRect()
    if (rect.width === 0 && rect.height === 0) {
      return
    }

    const $pos = doc.resolve(pos)
    const index = $pos.index()
    const hasNextSibling = index < $pos.parent.childCount - 1
    const nextSiblingRect = hasNextSibling
      ? (view.nodeDOM(end)?.getBoundingClientRect?.() ?? null)
      : null

    blocks.push({
      depth: $pos.depth + 1,
      end,
      rect,
      zoneLeft: rect.left - horizontalPadding,
      zoneRight: rect.right + horizontalPadding,
      zoneTop: rect.bottom - edgeThreshold,
      zoneBottom:
        nextSiblingRect &&
        (nextSiblingRect.width !== 0 || nextSiblingRect.height !== 0)
          ? nextSiblingRect.top
          : rect.bottom + edgeThreshold,
    })
  })

  return blocks
}

const getInsertPosition = (view, event) => {
  if (!view.editable) {
    return null
  }

  if (event.target instanceof Element) {
    const anchor = event.target.closest('.umo-insert-newline-anchor')
    if (anchor instanceof HTMLElement) {
      const pos = Number(anchor.dataset.pos)
      return Number.isInteger(pos) ? pos : null
    }
  }

  const editorRect = view.dom.getBoundingClientRect()
  if (
    event.clientX < editorRect.left ||
    event.clientX > editorRect.right ||
    event.clientY < editorRect.top ||
    event.clientY > editorRect.bottom
  ) {
    return null
  }

  const blocks = getBlockCandidates(view).filter(
    ({ zoneLeft, zoneRight, zoneTop, zoneBottom }) =>
      event.clientX >= zoneLeft &&
      event.clientX <= zoneRight &&
      event.clientY >= zoneTop &&
      event.clientY <= zoneBottom,
  )
  if (blocks.length === 0) {
    return null
  }

  blocks.sort((left, right) => {
    const distanceDiff =
      Math.abs(event.clientY - left.rect.bottom) -
      Math.abs(event.clientY - right.rect.bottom)
    if (distanceDiff !== 0) {
      return distanceDiff
    }
    return right.depth - left.depth
  })

  return blocks[0].end
}

const createWidget = (pos) => {
  const anchor = document.createElement('div')
  anchor.className = 'umo-insert-newline-anchor'
  anchor.contentEditable = 'false'
  anchor.dataset.pos = String(pos)

  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'umo-insert-newline-widget'
  button.tabIndex = -1
  button.setAttribute('aria-label', 'Insert newline')

  anchor.append(button)
  return anchor
}

export default Extension.create({
  name: 'insert-newline',
  addProseMirrorPlugins() {
    const { editor } = this

    return [
      new Plugin({
        key: insertNewlinePluginKey,
        state: {
          init() {
            return { activePos: null }
          },
          apply(tr, pluginState) {
            const meta = tr.getMeta(insertNewlinePluginKey)
            if (meta?.activePos !== undefined) {
              return { activePos: meta.activePos }
            }
            if (tr.docChanged && pluginState.activePos !== null) {
              return { activePos: tr.mapping.map(pluginState.activePos) }
            }
            return pluginState
          },
        },
        props: {
          decorations(state) {
            const pluginState = insertNewlinePluginKey.getState(state)
            const activePos = pluginState?.activePos
            if (activePos === null) {
              return DecorationSet.empty
            }
            return DecorationSet.create(state.doc, [
              Decoration.widget(activePos, () => createWidget(activePos), {
                side: -1,
                ignoreSelection: true,
              }),
            ])
          },
          handleDOMEvents: {
            mousemove(view, event) {
              const activePos = getInsertPosition(view, event)
              const pluginState = insertNewlinePluginKey.getState(view.state)
              if (pluginState?.activePos === activePos) {
                return false
              }
              view.dispatch(
                view.state.tr.setMeta(insertNewlinePluginKey, { activePos }),
              )
              return false
            },
            mouseleave(view) {
              const pluginState = insertNewlinePluginKey.getState(view.state)
              if (pluginState?.activePos === null) {
                return false
              }
              view.dispatch(
                view.state.tr.setMeta(insertNewlinePluginKey, {
                  activePos: null,
                }),
              )
              return false
            },
            mousedown(view, event) {
              if (!(event.target instanceof Element) || !view.editable) {
                return false
              }

              const button = event.target.closest('.umo-insert-newline-widget')
              if (!(button instanceof HTMLElement)) {
                return false
              }

              const anchor = button.closest('.umo-insert-newline-anchor')
              const pos = Number(anchor?.getAttribute('data-pos'))
              if (!Number.isInteger(pos)) {
                return false
              }

              event.preventDefault()
              editor
                .chain()
                .focus()
                .insertContentAt(pos, { type: 'paragraph' })
                .setTextSelection(pos + 1)
                .run()
              view.dispatch(
                view.state.tr.setMeta(insertNewlinePluginKey, {
                  activePos: null,
                }),
              )
              return true
            },
          },
        },
      }),
    ]
  },
})
