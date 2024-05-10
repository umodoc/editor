<template>
  <editor-menus-button
    :button-active="editor?.getAttributes('codeBlock')?.wordWrap"
    tooltip="自动换行"
    @button-click="toggleWordWrap"
  >
    <icon name="code-word-wrap" />
  </editor-menus-button>
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
