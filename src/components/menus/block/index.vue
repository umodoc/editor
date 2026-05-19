<template>
  <drag-handle
    :editor="editor"
    class="umo-block-menu-drag-handle"
    :class="{
      'is-empty': editor?.isEmpty,
      'is-visible': selectedNodePos !== null,
    }"
    :node-type="selectedNode?.type?.name || 'unknown'"
    @node-change="nodeChange"
  >
    <div class="umo-block-menu-hander">
      <menus-block-node
        :node="selectedNode"
        :pos="selectedNodePos"
        @dropdown-visible="dropdownVisible"
      />
      <menus-block-common
        v-if="!editor?.isEmpty"
        :node="selectedNode"
        :pos="selectedNodePos"
        @dropdown-visible="dropdownVisible"
      />
    </div>
  </drag-handle>
</template>

<script setup>
import { DragHandle } from '@tiptap/extension-drag-handle-vue-3'

const editor = inject('editor')
let selectedNode = $ref(null)
let selectedNodePos = $ref(null)

const nodeChange = ({ node, pos }) => {
  selectedNode = node || null
  if (pos !== null) {
    selectedNodePos = pos
  }
}

const dropdownVisible = (visible) => {
  editor.value.commands.setMeta('lockDragHandle', visible)
}
</script>

<style lang="scss">
.umo-block-menu {
  .umo-menu-button {
    color: var(--umo-text-color-light) !important;
  }
  &-drag-handle {
    z-index: 10;
    outline: solid 1px var(--umo-border-color);
    transform: translateX(-15px);
    padding: 2px;
    border-radius: 3px;
    background-color: #fff;
    margin-top: -5px;
    &:hover {
      outline: none;
      box-shadow:
        0 2px 5px rgba(0, 0, 0, 0.06),
        0 0 0 1px rgba(0, 0, 0, 0.1);
    }
    &[node-type='table'],
    &[node-type='horizontalRule'],
    &[node-type='columnContainer'],
    &[node-type='codeBlock'],
    &[node-type='details'],
    &[node-type='ProseMirror-gapcursor'] {
      margin-top: 0;
    }
    &[node-type='pageBreak'] {
      margin-top: -14px;
    }
    &[node-type='footnotes'] {
      display: none;
    }
    &.is-empty {
      z-index: 20;
    }
    &.is-visible {
      visibility: visible !important;
    }
  }
  &-hander {
    display: flex;
    @media print {
      display: none;
    }
    .umo-menu-button {
      background-color: #fff;
      width: 20px;
      height: 20px;
      &-wrap {
        margin: 0 !important;
      }
      .umo-button-content {
        color: rgba(0, 0, 0, 0.5);
      }
      &:not(.active):hover {
        background-color: var(--umo-content-node-selected-background);
        .umo-button-content {
          color: var(--umo-primary-color);
        }
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
