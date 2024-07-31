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
  const codeBlock = editor.value.commands.getSelectionNode()
  editor.value.commands.updateAttributes(codeBlock.type, {
    wordWrap: !codeBlock.attrs.wordWrap,
  })
}
</script>
