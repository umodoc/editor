<template>
  <menus-button
    v-if="options.document?.enableMarkdown"
    :text="t('base.markdown.text')"
    ico="markdown"
    :tooltip="
      $document.enableMarkdown
        ? t('base.markdown.disable')
        : t('base.markdown.enable')
    "
    :menu-active="$document.enableMarkdown"
    huge
    @menu-click="toggleMarkdownMode"
  />
</template>

<script setup lang="ts">
const container = inject('container')
const destroyed = inject('destroyed')
const options = inject('options')
const $document = useState('document', options)

const toggleMarkdownMode = () => {
  const dialog = useConfirm({
    attach: container,
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
      destroyed.value = true
      await nextTick()
      destroyed.value = false
    },
  })
}
</script>
