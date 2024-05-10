<template>
  <editor-menus-button
    button-type="popup"
    tooltip="表格边框颜色"
    :huge-button="hugeButton"
    :disabled="!editor?.can().setCellAttribute('borderColor')"
    :popup-visible="popupVisible"
    @toggle-popup="togglePopup"
  >
    <icon name="table" :size="hugeButton ? '1em' : '18px'" />
    <template #text>
      <p class="button-text">边框颜色</p>
    </template>
    <template #content>
      <toolbar-color-picker default-color="" @change="colorBorderChange" />
    </template>
  </editor-menus-button>
</template>

<script setup>
const { hugeButton } = defineProps({
  hugeButton: {
    type: Boolean,
    default: true,
  },
})
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
