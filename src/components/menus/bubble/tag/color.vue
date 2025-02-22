<template>
  <menus-button
    ico="color"
    :text="t('bubbleMenu.tag.color')"
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
const emits = defineEmits(['change'])

const { popupVisible, togglePopup } = usePopup()
const editor = inject('editor')

const colorChange = (color: any) => {
  popupVisible.value = false
  const textColor = color === '' ? null : color
  const tag = editor.value?.state?.selection?.$from?.node()
  if (tag) {
    editor.value?.commands.updateAttributes('tag', {
      type: 'custom',
      color: textColor,
    })
  }
}
</script>
