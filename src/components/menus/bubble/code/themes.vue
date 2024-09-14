<template>
  <menus-button
    :text="t('bubbleMenu.code.themes.text')"
    menu-type="select"
    style="width: 100px"
    :select-options="themes"
    :select-value="editor?.getAttributes('codeBlock')?.theme"
    @menu-click="setTheme"
  />
</template>

<script setup lang="ts">
import { getSelectionNode } from '@/extensions/selection'

const { editor } = useStore()

const themes = [
  { label: t('bubbleMenu.code.themes.dark'), value: 'dark' },
  { label: t('bubbleMenu.code.themes.light'), value: 'light' },
]

const setTheme = (theme: 'dark' | 'light') => {
  const codeBlock = editor.value ? getSelectionNode(editor.value) : null
  if (codeBlock) {
    editor.value?.commands.updateAttributes(codeBlock.type, { theme })
  }
}
</script>
