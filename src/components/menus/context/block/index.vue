<template>
  <div
    v-if="visible"
    class="umo-block-menu-hander"
    :style="
      {
        transform: `translate(${page.margin?.left ?? 0}cm, ${scrollTop}px)`,
      } as CSSProperties
    "
  >
    <menus-context-block-node />
    <menus-context-block-common />
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'

const { page, editor } = useStore()

let visible = $ref(false)
let scrollTop = $ref(0)
// 更新菜单位置
const updateMenuPostion = () => {
  const { offsetTop } = useNodePostion()
  if (offsetTop === null) {
    return
  }
  // 设置菜单位置
  visible = true
  scrollTop = offsetTop
}
onMounted(() => {
  if (editor) {
    editor.value?.on('selectionUpdate', updateMenuPostion)
    editor.value?.on('focus', updateMenuPostion)
  } else {
    visible = false
  }
})
onUnmounted(() => {
  if (editor) {
    editor.value?.off('selectionUpdate', updateMenuPostion)
    editor.value?.off('focus', updateMenuPostion)
  }
})
</script>

<style lang="less">
.umo-editor-block-menu {
  .umo-menu-button {
    color: var(--umo-text-color-light) !important;
  }
}
.umo-block-menu-hander {
  position: absolute;
  z-index: 20;
  margin-left: -190px;
  top: 0;
  @media print {
    display: none;
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
.umo-block-menu-dropdown {
  max-height: 300px;
  .umo-block-menu-group-name {
    // padding-top: 8px !important;
    // line-height: 1;
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
      min-width: 180px !important;
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
  .umo-dropdown__submenu {
    margin-left: 10px;
  }

  .umo-delete-node {
    .umo-button {
      * {
        color: var(--umo-error-color) !important;
      }
    }
  }
}
.umo-block-submenu-dropdown {
  margin-left: 10px;
}
</style>
