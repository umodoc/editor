<template>
  <menus-button
    ico="node-delete"
    :text="t('insert.link.remove')"
    hide-text
    @menu-click="unsetLink"
  />
</template>

<script setup lang="ts">
const emits = defineEmits(['hide-bubble'])

const editor = inject('editor')

const unsetLink = () => {
  editor.value.commands.unsetLink()
  emits('hide-bubble')
}
</script>
