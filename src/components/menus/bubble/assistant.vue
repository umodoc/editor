<template>
  <menus-button
    ico="assistant"
    :text="t('assistant.text')"
    @menu-click="openAssistantBox"
  />
</template>

<script setup lang="ts">
const { editor, assistantBox } = useStore()
const openAssistantBox = () => {
  assistantBox.value = true
  editor.value?.commands.focus()
}
</script>

<style lang="less" scoped></style>
