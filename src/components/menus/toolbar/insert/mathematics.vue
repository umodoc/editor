<template>
  <menus-button
    ico="mathematics"
    text="数学公式"
    huge
    @button-click="editor.chain().focus().insertContent('$\\LaTeX$').run()"
  />
</template>

<script setup>
const { editor } = useStore()
</script>
