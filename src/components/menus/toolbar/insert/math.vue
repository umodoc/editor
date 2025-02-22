<template>
  <menus-button
    ico="math"
    :text="t('insert.math')"
    huge
    @menu-click="editor?.chain().focus().insertContent('$\\LaTeX$').run()"
  />
</template>

<script setup lang="ts">
const editor = inject('editor')
</script>
