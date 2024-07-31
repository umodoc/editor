import { defaultOptions, ojbectSchema } from '@/options'
import shortId from '@/utils/short-id'

export const useStore = createGlobalState(() => {
  const toolbarKey = ref(shortId())
  const options = ref(defaultOptions)
  const page = ref({})
  const editor = ref(null)
  const assistant = ref(false)
  const tableOfContents = ref([])
  const imagePreview = ref(false)
  const searchReplace = ref(false)
  const savedAt = ref(null)
  const printing = ref(false)
  const editorDestroyed = ref(false)

  const setOptions = (value) => {
    const opts = value?.value || value
    options.value = ojbectSchema.merge(
      options.value,
      Object.keys(opts).reduce((acc, key) => {
        if (opts[key] !== undefined) {
          acc[key] = opts[key]
        }
        return acc
      }, {}),
    )
    return options.value
  }

  watch(
    () => options.value.page,
    ({
      defaultBackground,
      defaultMargin,
      defaultOrientation,
      watermark,
      showBreakMarks,
    }) => {
      page.value = {
        size: options.value.dicts.pageSizes.find((item) => item.default),
        margin: defaultMargin,
        background: defaultBackground,
        orientation: defaultOrientation,
        watermark: watermark,
        showBreakMarks: showBreakMarks,
        showLineNumber: false,
        showToc: false,
        zoomLevel: 100,
        autoWidth: false,
        preview: {
          enabled: false,
          laserPointer: true,
        },
      }
    },
    { immediate: true, once: true },
  )

  const setEditor = (Editor) => (editor.value = Editor)
  const resetStore = () => {
    editor.value = null
    tableOfContents.value = []
    searchReplace.value = false
    savedAt.value = null
    editorDestroyed.value = true
  }

  watch(
    () => options.value.document.readOnly,
    async (val) => {
      editor.value.setEditable(!val)
      toolbarKey.value = shortId()
    },
  )

  return {
    toolbarKey,
    container: `#umo-editor-${shortId(4)}`,
    options,
    page,
    editor,
    assistant,
    tableOfContents,
    imagePreview,
    searchReplace,
    savedAt,
    printing,
    editorDestroyed,
    setOptions,
    setEditor,
    resetStore,
  }
})
