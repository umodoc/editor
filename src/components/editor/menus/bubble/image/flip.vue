<template>
  <editor-menus-button
    :button-active="editor?.getAttributes('image')?.flipY"
    tooltip="水平翻转"
    @button-click="setFlip('flipY')"
  >
    <icon name="image-flip" />
  </editor-menus-button>
  <editor-menus-button
    :button-active="editor?.getAttributes('image')?.flipX"
    tooltip="垂直翻转"
    @button-click="setFlip('flipX')"
  >
    <icon name="image-flip" style="transform: rotate(90deg)" />
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()

const setFlip = (flip) => {
  const image = editor.value.commands.getSelectionNode()
  const { flipX, flipY } = editor.value?.getAttributes('image')
  if (flip === 'flipX') {
    image.props.updateAttributes({
      flipX: !flipX,
    })
  }
  if (flip === 'flipY') {
    image.props.updateAttributes({
      flipY: !flipY,
    })
  }
}
</script>
