<template>
  <editor-menus-button
    :button-active="editor?.getAttributes('codeBlock')?.lineNumbers"
    tooltip="显示行号"
    @button-click="toggleLineNumbers"
  >
    <icon name="code-line-number" />
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()

const toggleLineNumbers = () => {
  const image = editor.value.commands.getSelectionNode()
  const { lineNumbers } = editor.value?.getAttributes('codeBlock')
  image.props.updateAttributes({
    lineNumbers: !lineNumbers,
  })
}
</script>
