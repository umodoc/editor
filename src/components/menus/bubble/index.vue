<template>
  <bubble-menu
    v-show="!blockMenu && !painter.enabled"
    class="umo-editor-bubble-menu"
    :class="{ assistant: assistantBox }"
    :editor="editor"
    :tippy-options="tippyOpitons"
  >
    <menus-bubble-menus
      v-if="options.document.enableBubbleMenu && !assistantBox && !commentBox"
    >
      <template #bubble_menu="props">
        <slot name="bubble_menu" v-bind="props" />
      </template>
    </menus-bubble-menus>
    <assistant-input v-if="options.assistant.enabled && assistantBox" />
    <comment-input v-if="options.document.enableComment && commentBox" />
  </bubble-menu>
</template>

<script setup>
import { BubbleMenu } from '@tiptap/vue-3'

const { options, editor, painter, blockMenu, assistantBox, commentBox } =
  useStore()

// 气泡菜单
let tippyInstance = $ref(null)
const tippyOpitons = $ref({
  appendTo: 'parent',
  maxWidth: 580,
  zIndex: 99,
  onShow(instance) {
    tippyInstance = instance
  },
  onHide() {
    assistantBox.value = false
    commentBox.value = false
  },
  onDestroy() {
    tippyInstance = null
  },
})

// AI 助手
watch(
  () => [assistantBox.value, commentBox.value],
  (visible) => {
    tippyInstance?.setProps({
      placement: visible.includes(true) ? 'bottom' : 'top',
    })
  },
)
</script>

<style lang="less">
.umo-editor-bubble-menu {
  border-radius: var(--umo-radius);
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  &:not(.assistant) {
    padding: 8px 10px;
    box-shadow: var(--umo-shadow);
    border: 1px solid var(--umo-border-color);
    background-color: var(--umo-color-white);
  }

  &:empty {
    display: none;
  }

  .umo-menu-button.show-text .umo-button-content .umo-button-text {
    display: none !important;
  }

  .umo-menu-button.huge {
    height: var(--td-comp-size-xs);
    min-width: unset;

    .umo-button-content {
      min-width: unset !important;

      .umo-icon {
        font-size: 16px;
        margin-top: 0;
      }
    }
  }
}
</style>
