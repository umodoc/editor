<template>
  <menus-button
    ico="details"
    text="详情"
    huge
    :menu-active="editor?.isActive('details')"
    :disabled="!editor?.can().setDetails()"
    @button-click="editor?.chain().focus().setDetails().run()"
  />
</template>

<script setup>
const { editor } = useStore()
</script>
