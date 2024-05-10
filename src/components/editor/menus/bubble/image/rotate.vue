<template>
  <editor-menus-button tooltip="逆时针旋转90度" @button-click="setRotate(-90)">
    <icon name="image-rotate" />
  </editor-menus-button>
  <editor-menus-button tooltip="顺时针旋转90度" @button-click="setRotate(90)">
    <icon name="image-rotate" style="transform: rotateY(180deg)" />
  </editor-menus-button>
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
