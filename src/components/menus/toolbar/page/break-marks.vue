<template>
  <menus-button
    ico="break-marks"
    :text="t('page.breakMarks')"
    huge
    :menu-active="page.showBreakMarks"
    @menu-click="toggleInvisibleCharacters"
  />
</template>

<script setup lang="ts">
const editor = inject('editor')
const page = inject('page')

const toggleInvisibleCharacters = () => {
  page.value.showBreakMarks = !page.value.showBreakMarks
  if (page.value.showBreakMarks) {
    editor.value.commands.showInvisibleCharacters()
  } else {
    editor.value.commands.hideInvisibleCharacters()
  }
}
</script>
