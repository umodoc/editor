<template>
  <editor-menus-button
    :button-active="editor?.getAttributes('image')?.draggable"
    tooltip="图片浮动"
    @button-click="toggleDraggable"
  >
    <icon name="image-draggable" />
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()

const toggleDraggable = () => {
  const image = editor.value.commands.getSelectionNode()
  const { draggable } = editor.value?.getAttributes('image')
  image.props.updateAttributes({
    draggable: !draggable,
  })
}
</script>
