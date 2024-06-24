<template>
  <menus-button
    :text="t('bubbleMenu.code.lineNumbers')"
    ico="code-line-number"
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
