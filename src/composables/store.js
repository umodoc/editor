import { defaultOptions, ojbectSchema } from '@/options'
import shortId from '@/utils/short-id'
import { changeComputedHtml } from '@/extensions/page/core'

export const useStore = createGlobalState(() => {
  const toolbarKey = ref(shortId())
  const options = ref(defaultOptions)
  const page = ref({})
  const editor = ref(null)
  const painter = ref({
    enabled: false,
    once: true,
    marks: [],
  })
  const blockMenu = ref(false)
  const assistantBox = ref(false)
  const tableOfContents = ref([])
  const imagePreview = ref(false)
  const searchReplace = ref(false)
  const savedAt = ref(null)
  const printing = ref(false)
  const exportImage = ref(false)
  const exportPDF = ref(false)
  const hidePageHeader = ref(true)
  const hidePageFooter = ref(true)
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

  const setPainter = ({ enabled, once, marks }) => {
    painter.value.enabled = enabled
    painter.value.once = once
    painter.value.marks = marks
  }

  watch(
    () => options.value.page,
    ({ defaultBackground, defaultMargin, defaultOrientation, watermark }) => {
      page.value = {
        size: options.value.dicts.pageSizes.find((item) => item.default),
        margin: defaultMargin,
        background: defaultBackground,
        orientation: defaultOrientation,
        watermark,
        header: true,
        footer: true,
        showLineNumber: false,
        showToc: false,
        pagination: true,
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

  watch(
    () => [page.value.size, page.value.margin, page.value.orientation],
    (value) => {
      editor.value.commands.autoPaging(false)
      changeComputedHtml()
      setTimeout(() => {
        editor.value.commands.autoPaging()
      }, 1000)
    },
    { deep: true },
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
    painter,
    blockMenu,
    assistantBox,
    tableOfContents,
    imagePreview,
    searchReplace,
    savedAt,
    printing,
    exportImage,
    exportPDF,
    hidePageHeader,
    hidePageFooter,
    editorDestroyed,
    setOptions,
    setEditor,
    setPainter,
    resetStore,
  }
})
