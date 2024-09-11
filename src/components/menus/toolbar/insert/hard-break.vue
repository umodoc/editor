<template>
  <menus-button
    ico="hard-break"
    :text="t('insert.hardBreak')"
    huge
    shortcut="Shift+Enter"
    @menu-click="editor?.chain().focus().setHardBreak().run()"
  />
</template>

<script setup lang="ts">
const { t } = useI18n()
const { editor } = useStore()
</script>
