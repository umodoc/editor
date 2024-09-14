<template>
  <menus-button
    v-if="options.document?.enableMarkdown"
    :text="t('base.markdown.text')"
    ico="markdown"
    :tooltip="
      options.document?.enableMarkdown
        ? t('base.markdown.disable')
        : t('base.markdown.enable')
    "
    :menu-active="$document.enableMarkdown"
    huge
    @menu-click="toggleMarkdownMode"
  />
</template>

<script setup lang="ts">
const { options, editorDestroyed } = useStore()
const $document = useState('document')

const toggleMarkdownMode = () => {
  const dialog = useConfirm({
    theme: 'warning',
    header: $document.value.enableMarkdown
      ? t('base.markdown.disable')
      : t('base.markdown.enable'),
    body: t('base.markdown.message'),
    confirmBtn: {
      theme: 'warning',
      content: t('base.markdown.toggle'),
    },
    async onConfirm() {
      $document.value.enableMarkdown = !$document.value.enableMarkdown
      dialog.destroy()
      await nextTick()
      editorDestroyed.value = true
      await nextTick()
      editorDestroyed.value = false
    },
  })
}
</script>
