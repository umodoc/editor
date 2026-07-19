import { ListItem, TaskItem } from '@tiptap/extension-list'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { shallowReactive } from 'vue'

import NodeView from './node-view.vue'
import { getActiveListItemPos, hasListStructureChange } from './utils'

const listItemStatePluginKey = new PluginKey('umo-list-item-state')
const addListItemNodeView = () => VueNodeViewRenderer(NodeView)

const createListItemPluginState = (state, structureVersion = 0) => {
  return {
    activeListItemPos: getActiveListItemPos(state),
    structureVersion,
  }
}

const isSameListItemPluginState = (currentState, nextState) => {
  return (
    currentState?.activeListItemPos === nextState.activeListItemPos &&
    currentState?.structureVersion === nextState.structureVersion
  )
}

export const ListItemExtension = ListItem.extend({
  addStorage() {
    return {
      state: shallowReactive({
        activeListItemPos: null,
        structureVersion: 0,
      }),
    }
  },
  addNodeView() {
    return addListItemNodeView()
  },
  addProseMirrorPlugins() {
    const storageState = this.storage.state
    const syncStorageState = (pluginState) => {
      if (!pluginState || isSameListItemPluginState(storageState, pluginState)) {
        return
      }

      storageState.activeListItemPos = pluginState.activeListItemPos
      storageState.structureVersion = pluginState.structureVersion
    }

    return [
      new Plugin({
        key: listItemStatePluginKey,
        state: {
          init: (_config, state) => createListItemPluginState(state),
          apply: (tr, pluginState, _oldState, newState) => {
            const nextStructureVersion =
              pluginState.structureVersion +
              (hasListStructureChange(tr) ? 1 : 0)

            const nextPluginState = createListItemPluginState(
              newState,
              nextStructureVersion,
            )

            return isSameListItemPluginState(pluginState, nextPluginState)
              ? pluginState
              : nextPluginState
          },
        },
        view: (view) => {
          syncStorageState(listItemStatePluginKey.getState(view.state))

          return {
            update: (updatedView) => {
              syncStorageState(
                listItemStatePluginKey.getState(updatedView.state),
              )
            },
          }
        },
      }),
    ]
  },
  addKeyboardShortcuts() {
    const shortcuts = this.parent?.() || {}

    return {
      ...shortcuts,
      Tab: () => {
        if (this.editor.isActive('orderedList')) {
          return this.editor.commands.sinkOrderedListItemWithType()
        }
        return shortcuts.Tab?.() ?? this.editor.commands.sinkListItem(this.name)
      },
    }
  },
})

export const TaskItemExtension = TaskItem.extend({
  addNodeView() {
    return addListItemNodeView()
  },
})
