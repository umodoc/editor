<template>
  <menus-button
    ico="download"
    :text="t('bubbleMenu.file.download')"
    @menu-click="downloadFile"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
import { getSelectionNode } from '@/extensions/selection'

const { editor } = useStore()

const downloadFile = () => {
  const node = editor.value ? getSelectionNode(editor.value) : null
  const a = document.createElement('a')
  a.href = node?.attrs.url
  a.download = node?.attrs.name
  if (a) {
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
}
</script>
