<template>
  <menus-button
    ico="copy"
    :text="t('insert.link.copy')"
    hide-text
    @menu-click="copyLink"
  />
</template>

<script setup lang="ts">
const emits = defineEmits(['hide-bubble'])

const container = inject('container')
const editor = inject('editor')

const copyLink = () => {
  const { meta } = editor.value.storage.link
  const { copy } = useClipboard({
    source: ref(meta.href),
  })
  void copy()
  useMessage('success', {
    attach: container,
    content: t('insert.link.copySuccess'),
  })
  emits('hide-bubble')
}
</script>
