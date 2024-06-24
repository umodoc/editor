<template>
  <menus-button
    ico="text-box"
    :text="t('insert.textBox')"
    huge
    @menu-click="editor?.chain().focus().setTextBox().run()"
  />
</template>

<script setup>
const { editor } = useStore()
</script>
