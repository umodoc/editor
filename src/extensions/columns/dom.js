import { Decoration, DecorationSet } from '@tiptap/pm/view'

import { gridResizingPluginKey } from './state'
import {
  draggedWidth,
  findBoundaryPosition,
  getColumnInfoAtPos,
  updateColumnNodeWidth,
} from './utils'

const updateActiveHandle = (view, value) => {
  view.dispatch(
    view.state.tr.setMeta(gridResizingPluginKey, {
      setHandle: value,
    }),
  )
}

export const handleMouseMove = (view, event, handleWidth) => {
  const pluginState = gridResizingPluginKey.getState(view.state)
  if (!pluginState) return false

  if (pluginState.dragging) return false

  const boundaryPos = findBoundaryPosition(view, event, handleWidth)
  if (boundaryPos !== pluginState.activeHandle) {
    updateActiveHandle(view, boundaryPos)
  }
  return false
}

export const handleMouseLeave = (view) => {
  const pluginState = gridResizingPluginKey.getState(view.state)
  if (!pluginState) return false
  if (pluginState.activeHandle > -1 && !pluginState.dragging) {
    updateActiveHandle(view, -1)
  }
  return false
}

export const handleMouseDown = (view, event, columnMinWidth) => {
  const pluginState = gridResizingPluginKey.getState(view.state)
  if (!pluginState) return false
  const { target } = event
  if (
    target instanceof Element &&
    target.closest('.grid-resize-handle-circle-btn')
  ) {
    return false
  }
  if (pluginState.activeHandle === -1) return false
  if (pluginState.dragging) return false

  const columnInfo = getColumnInfoAtPos(view, pluginState.activeHandle)
  if (!columnInfo) return false

  const { domWidth, $pos, node } = columnInfo
  const nodeAttrs = { ...(node.attrs || {}) }
  const nodePos = $pos.before()

  view.dispatch(
    view.state.tr.setMeta(gridResizingPluginKey, {
      setDragging: { startX: event.clientX, startWidth: domWidth },
    }),
  )

  const win = view.dom.ownerDocument.defaultView || window

  const finish = (e) => {
    win.removeEventListener('mouseup', finish)
    win.removeEventListener('mousemove', move)

    const pluginState = gridResizingPluginKey.getState(view.state)
    if (!pluginState?.dragging) return

    const finalWidth = draggedWidth(pluginState.dragging, e, columnMinWidth)
    updateColumnNodeWidth(view, nodePos, nodeAttrs, finalWidth)
    view.dispatch(
      view.state.tr.setMeta(gridResizingPluginKey, {
        setDragging: null,
      }),
    )
  }

  const move = (e) => {
    if (!e.buttons) {
      finish(e)
      return
    }
    const pluginState = gridResizingPluginKey.getState(view.state)
    if (!pluginState?.dragging) return

    const newWidth = draggedWidth(pluginState.dragging, e, columnMinWidth)
    updateColumnNodeWidth(view, nodePos, nodeAttrs, newWidth)
  }

  win.addEventListener('mouseup', finish)
  win.addEventListener('mousemove', move)

  updateColumnNodeWidth(view, nodePos, nodeAttrs, domWidth)

  event.preventDefault()
  return true
}

export const handleGridDecorations = (state, boundaryPos) => {
  const decorations = []
  const $pos = state.doc.resolve(boundaryPos)
  if ($pos.nodeAfter !== null) {
    const widget = document.createElement('div')
    widget.className = 'grid-resize-handle'
    const circleButton = document.createElement('div')
    circleButton.className = 'grid-resize-handle-circle-btn'
    widget.appendChild(circleButton)
    const plusIcon = document.createElement('div')
    plusIcon.className = 'grid-resize-handle-icon'
    circleButton.appendChild(plusIcon)
    decorations.push(Decoration.widget(boundaryPos, widget))
  }
  return DecorationSet.create(state.doc, decorations)
}

export const handleMouseUp = (view, event) => {
  const { target } = event
  if (!(target instanceof Element)) return false
  const button = target.closest('.grid-resize-handle-circle-btn')
  if (!button) return false
  const column = button.closest('.umo-node-column')
  if (!column) return false
  const boundryPos = view.posAtDOM(column, 0)
  if (!boundryPos) return false
  const $pos = view.state.doc.resolve(boundryPos)
  const { state } = view
  view.dispatch(
    state.tr.insert(
      $pos.pos + $pos.parent.nodeSize - 1,
      state.schema.nodes.column.create(
        {
          colWidth: 100,
        },
        state.schema.nodes.paragraph.create(),
      ),
    ),
  )
  event.preventDefault()
  return true
}
