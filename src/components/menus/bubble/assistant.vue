<template>
  <menus-button
    ico="assistant"
    :text="t('assistant.text')"
    @menu-click="openAssistantBox"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { editor, assistantBox } = useStore()
const openAssistantBox = () => {
  assistantBox.value = true
  editor.value.commands.focus()
}
</script>

<style lang="less" scoped></style>
