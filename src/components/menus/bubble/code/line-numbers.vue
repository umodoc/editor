<template>
  <menus-button
    :text="t('bubbleMenu.code.lineNumbers')"
    ico="code-line-number"
    :menu-active="editor?.getAttributes('codeBlock')?.lineNumbers"
    @menu-click="toggleLineNumbers"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
import { getSelectionNode } from '@/extensions/selection'

const { editor } = useStore()

const toggleLineNumbers = () => {
  const codeBlock = editor.value ? getSelectionNode(editor.value) : null
  editor.value?.commands.updateAttributes(codeBlock.type, {
    lineNumbers: !codeBlock.attrs.lineNumbers,
  })
}
</script>
