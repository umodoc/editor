<template>
  <menus-button
    ico="clear-format"
    :text="t('base.clearFormat')"
    hide-text
    @menu-click="editor?.chain().focus().unsetAllMarks().run()"
  />
</template>

<script setup>
const { editor } = useStore()
</script>
