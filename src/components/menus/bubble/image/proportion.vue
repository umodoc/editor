<template>
  <menus-button
    ico="equal-proportion"
    text="锁定长宽比"
    :menu-active="editor?.getAttributes('image')?.equalProportion"
    @menu-click="toggleEqualProportion"
  />
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
