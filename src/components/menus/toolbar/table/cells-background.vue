<template>
  <menus-button
    ico="table-cells-background"
    :text="t('table.cellBgColor.text')"
    :tooltip="t('table.cellBgColor.tip')"
    menu-type="popup"
    huge
    :disabled="!editor?.can().setCellAttribute('backgroundColor')"
    :popup-visible="popupVisible"
    @toggle-popup="togglePopup"
  >
    <template #content>
      <color-picker default-color="" @change="colorChange" />
    </template>
  </menus-button>
</template>

<script setup>
const emits = defineEmits(['change'])

let { popupVisible, togglePopup } = usePopup()
const { editor } = useStore()

const colorChange = (color) => {
  popupVisible.value = false
  const backgroundColor = color === '' ? null : color
  editor.value
    ?.chain()
    .focus()
    .setCellAttribute('backgroundColor', backgroundColor)
    .run()
}
</script>
