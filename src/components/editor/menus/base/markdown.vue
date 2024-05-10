<template>
  <editor-menus-button
    v-if="options.document.enableMarkdown"
    :tooltip="
      options.document.enableMarkdown
        ? '关闭 Markdown 模式'
        : '切换到 Markdown 模式'
    "
    :button-active="$document.markdown"
    huge-button
    @button-click="toggleMarkdownMode"
  >
    <icon name="markdown" />
    <template #text>
      <p class="button-text">Markdown</p>
    </template>
  </editor-menus-button>
</template>

<script setup>
const { options, editorDestroyed } = useStore()
const $document = useState('document')

const toggleMarkdownMode = () => {
  const dialog = useConfirm({
    theme: 'warning',
    header: $document.value.enableMarkdown
      ? '关闭 Markdown 模式'
      : '切换到 Markdown 模式',
    body: '此操作会重置编辑器，切换后当前历史记录会丢失，将无法进行“撤回”等操作，确定要现在切换吗？',
    confirmBtn: {
      theme: 'warning',
      content: '立即切换',
    },
    async onConfirm() {
      $document.value.markdown = !$document.value.markdown
      dialog.destroy()
      await nextTick()
      editorDestroyed.value = true
      await nextTick()
      editorDestroyed.value = false
    },
  })
}
</script>
