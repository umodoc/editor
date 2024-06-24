<template>
  <menus-button
    :text="t('bubbleMenu.code.wordWrap')"
    ico="code-word-wrap"
    :menu-active="editor?.getAttributes('codeBlock')?.wordWrap"
    @menu-click="toggleWordWrap"
  />
</template>

<script setup>
const { editor } = useStore()

const toggleWordWrap = () => {
  const image = editor.value.commands.getSelectionNode()
  const { wordWrap } = editor.value?.getAttributes('codeBlock')
  image.props.updateAttributes({
    wordWrap: !wordWrap,
  })
}
</script>
