import type { Mark } from '@tiptap/pm/model'
import type { Editor } from '@tiptap/vue-3'
import { isRecord } from '@tool-belt/type-predicates'

import { changeComputedHtml } from '@/extensions/page/core'
import { defaultOptions, ojbectSchema } from '@/options'
import type { PageOption, UmoEditorOptions } from '@/types'
import shortId from '@/utils/short-id'

export const useStore = createGlobalState(() => {
  const toolbarKey = ref<string>(shortId())
  const options = ref<UmoEditorOptions>(defaultOptions)
  const page = ref<PageOption>(defaultOptions.page)
  const editor = ref<Editor>()
  const painter = ref<{
    enabled: boolean
    once: boolean
    marks: Mark[]
  }>({
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

  const setOptions = (value: unknown) => {
    const opts =
      isRecord(value) && Object.keys(value).includes('value')
        ? value.value
        : value

    options.value = ojbectSchema.merge(
      options.value,
      Object.keys(opts).reduce<Record<string, unknown>>(
        (acc: Record<string, unknown>, key: string) => {
          if (opts[key] !== undefined) {
            acc[key] = opts[key]
          }
          return acc
        },
        {},
      ),
    )
    return options.value
  }

  const setPainter = ({
    enabled,
    once,
    marks,
  }: {
    enabled: boolean
    once: boolean
    marks: Mark[]
  }) => {
    painter.value.enabled = enabled
    painter.value.once = once
    painter.value.marks = marks
  }

  watch(
    () => options.value.page,
    ({ defaultBackground, defaultMargin, defaultOrientation, watermark }) => {
      page.value = {
        size: options.value.dicts?.pageSizes.find((item) => item.default),
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
    () => {
      editor.value?.commands.autoPaging(false)
      changeComputedHtml()
      setTimeout(() => {
        editor.value?.commands.autoPaging(true)
      }, 1000)
    },
    { deep: true },
  )

  const setEditor = (editorInstance: Editor) => {
    editor.value = editorInstance
  }
  const resetStore = () => {
    editor.value = undefined
    tableOfContents.value = []
    searchReplace.value = false
    savedAt.value = null
    editorDestroyed.value = true
  }

  watch(
    () => options.value.document?.readOnly,
    (val) => {
      editor.value?.setEditable(!val)
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
