<template>
  <menus-button
    ico="equal-proportion"
    :text="t('bubbleMenu.image.proportion')"
    :menu-active="editor?.getAttributes('image')?.equalProportion"
    @menu-click="toggleEqualProportion"
  />
</template>

<script setup>
const { editor } = useStore()

const toggleEqualProportion = () => {
  const image = editor.value.commands.getSelectionNode()
  editor.value.commands.updateAttributes(image.type, {
    equalProportion: !image.attrs.equalProportion,
  })
}
</script>
