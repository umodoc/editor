<template>
  <menus-button
    ico="image-rotate"
    :text="t('bubbleMenu.image.rotateCC')"
    @menu-click="setRotate(-90)"
  />
  <menus-button
    :text="t('bubbleMenu.image.rotateC')"
    @menu-click="setRotate(90)"
  >
    <icon name="image-rotate" style="transform: rotateY(180deg)" />
  </menus-button>
</template>

<script setup>
const { editor } = useStore()

const setRotate = (rotate) => {
  const image = editor.value.commands.getSelectionNode()
  const { angle } = editor.value?.getAttributes('image')
  image.props.updateAttributes({
    angle: angle ? angle + rotate : rotate,
  })
}
</script>
