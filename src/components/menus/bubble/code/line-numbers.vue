<template>
  <menus-button
    :text="t('bubbleMenu.code.lineNumbers')"
    ico="code-line-number"
    :menu-active="editor?.getAttributes('codeBlock')?.lineNumbers"
    @menu-click="toggleLineNumbers"
  />
</template>

<script setup lang="ts">
import { getSelectionNode } from '@/extensions/selection'

const { editor } = useStore()

const toggleLineNumbers = () => {
  const codeBlock = editor.value ? getSelectionNode(editor.value) : null
  if (codeBlock) {
    editor.value?.commands.updateAttributes(codeBlock.type, {
      lineNumbers: !codeBlock.attrs.lineNumbers,
    })
  }
}
</script>
