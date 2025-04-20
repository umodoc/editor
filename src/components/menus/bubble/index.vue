<template>
  <bubble-menu
    class="umo-editor-bubble-menu"
    :class="{ assistant }"
    :editor="editor!"
    :tippy-options="tippyOpitons"
  >
    <menus-bubble-menus
      v-if="options?.document?.enableBubbleMenu && !assistant"
    >
      <template #bubble_menu="props">
        <slot name="bubble_menu" v-bind="props" />
      </template>
    </menus-bubble-menus>
    <ai-assistant-input v-if="options?.ai?.assistant?.enabled && assistant" />
  </bubble-menu>
</template>

<script setup lang="ts">
import { BubbleMenu } from '@tiptap/vue-3'
import type { Instance } from 'tippy.js'

const editor = inject('editor')
const assistant = inject('assistant')
const options = inject('options')

// 气泡菜单
let tippyInstance = $ref<Instance | null>(null)
const tippyOpitons = $ref<Partial<Instance>>({
  appendTo: 'parent',
  maxWidth: 580,
  zIndex: 110,
  onShow(instance: Instance) {
    tippyInstance = instance
  },
  onHide() {
    assistant.value = false
  },
  onDestroy() {
    tippyInstance = null
  },
})

// AI 助手
watch(
  () => [assistant.value],
  (visible: any[]) => {
    if (tippyInstance) {
      tippyInstance?.setProps({
        placement: visible.includes(true) ? 'bottom' : 'top',
      })
    }
  },
)

// 销毁 tippy
onUnmounted(() => {
  if (tippyInstance) {
    tippyInstance.destroy()
    tippyInstance = null
  }
})
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
