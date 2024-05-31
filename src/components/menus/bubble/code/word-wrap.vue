<template>
  <menus-button
    ico="code-word-wrap"
    text="自动换行"
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
