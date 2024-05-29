<template>
  <menus-button
    ico="image-reset"
    text="重置图片位置"
    @button-click="resetPosition"
  />
</template>

<script setup>
const { editor } = useStore()

const resetPosition = () => {
  const image = editor.value.commands.getSelectionNode()
  image.props.updateAttributes({
    top: 0,
    left: 0,
    angle: 0,
    flipX: false,
    flipy: false,
  })
}
</script>
