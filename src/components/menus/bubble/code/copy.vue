<template>
  <menus-button
    ico="copy"
    :text="t('bubbleMenu.code.copy.text')"
    @menu-click="copyCode"
  />
</template>

<script setup lang="ts">
import { getSelectionNode } from '@/extensions/selection'

const editor = inject('editor')
const container = inject('container')

const copyCode = () => {
  const codeBlock = editor.value ? getSelectionNode(editor.value) : null
  if (codeBlock) {
    const { copy } = useClipboard({
      source: ref(codeBlock.attrs.code),
    })
    void copy()
    useMessage('success', {
      attach: container,
      content: t('bubbleMenu.code.copy.success'),
    })
  }
}
</script>
