import { i18n } from '@/i18n'

export const useState = (key: string, editorKey: string) => {
  const { options } = useStore()
  const { id, title, content, enableMarkdown, enableSpellcheck } =
    options.value.document

  let data = null
  switch (key) {
    case 'toolbar':
      data = {
        mode: options.value.toolbar.defaultMode,
        show: true,
      }
      break
    case 'document':
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
    case 'locale':
      data = i18n.global.locale.value
      break
    default:
      throw new Error('[useStorage]', { cause: 'Key is not valid' })
  }
  return useStorage(
    `umo-editor:${editorKey || options.value.editorKey}:${key}`,
    data,
  )
}
