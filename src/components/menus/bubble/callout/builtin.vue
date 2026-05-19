<template>
  <div class="umo-bubble-callout-builtin">
    <div
      v-for="item in callouts"
      :key="item.type"
      class="umo-bubble-callout-item"
      :style="{
        color: item.color,
        backgroundColor: item.backgroundColor,
      }"
      @click="selectStyle(item)"
    >
      <icon
        v-if="editor?.getAttributes('callout').type === item.type"
        name="selected"
        size="14"
      />
      <span v-else class="umo-bubble-callout-item-text">{{ item.icon }}</span>
    </div>
  </div>
</template>

<script setup>
import { getSelectionNode } from '@/utils/selection'

const callouts = [
  {
    type: 'default',
    icon: '💬',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  {
    type: 'danger',
    icon: '🚫',
    backgroundColor: 'rgb(252, 223, 220)',
  },
  {
    type: 'primary',
    icon: '📎',
    backgroundColor: 'rgb(217, 231, 255)',
  },
  {
    type: 'warning',
    icon: '💡',
    backgroundColor: 'rgb(255, 245, 210)',
  },
  {
    type: 'success',
    icon: '✅',
    backgroundColor: 'rgb(205, 245, 235)',
  },
]

const editor = inject('editor')

const selectStyle = (item) => {
  const callout = editor.value ? getSelectionNode(editor.value) : null
  if (callout) {
    editor.value?.commands.updateAttributes('callout', {
      type: item.type,
      icon: item.icon,
      backgroundColor: item.backgroundColor,
    })
  }
}
</script>

<style lang="scss">
.umo-bubble-callout-builtin {
  display: flex;
  align-items: center;
}
.umo-bubble-callout-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  border: solid 1px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  margin-right: 5px;
  &-text {
    font-size: 12px;
  }
}
</style>
