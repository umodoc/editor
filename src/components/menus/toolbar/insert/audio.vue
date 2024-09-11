<template>
  <menus-button
    ico="audio"
    :text="t('insert.audio')"
    huge
    @menu-click="editor?.chain().focus().selectFiles('audio').run()"
  />
</template>

<script setup lang="ts">
const { t } = useI18n()
const { editor } = useStore()
</script>
