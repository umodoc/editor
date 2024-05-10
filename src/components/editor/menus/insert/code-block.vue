<template>
  <editor-menus-button
    shortcut="Ctrl+Alt+C"
    huge-button
    @button-click="editor.chain().focus().setCodeBlock().run()"
  >
    <icon name="code-block" />
    <template #text>
      <p class="button-text">代码块</p>
    </template>
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
</script>
