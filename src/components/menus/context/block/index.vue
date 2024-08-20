<template>
  <div
    v-if="menuVisible"
    class="umo-block-menu-hander"
    :style="`transform: translate(${page.margin.left}cm, ${menuScrollTop}px);`"
  >
    <menus-context-block-node />
    <menus-context-block-common />
  </div>
</template>

<script setup>
const { container, page, editor } = useStore()

let menuVisible = $ref(false)
let menuScrollTop = $ref(0)

// 更新菜单位置
const updateMenuPostion = () => {
  const currentBlock = document.querySelector(
    `${container} .umo-page-node-content .umo-node-focused`,
  )
  if (currentBlock === null) {
    return
  }

  // 当前元素距离页面顶部的距离
  let { offsetTop } = currentBlock

  // 微修正菜单位置
  offsetTop = currentBlock.tagName === 'DIV' ? offsetTop - 8 : offsetTop - 5
  let offsetY = 0
  if (
    editor.value.isActive('horizontalRule') ||
    editor.value.isActive('table')
  ) {
    offsetY = 5
  }
  if (editor.value.isActive('pagination')) {
    offsetY = -4
  }

  // 设置菜单位置
  menuVisible = true
  menuScrollTop = offsetTop + offsetY
}
watch(
  editor,
  (val) => {
    if (val) {
      editor.value.on('selectionUpdate', updateMenuPostion)
      editor.value.on('focus', updateMenuPostion)
      // editor.value.on('blur', () => (menuVisible = false))
    } else {
      menuVisible = false
    }
  },
  { immediate: true },
)
</script>

<style lang="less">
.umo-block-menu-hander {
  position: absolute;
  z-index: 20;
  margin-left: -68px;
  .umo-menu-button {
    background-color: transparent;
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
        .text {
          color: var(--umo-text-color);
        }
        .umo-icon {
          margin-right: 3px;
          font-size: 16px;
          color: #666;
        }
        .kbd {
          flex: 1;
          text-align: right;
          color: var(--umo-text-color-light);
          font-family: Arial, Helvetica, sans-serif;
          font-size: 9px;
        }
        .heading {
          display: flex;
          color: var(--umo-text-color);
          .umo-icon {
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
        -webkit-box-orient: vertical;
      }
    }
  }
  .umo-dropdown__submenu {
    margin-left: 10px;
  }

  .delete-node {
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
