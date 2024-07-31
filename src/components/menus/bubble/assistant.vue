<template>
  <menus-button
    ico="assistant"
    :text="t('assistant.text')"
    @menu-click="openAssistant"
  />
</template>

<script setup>
const { editor, assistant } = useStore()
const openAssistant = () => {
  assistant.value = true
  editor.value.commands.focus()
}
</script>

<style lang="less" scoped></style>
