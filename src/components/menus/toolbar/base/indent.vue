<template>
  <menus-button
    :text="t('base.indent')"
    ico="indent"
    shortcut="Tab"
    hide-text
    @menu-click="editor?.chain().focus().indent().run()"
  />
</template>

<script setup lang="ts">
const { t } = useI18n()
const { editor } = useStore()
</script>
