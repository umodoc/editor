<template>
  <editor-menus-button
    huge-button
    :button-active="page.showBreakMarks"
    @button-click="toggleInvisibleCharacters"
  >
    <icon name="break-marks" />
    <template #text>
      <p class="button-text">显示换行</p>
    </template>
  </editor-menus-button>
</template>

<script setup>
const { page, editor } = useStore()

const toggleInvisibleCharacters = () => {
  page.value.showBreakMarks = !page.value.showBreakMarks
  if (page.value.showBreakMarks) {
    editor.value.commands.showInvisibleCharacters()
  } else {
    editor.value.commands.hideInvisibleCharacters()
  }
}
</script>
