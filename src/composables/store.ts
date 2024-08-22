import { defaultOptions, ojbectSchema } from '@/options'
import shortId from '@/utils/short-id'
import { changeComputedHtml } from '@/extensions/page/core'
import { Editor } from '@tiptap/vue-3'
export const useStore = createGlobalState(() => {
  const toolbarKey = ref<string>(shortId())
  const options = ref<any>(defaultOptions)
  const page = ref<any>({})
  const editor = ref<any>()
  const painter = ref<any>({
    enabled: false,
    once: true,
    marks: [],
  })
  const blockMenu = ref(false)
  const assistantBox = ref(false)
  const commentBox = ref(false)
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

  const setOptions = (value:any) => {
    const opts = value?.value || value
    options.value = ojbectSchema.merge(
      options.value,
      Object.keys(opts).reduce((acc:any, key) => {
        if (opts[key] !== undefined) {
          acc[key] = opts[key]
        }
        return acc
      }, {}),
    )
    return options.value
  }
//@ts-ignore
  const setPainter = ({ enabled, once, marks }) => {
    painter.value.enabled = enabled
    painter.value.once = once
    painter.value.marks = marks
  }

  watch(
    () => options.value.page,
    ({ defaultBackground, defaultMargin, defaultOrientation, watermark }) => {
      page.value = {
        size: options.value.dicts.pageSizes.find((item:any) => item.default),
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
      editor.value?.commands.autoPaging(false)
      changeComputedHtml()
      setTimeout(() => {
        editor.value?.commands.autoPaging(true)
      }, 1000)
    },
    { deep: true },
  )

  const setEditor = (editorInstance:Editor) => (editor.value = editorInstance)
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
    commentBox,
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
