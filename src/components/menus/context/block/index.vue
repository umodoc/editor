<template>
  <drag-handle
    :editor="editor"
    :tippy-options="tippyOpitons"
    class="umo-block-menu-drag-handle"
    :class="{ 'is-empty': editor.isEmpty }"
    @node-change="nodeChange"
  >
    <div
      class="umo-block-menu-hander"
      :class="`umo-selected-node-${selectedNode?.type?.name || 'unknown'} `"
    >
      <menus-context-block-node @dropdown-visible="dropdownVisible" />
      <menus-context-block-common
        v-if="
          !editor.isEmpty ||
          editor.isActive('table') ||
          editor.isActive('callout')
        "
        :node="selectedNode"
        :pos="selectedNodePos"
        @dropdown-visible="dropdownVisible"
      />
    </div>
  </drag-handle>
</template>

<script setup lang="ts">
import DragHandle from '@tiptap-pro/extension-drag-handle-vue-3'
import type { Instance } from 'tippy.js'

const editor = inject('editor')
let selectedNode = $ref(null)
let selectedNodePos = $ref(null)

let tippyInstance = $ref<Instance | null>(null)
const tippyOpitons = $ref<Partial<Instance>>({
  zIndex: 20,
  popperOptions: {
    modifiers: [
      {
        name: 'eventListeners',
        options: { scroll: false, resize: false },
      },
    ],
  },
  onMount(instance: Instance) {
    tippyInstance = instance
  },
})

// 菜单位置更新
const updateMenuPostion = () => {
  try {
    const { state, view } = editor.value
    const topPos = state.selection.$from.before(1)
    const topDOM = view.nodeDOM(topPos)
    const rect = topDOM?.getBoundingClientRect()
    if (rect) {
      tippyInstance.setProps({
        getReferenceClientRect: () => rect,
      })
    }
  } catch {}
}
onMounted(() => {
  editor.value.on('selectionUpdate', updateMenuPostion)
})

const nodeChange = ({ node, pos }: { node: Node | null; pos: number }) => {
  selectedNode = node ?? null
  if (pos !== null) {
    selectedNodePos = pos
  }
}

const dropdownVisible = (visible: boolean) => {
  editor.value.commands.setMeta('lockDragHandle', visible)
}
</script>

<style lang="less">
.umo-block-menu {
  .umo-menu-button {
    color: var(--umo-text-color-light) !important;
  }
  &-drag-handle.is-empty {
    .umo-block-menu-hander {
      margin-top: 2px;
    }
  }
  &-hander {
    position: absolute;
    display: flex;
    right: -10px;
    top: -5px;
    padding-right: 15px;
    @media print {
      display: none;
    }
    &.umo-selected-node {
      &-table,
      &-horizontalRule,
      &-ProseMirror-gapcursor {
        margin-top: 5px;
      }
      &-pageBreak {
        margin-top: -6px;
      }
    }
    .umo-menu-button {
      background-color: var(--umo-page-background);
      .umo-button-content {
        color: rgba(0, 0, 0, 0.5);
      }
      &:not(.active):hover {
        background-color: var(--umo-content-node-selected-background);
      }
      &.active {
        &:hover {
          opacity: 0.8;
        }
        .umo-button-content {
          color: var(--umo-text-color-light);
        }
      }
    }
  }
  &-dropdown {
    .umo-block-menu-group-name {
      padding-left: 15px !important;
    }
    .umo-dropdown__menu,
    .umo-dropdown__submenu {
      --td-radius-default: 0;
      padding: 8px 0 !important;
      .umo-divider {
        margin: 4px 0 2px;
        opacity: 0.5;
      }
      .umo-dropdown__item {
        padding: 2px 0;
        min-width: 140px !important;
        .umo-menu-button {
          background-color: transparent;
          padding: 0 15px;
          box-sizing: border-box;
          justify-content: flex-start;
          width: 100%;
          &-wrap {
            display: block !important;
          }
          .umo-button__text {
            width: 100%;
          }
        }
        .umo-button-content {
          width: 100%;
          justify-content: flex-start;
          .umo-button-text {
            color: var(--umo-text-color);
          }
          .umo-button-icon {
            margin-right: 3px;
            font-size: 16px;
            color: #666;
          }
          .umo-button-kbd {
            flex: 1;
            text-align: right;
            color: var(--umo-text-color-light);
            font-family: Arial, Helvetica, sans-serif;
            font-size: 9px;
          }
          .umo-heading {
            display: flex;
            color: var(--umo-text-color);
            .icon-heading {
              font-size: 12px;
              display: inline-block;
              width: 2em;
            }
          }
        }
        &--disabled {
          .umo-button-content {
            opacity: 0.6;
          }
        }
        &-direction {
          opacity: 0.4;
          font-size: 12px !important;
          margin-right: 8px;
        }
        .umo-dropdown-item-label {
          padding: 1px 15px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }

    .umo-delete-node {
      .umo-button {
        * {
          color: var(--umo-error-color) !important;
        }
      }
    }
  }
}

.ProseMirror-noderangeselection {
  *::selection {
    background: transparent;
  }
  * {
    caret-color: transparent;
  }
}
</style>
