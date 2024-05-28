export const useState = (key, editorKey) => {
  const { options } = useStore()
  let data = null
  switch (key) {
    case 'toolbar':
      data = {
        mode: options.value.toolbar.defaultMode,
        show: true,
      }
      break
    case 'document':
      const { id, title, content, enableMarkdown, enableSpellcheck } =
        options.value.document
      data = {
        id,
        title,
        content,
        markdown: enableMarkdown,
        spellcheck: enableSpellcheck,
      }
      break
    case 'recent':
      data = {
        fonts: [],
        colors: [],
      }
      break
    case 'print':
      data = {
        singleColumn: true,
        showPageNumber: true,
      }
      break
    default:
      console.error('[useStorage]', 'Key is not valid')
  }
  return useStorage(
    `umo-editor:${editorKey || options.value.editorKey}:${key}`,
    data,
  )
}
