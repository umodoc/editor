<template>
  <menus-button
    ico="table-cells-background"
    :text="t('bubbleMenu.textBox.background')"
    menu-type="popup"
    huge
    :popup-visible="popupVisible"
    @toggle-popup="togglePopup"
  >
    <template #content>
      <color-picker default-color="transparent" @change="colorChange" />
    </template>
  </menus-button>
</template>

<script setup lang="ts">
import { getSelectionNode } from '@/extensions/selection'
const emits = defineEmits(['change'])

const { popupVisible, togglePopup } = usePopup()
const editor = inject('editor')

const colorChange = (color: any) => {
  popupVisible.value = false
  const backgroundColor = color === '' ? null : color
  const textBox = editor.value ? getSelectionNode(editor.value) : null
  if (textBox) {
    editor.value?.commands.updateAttributes(textBox.type, {
      backgroundColor,
    })
  }
}
</script>
