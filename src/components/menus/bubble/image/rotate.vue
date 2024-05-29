<template>
  <menus-button
    ico="image-rotate"
    text="逆时针旋转90度"
    @button-click="setRotate(-90)"
  />
  <menus-button text="顺时针旋转90度" @button-click="setRotate(90)">
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
