<template>
  <menus-button
    ico="table"
    :text="t('table.borderColor')"
    menu-type="popup"
    huge
    :disabled="!editor?.can().setCellAttribute('borderColor', '')"
    :popup-visible="popupVisible"
    @toggle-popup="togglePopup"
  >
    <template #content>
      <color-picker default-color="" @change="colorBorderChange" />
    </template>
  </menus-button>
</template>

<script setup lang="ts">
const emits = defineEmits(['change'])

const { popupVisible, togglePopup } = usePopup()
const editor = inject('editor')

const colorBorderChange = (color: string) => {
  popupVisible.value = false
  const borderColor = color === '' ? null : color
  editor.value
    ?.chain()
    .focus()
    .setCellAttribute('borderColor', borderColor)
    .run()
}
</script>
