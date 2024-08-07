<template>
  <menus-button
    ico="image-flip"
    :text="t('bubbleMenu.image.flipX')"
    :menu-active="editor?.getAttributes('image')?.flipY"
    @menu-click="setFlip('flipY')"
  />
  <menus-button
    :text="t('bubbleMenu.image.flipY')"
    :menu-active="editor?.getAttributes('image')?.flipX"
    @menu-click="setFlip('flipX')"
  >
    <icon name="image-flip" style="transform: rotate(90deg)" />
  </menus-button>
</template>

<script setup>
const { editor } = useStore()

const setFlip = (flip) => {
  const image = editor.value.commands.getSelectionNode()
  const { flipX, flipY } = image.attrs
  console.log(image)
  if (flip === 'flipX') {
    editor.value.commands.updateAttributes(image.type, {
      flipX: !flipX,
    })
  }
  if (flip === 'flipY') {
    editor.value.commands.updateAttributes(image.type, {
      flipY: !flipY,
    })
  }
}
</script>
