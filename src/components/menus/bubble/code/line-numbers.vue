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
  const codeBlock = editor.value.commands.getSelectionNode()
  editor.value.commands.updateAttributes(codeBlock.type, {
    lineNumbers: !codeBlock.attrs.lineNumbers,
  })
}
</script>
