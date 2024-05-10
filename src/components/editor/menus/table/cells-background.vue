<template>
  <editor-menus-button
    button-type="popup"
    tooltip="单元格背景颜色"
    :huge-button="hugeButton"
    :disabled="!editor?.can().setCellAttribute('backgroundColor')"
    :popup-visible="popupVisible"
    @toggle-popup="togglePopup"
  >
    <icon name="table-cells-background" :size="hugeButton ? '1em' : '18px'" />
    <template #text>
      <p class="button-text">背景颜色</p>
    </template>
    <template #content>
      <toolbar-color-picker default-color="" @change="colorChange" />
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
