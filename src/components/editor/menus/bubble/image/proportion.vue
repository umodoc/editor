<template>
  <editor-menus-button
    :button-active="editor?.getAttributes('image')?.equalProportion"
    tooltip="锁定长宽比"
    @button-click="toggleEqualProportion"
  >
    <icon name="equal-proportion" />
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()

const toggleEqualProportion = () => {
  const image = editor.value.commands.getSelectionNode()
  const { equalProportion } = editor.value?.getAttributes('image')
  image.props.updateAttributes({
    equalProportion: !equalProportion,
  })
}
</script>
