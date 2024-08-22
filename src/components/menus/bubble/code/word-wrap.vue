<template>
  <menus-button
    :text="t('bubbleMenu.code.wordWrap')"
    ico="code-word-wrap"
    :menu-active="editor?.getAttributes('codeBlock')?.wordWrap"
    @menu-click="toggleWordWrap"
  />
</template>

<script setup>
import { getSelectionNode } from '@/extensions/selection'

const { editor } = useStore()

const toggleWordWrap = () => {
  const codeBlock = getSelectionNode(editor.value)
  editor.value.commands.updateAttributes(codeBlock.type, {
    wordWrap: !codeBlock.attrs.wordWrap,
  })
}
</script>
