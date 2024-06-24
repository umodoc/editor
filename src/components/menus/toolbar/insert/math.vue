<template>
  <menus-button
    ico="math"
    :text="t('insert.math')"
    huge
    @menu-click="editor.chain().focus().insertContent('$\\LaTeX$').run()"
  />
</template>

<script setup>
const { editor } = useStore()
</script>
