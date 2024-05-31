<template>
  <menus-button
    ico="code-line-number"
    text="显示行号"
    :menu-active="editor?.getAttributes('codeBlock')?.lineNumbers"
    @menu-click="toggleLineNumbers"
  />
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
