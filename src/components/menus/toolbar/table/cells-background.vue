<template>
  <menus-button
    ico="table-cells-background"
    :text="t('table.cellBgColor.text')"
    :tooltip="t('table.cellBgColor.tip')"
    menu-type="popup"
    huge
    :disabled="!editor?.can().setCellAttribute('background', '')"
    :popup-visible="popupVisible"
    @toggle-popup="togglePopup"
  >
    <template #content>
      <color-picker default-color="" @change="colorChange" />
    </template>
  </menus-button>
</template>

<script setup lang="ts">
const emits = defineEmits(['change'])

const { popupVisible, togglePopup } = usePopup()
const editor = inject('editor')

const colorChange = (color: string) => {
  popupVisible.value = false
  const background = color === '' ? null : color
  editor.value?.chain().focus().setCellAttribute('background', background).run()
}
</script>
