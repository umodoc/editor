<template>
  <menus-button
    ico="background-color"
    :text="t('bubbleMenu.tag.background')"
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
  const backgroundColor = color === '' ? null : color
  const tag = editor.value?.state?.selection?.$from?.node()
  if (tag) {
    editor.value?.commands.updateAttributes('tag', {
      type: 'custom',
      backgroundColor,
    })
  }
}
</script>
