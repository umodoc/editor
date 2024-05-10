<template>
  <editor-menus-button
    tooltip="增加缩进"
    shortcut="Tab"
    @button-click="editor?.chain().focus().indent().run()"
  >
    <icon name="indent" />
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
</script>
