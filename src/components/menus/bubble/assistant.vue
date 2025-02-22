<template>
  <menus-button
    ico="assistant"
    :text="t('assistant.text')"
    @menu-click="openAssistant"
  />
</template>

<script setup lang="ts">
const editor = inject('editor')
const assistant = inject('assistant')
const openAssistant = () => {
  assistant.value = true
  editor.value?.commands.focus()
}
</script>

<style lang="less" scoped></style>
