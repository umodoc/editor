<template>
  <editor-menus-button
    huge-button
    @button-click="editor.chain().focus().insertContent('$\\LaTeX$').run()"
  >
    <icon name="mathematics" />
    <template #text>
      <p class="button-text">数学公式</p>
    </template>
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
</script>
