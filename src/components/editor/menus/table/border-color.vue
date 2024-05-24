<template>
  <editor-menus-button
    ico="table"
    text="表格边框颜色"
    menu-type="popup"
    huge
    :disabled="!editor?.can().setCellAttribute('borderColor')"
    :popup-visible="popupVisible"
    @toggle-popup="togglePopup"
  >
    <template #content>
      <toolbar-color-picker default-color="" @change="colorBorderChange" />
    </template>
  </editor-menus-button>
</template>

<script setup>
const emits = defineEmits(['change'])

let { popupVisible, togglePopup } = usePopup()
const { editor } = useStore()

const colorBorderChange = (color) => {
  popupVisible.value = false
  const borderColor = color === '' ? null : color
  editor.value
    ?.chain()
    .focus()
    .setCellAttribute('borderColor', borderColor)
    .run()
}
</script>
