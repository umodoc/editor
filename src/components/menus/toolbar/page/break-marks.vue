<template>
  <menus-button
    ico="break-marks"
    text="显示换行"
    huge
    :menu-active="page.showBreakMarks"
    @menu-click="toggleInvisibleCharacters"
  />
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
