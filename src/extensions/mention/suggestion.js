import { computePosition, flip, shift } from '@floating-ui/dom'
import { posToDOMRect, VueRenderer } from '@tiptap/vue-3'

import Mentions from './mentions.vue'

const MAX_RESULTS = 50

const normalizeUsers = (users) => (Array.isArray(users) ? users : [])

const normalizeQuery = (query = '') => query.trim().toLowerCase()

const filterUsers = (users, query = '') =>
  normalizeUsers(users)
    .filter((user) =>
      String(user?.label || '')
        .toLowerCase()
        .includes(normalizeQuery(query)),
    )
    .slice(0, MAX_RESULTS)

const updatePosition = (editor, element) => {
  const virtualElement = {
    getBoundingClientRect: () =>
      posToDOMRect(
        editor.view,
        editor.state.selection.from,
        editor.state.selection.to,
      ),
  }

  computePosition(virtualElement, element, {
    placement: 'bottom-start',
    strategy: 'absolute',
    middleware: [shift(), flip()],
  }).then(({ x, y, strategy }) => {
    element.style.width = 'max-content'
    element.style.position = strategy
    element.style.left = `${x}px`
    element.style.top = `${y}px`
  })
}

export default ({ users = [], onSearch } = {}) => {
  const localUsers = normalizeUsers(users)
  const state = {
    items: filterUsers(localUsers),
    isLoading: false,
    query: '',
  }
  let requestId = 0
  let component = null
  let currentProps = null

  const syncComponent = () => {
    if (!component || !currentProps) {
      return
    }

    component.updateProps({
      ...currentProps,
      items: state.items,
      isLoading: state.isLoading,
    })
  }

  const loadRemoteUsers = async (query, localItems) => {
    // When no remote search is configured, mention suggestions are fully local.
    if (!query || typeof onSearch !== 'function') {
      state.items = localItems
      state.isLoading = false
      syncComponent()
      return
    }

    const currentRequestId = ++requestId

    state.items = []
    state.isLoading = true
    syncComponent()

    try {
      const remoteUsers = await onSearch(query)

      if (currentRequestId !== requestId || query !== state.query) {
        return
      }

      state.items = normalizeUsers(remoteUsers).slice(0, MAX_RESULTS)
    } catch (error) {
      if (currentRequestId !== requestId || query !== state.query) {
        return
      }

      state.items = []
      console.error('[mention] failed to load remote users:', error)
    }

    if (currentRequestId !== requestId || query !== state.query) {
      return
    }

    state.isLoading = false
    syncComponent()
  }

  return {
    items: ({ query }) => {
      const localItems = filterUsers(localUsers, query)
      // Once a remote search handler is provided, suggestions are driven only by
      // remote results for non-empty queries. Otherwise they stay fully local.
      const shouldUseRemoteSearch = Boolean(
        query && typeof onSearch === 'function',
      )

      state.query = query
      state.items = shouldUseRemoteSearch ? [] : localItems
      state.isLoading = shouldUseRemoteSearch

      void loadRemoteUsers(query, localItems)

      return shouldUseRemoteSearch ? [] : localItems
    },

    command: ({ editor, range, props }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: 'mention',
          attrs: {
            id: props.id,
            label: props.label,
          },
        })
        .run()
    },

    render: () => {
      return {
        onStart: (props) => {
          currentProps = props
          component = new VueRenderer(Mentions, {
            props: {
              ...props,
              items: state.items,
              isLoading: state.isLoading,
            },
            editor: props.editor,
          })

          if (!props.clientRect) {
            return
          }

          component.element.style.position = 'absolute'

          document.body.appendChild(component.element)

          updatePosition(props.editor, component.element)
        },
        onUpdate(props) {
          currentProps = props
          syncComponent()
          if (!props.clientRect) {
            return
          }

          updatePosition(props.editor, component.element)
        },
        onKeyDown(props) {
          if (props.event.key === 'Escape') {
            component.destroy()
            return true
          }
          return component.ref?.onKeyDown(props)
        },
        onExit() {
          component.element.remove()
          component.destroy()
          component = null
          currentProps = null
          state.isLoading = false
        },
      }
    },
  }
}
