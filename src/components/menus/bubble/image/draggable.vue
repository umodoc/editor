<template>
  <menus-button
    ico="image-draggable"
    :text="t('bubbleMenu.image.draggable')"
    :menu-active="editor?.getAttributes('image')?.draggable"
    @menu-click="toggleDraggable"
  />
</template>

<script setup>
const { editor } = useStore()

const toggleDraggable = () => {
  const image = editor.value.commands.getSelectionNode()
  editor.value.commands.updateAttributes(image.type, {
    draggable: !image.attrs.draggable,
  })
}
</script>
