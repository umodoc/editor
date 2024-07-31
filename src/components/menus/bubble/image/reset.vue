<template>
  <menus-button
    ico="image-reset"
    :text="t('bubbleMenu.image.reset')"
    @menu-click="resetPosition"
  />
</template>

<script setup>
const { editor } = useStore()

const resetPosition = () => {
  const image = editor.value.commands.getSelectionNode()
  editor.value.commands.updateAttributes(image.type, {
    top: 0,
    left: 0,
    angle: 0,
    flipX: false,
    flipy: false,
  })
}
</script>
