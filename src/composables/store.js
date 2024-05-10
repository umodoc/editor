import { defaultOptions, ojbectSchema } from '@/components/options'
import generateId from '@/utils/generate-id'

export const useStore = createGlobalState(() => {
  const toolbarKey = ref(generateId())
  const options = ref(defaultOptions)
  const page = ref({})
  const editor = ref(null)
  const tableOfContents = ref([])
  const imagePreview = ref(false)
  const searchReplace = ref(false)
  const savedAt = ref(null)
  const editorDestroyed = ref(false)

  const setOptions = (value) => {
    const opts = value?.value || value
    options.value = ojbectSchema.merge(
      options.value,
      Object.keys(opts).reduce((acc, key) => {
        if (opts[key] !== undefined) acc[key] = opts[key]
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
      toolbarKey.value = generateId()
    },
  )

  return {
    toolbarKey,
    container: `#umo-editor-${generateId(4)}`,
    options,
    page,
    editor,
    tableOfContents,
    imagePreview,
    searchReplace,
    savedAt,
    editorDestroyed,
    setOptions,
    setEditor,
    resetStore,
  }
})
