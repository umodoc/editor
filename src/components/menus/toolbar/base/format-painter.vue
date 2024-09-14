<template>
  <menus-button
    ico="format-painter"
    :text="t('base.formatPainter.text')"
    :tooltip="t('base.formatPainter.tip')"
    :menu-active="painter.enabled"
    :disabled="editor?.state?.selection?.empty"
    hide-text
    @menu-click="setFormatPainter(true)"
    @dblclick="setFormatPainter(false)"
  />
</template>

<script setup lang="ts">
const { editor, painter } = useStore()

const setFormatPainter = (once: boolean) => {
  painter.value.enabled = !painter.value.enabled
  if (painter.value.enabled) {
    editor.value?.chain().focus().setFormatPainter(once).run()
  }
}
</script>
