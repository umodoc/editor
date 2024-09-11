<template>
  <menus-button
    ico="image"
    :text="t('insert.image')"
    huge
    @menu-click="editor?.chain().focus().selectFiles('image').run()"
  />
</template>

<script setup lang="ts">
const { t } = useI18n()
const { editor } = useStore()
</script>
