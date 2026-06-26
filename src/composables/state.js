export function useState(key, editorOptions) {
  const options = editorOptions.value
  const storageKey = `umo-editor:${options.editorKey || 'default'}:${key}`

  if (key === 'document') {
    return useStorage(storageKey, options.document)
  }
  if (key === 'recent') {
    return useStorage(storageKey, {
      fonts: [],
      colors: [],
      downloadedFonts: [],
    })
  }
  if (key === 'toolbar') {
    return useStorage(storageKey, {
      mode: options.toolbar.defaultMode || 'classic',
      show: options.toolbar.defaultShow || true,
    })
  }
  if (key === 'theme') {
    return useStorage(storageKey, options.theme || 'light')
  }
  if (key === 'skin') {
    return useStorage(storageKey, options.skin || 'default')
  }
  if (key === 'layout') {
    return useStorage(storageKey, options.page.layouts[0] || 'page')
  }
  throw new Error('[useStorage]', { cause: 'Key is not valid' })
}
