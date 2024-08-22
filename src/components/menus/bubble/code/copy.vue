<template>
  <menus-button
    ico="copy"
    :text="t('bubbleMenu.code.copy.text')"
    @menu-click="copyCode"
  />
</template>

<script setup>
import { getSelectionNode } from '@/extensions/selection'

const { editor } = useStore()

const copyCode = () => {
  const codeBlock = getSelectionNode(editor.value)
  const { copy } = useClipboard({
    source: ref(codeBlock.attrs.code),
  })
  copy()
  useMessage('success', t('bubbleMenu.code.copy.success'))
}
</script>
