import type { Mark } from '@tiptap/pm/model'
import type { Editor } from '@tiptap/vue-3'
import type { TableOfContentDataItem } from '@tiptap-pro/extension-table-of-contents'
import { isRecord } from '@tool-belt/type-predicates'

import { defaultOptions, ojbectSchema } from '@/options'
import type { PageOption, UmoEditorOptions } from '@/types'
import { shortId } from '@/utils/short-id'

export type TableOfContentItem = TableOfContentDataItem & { title: string }

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
  const bookmark = ref(true)
  const blockMenu = ref(false)
  const assistantBox = ref(false)
  const commentBox = ref(false)
  const tableOfContents = ref<TableOfContentItem[]>([])
  const imageViewer = ref({
    visible: false,
    current: null,
  })
  const searchReplace = ref(false)
  const savedAt = ref<number | null>(null)
  const printing = ref(false)
  const exportImage = ref(false)
  const exportPDF = ref(false)
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
    const $locale = useState('locale')
    if (!$locale.value) {
      $locale.value = options.value.locale
    }
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
    ({
      defaultBackground,
      defaultMargin,
      defaultOrientation,
      watermark,
      showBreakMarks,
    }: PageOption) => {
      page.value = {
        size: options.value.dicts?.pageSizes.find(
          (item: { default: boolean }) => item.default,
        ),
        margin: defaultMargin,
        background: defaultBackground,
        orientation: defaultOrientation,
        showBreakMarks,
        watermark,
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
    (val: boolean) => {
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
    bookmark,
    blockMenu,
    assistantBox,
    commentBox,
    tableOfContents,
    imageViewer,
    searchReplace,
    savedAt,
    printing,
    exportImage,
    exportPDF,
    editorDestroyed,
    setOptions,
    setEditor,
    setPainter,
    resetStore,
  }
})
