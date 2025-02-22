<template>
  <menus-button
    ico="format-painter"
    :text="t('base.formatPainter.text')"
    :tooltip="t('base.formatPainter.tip')"
    :menu-active="editor?.view?.painter?.enabled"
    :disabled="editor?.state?.selection?.empty"
    hide-text
    @menu-click="setFormatPainter(true)"
    @dblclick="setFormatPainter(false)"
  />
</template>

<script setup lang="ts">
const editor = inject('editor')

const setFormatPainter = (once: boolean) => {
  if (editor.value?.view?.painter?.enabled) {
    editor.value?.commands.unsetFormatPainter()
    return
  }
  editor.value?.chain().focus().setFormatPainter(once).run()
}
</script>
