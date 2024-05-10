<template>
  <editor-menus-button
    huge-button
    shortcut="Shift+Enter"
    @button-click="editor?.chain().focus().setHardBreak().run()"
  >
    <icon name="hard-break" />
    <template #text>
      <p class="button-text">换行</p>
    </template>
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
</script>
