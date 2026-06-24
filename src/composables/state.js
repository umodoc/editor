export function useState(key, editorOptions) {
  const storageKey = `umo-editor:${editorOptions?.value?.editorKey || 'default'}:${key}`

  if (key === 'document') {
    return useStorage(storageKey, editorOptions?.value?.document)
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
      mode: editorOptions?.value?.toolbar?.defaultMode || 'classic',
      show: true,
    })
  }
  if (key === 'theme') {
    return useStorage(storageKey, 'light')
  }
  if (key === 'skin') {
    return useStorage(storageKey, 'default')
  }
  if (key === 'layout') {
    return useStorage(storageKey, 'page')
  }
  if (key === 'page') {
    const { dicts, page } = editorOptions.value
    return useStorage(storageKey, {
      ...page,
      size: dicts?.pageSizes.find((item) => item.default),
      margin: page.defaultMargin,
      background: page.defaultBackground,
      orientation: page.defaultOrientation,
      zoomLevel: 100,
      autoWidth: false,
      preview: {
        enabled: false,
        scale: 1,
        zoom: 100,
      },
    })
  }
  throw new Error('[useStorage]', { cause: 'Key is not valid' })
}
