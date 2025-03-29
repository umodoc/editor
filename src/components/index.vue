<template>
  <t-config-provider
    :key="options.editorKey"
    :global-config="{
      ...localeConfig[locale],
      classPrefix: 'umo',
    }"
  >
    <div
      :id="container.substr(1)"
      class="umo-editor-container"
      :class="{
        'toolbar-classic': isRecord($toolbar) && $toolbar.mode === 'classic',
        'toolbar-ribbon': isRecord($toolbar) && $toolbar.mode === 'ribbon',
        'preview-mode': page.preview?.enabled,
        'laser-pointer': page.preview?.enabled && page.preview?.laserPointer,
        'umo-editor-is-fullscreen': fullscreen,
      }"
      :style="{
        height: options.height,
        zIndex: fullscreen ? options.fullscreenZIndex : 'unset',
      }"
    >
      <header class="umo-toolbar">
        <toolbar
          :key="toolbarKey"
          @menu-change="(event: any) => emits('menuChange', event)"
        >
          <template
            v-for="item in options.toolbar?.menus"
            :key="item"
            #[`toolbar_${item}`]="slotProps"
          >
            <slot :name="`toolbar_${item}`" v-bind="slotProps" />
          </template>
        </toolbar>
      </header>
      <main class="umo-main">
        <container-page>
          <template #bubble_menu="slotProps">
            <slot name="bubble_menu" v-bind="slotProps" />
          </template>
        </container-page>
      </main>
      <footer class="umo-footer">
        <statusbar />
      </footer>
    </div>
  </t-config-provider>
</template>

<script setup lang="ts">
import type { FocusPosition } from '@tiptap/core'
import {
  isBoolean,
  isNumber,
  isRecord,
  isString,
} from '@tool-belt/type-predicates'
import domToImage from 'dom-to-image-more'
import type {
  DialogOptions,
  GlobalConfigProvider,
  MessageOptions,
} from 'tdesign-vue-next'
import enConfig from 'tdesign-vue-next/esm/locale/en_US'
import cnConfig from 'tdesign-vue-next/esm/locale/zh_CN'

import { getSelectionNode, getSelectionText } from '@/extensions/selection'
import { i18n } from '@/i18n'
import { propsOptions } from '@/options'
import type { PageOption, UmoEditorOptions } from '@/types'
import type {
  AutoSaveOptions,
  DocumentOptions,
  SupportedLocale,
  WatermarkOption,
} from '@/types'
import { consoleCopyright } from '@/utils/copyright'
import { getOpitons } from '@/utils/options'
import { shortId } from '@/utils/short-id'

import ruConfig from '../locales/tdesign/ru-RU'

const { toBlob, toJpeg, toPng } = domToImage

import { setTypeWriter } from '@/extensions/type-writer'

defineOptions({ name: 'UmoEditor' })

// Props and Emits
const props = defineProps(propsOptions)
const emits = defineEmits([
  'beforeCreate',
  'created',
  'changed',
  'changed:selection',
  'changed:transaction',
  'changed:menu',
  'changed:toolbar',
  'changed:pageSize',
  'changed:pageOrientation',
  'changed:pageMargin',
  'changed:pageBackground',
  'changed:pageShowToc',
  'changed:pagePreview',
  'changed:pageZoom',
  'changed:pageWatermark',
  'changed:locale',
  'changed:theme',
  'contentError',
  'print',
  'focus',
  'blur',
  'saved',
  'destroy',
  'menuChange',
])

// state Setup
const container = $ref(`#umo-editor-${shortId(4)}`)
const defaultOptions = inject('defaultOptions', {})
const options = ref(getOpitons(props, defaultOptions))
const editor = ref(null)
const savedAt = ref(null)
const page = ref({})
const blockMenu = ref(false)
const assistant = ref(false)
const imageViewer = ref({ visible: false, current: null })
const searchReplace = ref(false)
const printing = ref(false)
const fullscreen = ref(false)
const exportFile = ref({ pdf: false, image: false })
const uploadFileMap = ref(new Map())
// const bookmark = ref(false)
const destroyed = ref(false)
provide('container', container)
provide('options', options)
provide('editor', editor)
provide('savedAt', savedAt)
provide('page', page)
provide('blockMenu', blockMenu)
provide('assistant', assistant)
provide('imageViewer', imageViewer)
provide('searchReplace', searchReplace)
provide('printing', printing)
provide('fullscreen', fullscreen)
provide('exportFile', exportFile)
provide('uploadFileMap', uploadFileMap)
// provide('bookmark', bookmark)
provide('destroyed', destroyed)

watch(
  () => options.value.page,
  ({
    defaultBackground,
    defaultMargin,
    defaultOrientation,
    watermark,
    showBreakMarks,
    showBookmark,
  }: PageOption) => {
    page.value = {
      size: options.value.dicts?.pageSizes.find(
        (item: { default: boolean }) => item.default,
      ),
      margin: defaultMargin,
      background: defaultBackground,
      orientation: defaultOrientation,
      watermark,
      showBreakMarks,
      showBookmark,
      showLineNumber: false,
      showToc: false,
      zoomLevel: 100,
      autoWidth: false,
      preview: {
        enabled: false,
        scale: 1,
        zoom: 100,
      },
    }
    if (showBreakMarks) {
      editor.value?.commands.showInvisibleCharacters()
    } else {
      editor.value?.commands.hideInvisibleCharacters()
    }
  },
  { immediate: true, deep: true },
)
watch(
  () => options.value.document?.readOnly,
  (val: boolean) => {
    editor.value?.setEditable(!val)
  },
)

const $toolbar = useState('toolbar', options)
const $document = useState('document', options)

let toolbarKey = $ref(shortId())
watch(
  () => [options.value.document?.readOnly, editor.value?.isEditable],
  () => {
    toolbarKey = shortId()
  },
)

// Lifecycle Hooks
onMounted(() => {
  setTheme(options.value.theme)
  setTimeout(consoleCopyright)
})
onBeforeUnmount(() => {
  clearAutoSaveInterval()
  destroy()
})

// Watchers
watch(
  () => props,
  () => setOptions(props),
  { deep: true },
)

watch(
  () => options.value.theme,
  (theme: 'light' | 'dark' | 'auto') => {
    setTheme(theme)
  },
)

watch(
  () => options.value.document,
  (val: any) => {
    $document.value = val
  },
)

// 定时保存
let contentUpdated = $ref(false)
let isFirstUpdate = $ref(true)
let autoSaveInterval = $ref<NodeJS.Timeout | null>(null)
const clearAutoSaveInterval = () => {
  if (autoSaveInterval !== null) {
    clearInterval(autoSaveInterval)
    autoSaveInterval = null
  }
}
watch(
  () => contentUpdated,
  (val: boolean) => {
    const { autoSave } = options.value.document ?? {}
    if (!autoSave?.enabled) {
      return
    }
    if (isFirstUpdate) {
      isFirstUpdate = false
      setTimeout(() => {
        contentUpdated = false
      })
      return
    }
    if (!val) {
      clearAutoSaveInterval()
      return
    }
    autoSaveInterval = setInterval(() => {
      void saveContent()
      contentUpdated = false
      clearAutoSaveInterval()
    }, autoSave.interval)
  },
)

watch(
  () => editor.value,
  () => {
    if (!editor.value) {
      return
    }
    editor.value.on('create', ({ editor }: any) => {
      destroyed.value = false
      emits('created', { editor })
    })
    editor.value.on('update', ({ editor }: any) => {
      emits('changed', { editor })
      contentUpdated = true
    })
    editor.value.on('selectionUpdate', ({ editor }: any) => {
      emits('changed:selection', { editor })
    })
    editor.value.on('transaction', ({ editor, transaction }: any) => {
      emits('changed:transaction', { editor, transaction })
    })
    editor.value.on('focus', ({ editor, event }: any) => {
      emits('focus', { editor, event })
    })
    editor.value.on(
      'contentError',
      ({ editor, error, disableCollaboration }: any) => {
        emits('contentError', { editor, error, disableCollaboration })
      },
    )
    editor.value.on('blur', ({ editor, event }: any) => {
      emits('blur', { editor, event })
    })
    editor.value.on('destroy', () => {
      emits('destroy')
    })
  },
)

watch(
  () => $toolbar.value,
  (toolbar: any, oldToolbar: any) => {
    emits('changed:toolbar', { toolbar, oldToolbar })
  },
  { deep: true },
)

watch(
  () => page.value.size,
  (pageSize: any, oldPageSize: any) => {
    emits('changed:pageSize', { pageSize, oldPageSize })
  },
  { deep: true },
)

watch(
  () => page.value.margin,
  (pageMargin: any, oldPageMargin: any) => {
    emits('changed:pageMargin', { pageMargin, oldPageMargin })
  },
  { deep: true },
)

watch(
  () => page.value.background,
  (pageBackground: string, oldPageBackground: string) => {
    emits('changed:pageBackground', { pageBackground, oldPageBackground })
  },
)

watch(
  () => page.value.orientation,
  (pageOrientation: string, oldPageOrientation: string) => {
    emits('changed:pageOrientation', { pageOrientation, oldPageOrientation })
  },
)

watch(
  () => page.value.showToc,
  (showToc: boolean) => {
    emits('changed:pageShowToc', showToc)
  },
)

watch(
  () => page.value.zoomLevel,
  (zoomLevel: number, oldZoomLevel: number) => {
    emits('changed:pageZoom', { zoomLevel, oldZoomLevel })
  },
)

watch(
  () => page.value.preview?.enabled,
  (previewEnabled: boolean) => {
    emits('changed:pagePreview', previewEnabled)
  },
)

watch(
  () => page.value.watermark,
  (pageWatermark: any, oldPageWatermark: any) => {
    emits('changed:pageWatermark', { pageWatermark, oldPageWatermark })
  },
  { deep: true },
)

watch(
  () => printing.value,
  () => {
    emits('print')
  },
  { deep: true },
)

// i18n Setup
// @ts-ignore
const { t, locale, mergeLocaleMessage } = useI18n()
const $locale = useStorage('umo-editor:locale', options.value.locale)
locale.value = $locale.value
const getLocaleMessage = (lang: SupportedLocale) => {
  const translations = options.value.translations?.[lang.replaceAll('-', '_')]
  if (isRecord(translations)) {
    return translations
  }
  return {}
}
mergeLocaleMessage(locale.value, getLocaleMessage(locale.value))
const { appContext } = getCurrentInstance() ?? {}
if (appContext) {
  appContext.config.globalProperties.t = t
  appContext.config.globalProperties.l = l
}
watch(
  () => locale.value,
  (locale: any, oldLocale: any) => {
    emits('changed:locale', { locale, oldLocale })
  },
)

// Global Locale Config
const localeConfig = $ref<Record<string, GlobalConfigProvider>>({
  'zh-CN': cnConfig as unknown as GlobalConfigProvider,
  'en-US': enConfig as unknown as GlobalConfigProvider,
  'ru-RU': ruConfig as unknown as GlobalConfigProvider,
})

// Options Setup
const setOptions = (value: UmoEditorOptions) => {
  options.value = getOpitons(value)
  const $locale = useStorage('umo-editor:locale', options.value.locale)
  if (!$locale.value) {
    $locale.value = options.value.locale
  }
  return options.value
}

// Theme Setup
const setTheme = (theme: 'light' | 'dark' | 'auto') => {
  if (!isString(theme) || !['light', 'dark', 'auto'].includes(theme)) {
    throw new Error('"theme" must be one of "light", "dark" or "auto".')
  }
  if (theme !== 'auto') {
    document.querySelector('html')?.setAttribute('theme-mode', theme)
    emits('changed:theme', theme)
    return
  }
  const darkScheme = '(prefers-color-scheme: dark)'
  const prefersDarkScheme = window.matchMedia(darkScheme).matches
  setTheme(prefersDarkScheme ? 'dark' : 'light')
  window.matchMedia(darkScheme).addEventListener('change', (e) => {
    setTheme(e.matches ? 'dark' : 'light')
  })
}

// Toolbar and Page Setup Methods
const setToolbar = (params: { mode: 'classic' | 'ribbon'; show: boolean }) => {
  if (!isRecord(params)) {
    throw new Error('params must be an object.')
  }
  if (params.mode) {
    if (!isString(params.mode)) {
      throw new Error('"params.mode" must be a string.')
    }
    if (!['classic', 'ribbon'].includes(params.mode)) {
      throw new Error('"params.mode" must be one of "classic" or "ribbon".')
    }
    $toolbar.value.mode = params.mode
  }
  if (isDefined(params.show)) {
    if (!isBoolean(params.show)) {
      throw new Error('"params.show" must be a boolean.')
    }
    $toolbar.value.show = params.show
  }
}

const setPage = (params: {
  size: string
  orientation: string
  background: string
}) => {
  if (!isRecord(params)) {
    throw new Error('params must be an object.')
  }
  if (params.size) {
    if (!isString(params.size)) {
      throw new Error('"params.size" must be a string.')
    }
    const size = options.value.dicts?.pageSizes.find(
      (item: any) => item.label === params.size,
    )
    if (!size) {
      throw new Error(
        `"params.size" must be one of ${options.value.dicts?.pageSizes.map((item: any) => item.label)}.`,
      )
    }
    page.value.size = size
  }
  if (params.orientation) {
    if (!isString(params.orientation)) {
      throw new Error('"params.orientation" must be a string.')
    }
    if (!['portrait', 'landscape'].includes(params.orientation)) {
      throw new Error(
        '"params.orientation" must be one of "portrait" or "landscape".',
      )
    }
    page.value.orientation = params.orientation
  }

  if (params.background) {
    if (!isString(params.background)) {
      throw new Error('"params.background" must be a string.')
    }
    page.value.background = params.background
  }
}

const setWatermark = (params: Partial<WatermarkOption>) => {
  if (!isRecord(params)) {
    throw new Error('params must be an object.')
  }
  if (!page.value.watermark) {
    page.value.watermark = {} as WatermarkOption
  }
  if (isDefined(params.alpha)) {
    if (!isNumber(params.alpha)) {
      throw new Error('"params.alpha" must be a number.')
    }
    page.value.watermark.alpha = params.alpha
  }
  if (params.text) {
    if (!isString(params.text)) {
      throw new Error('"params.text" must be a string.')
    }
    if (params.text.length > 30) {
      throw new Error('"params.text" must be less than 30 characters.')
    }
    page.value.watermark.text = params.text
  }

  if (params.type) {
    if (!isString(params.type)) {
      throw new Error('"params.type" must be a string.')
    }
    if (!['compact', 'spacious'].includes(params.type)) {
      throw new Error('"params.type" must be one of "compact" or "spacious".')
    }
    page.value.watermark.type = params.type
  }
  if (params.fontColor) {
    if (!isString(params.fontColor)) {
      throw new Error('"params.fontColor" must be a string.')
    }
    page.value.watermark.fontColor = params.fontColor
  }
  if (params.fontSize) {
    if (!isNumber(params.fontSize)) {
      throw new Error('"params.fontSize" must be a number.')
    }
    page.value.watermark.fontSize = params.fontSize
  }
  if (params.fontFamily || params.fontFamily === null) {
    if (params.fontFamily !== null && !isString(params.fontFamily)) {
      throw new Error('"params.fontFamily" must be a string.')
    }
    page.value.watermark.fontFamily = params.fontFamily
  }
  if (params.fontWeight) {
    if (!isString(params.fontWeight)) {
      throw new Error('"params.fontWeight" must be a string.')
    }
    if (!['normal', 'bold', 'bolder'].includes(params.fontWeight)) {
      throw new Error(
        '"params.fontWeight" must be one of "normal", "bold" or "bolder".',
      )
    }
    page.value.watermark.fontWeight = params.fontWeight
  }
}

const setDocument = (params: DocumentOptions) => {
  if (!isRecord(params)) {
    throw new Error('params must be an object.')
  }
  if (!options.value.document) {
    options.value.document = {} as DocumentOptions
  }
  if (params.title) {
    if (!isString(params.title)) {
      throw new Error('"params.title" must be a string.')
    }
    const title = params.title !== '' ? params.title : t('document.untitled')
    $document.value.title = title
    options.value.document.title = title
  }
  if (isDefined(params.enableBubbleMenu)) {
    if (!isBoolean(params.enableBubbleMenu)) {
      throw new Error('"params.enableBubbleMenu" must be a boolean.')
    }
    options.value.document.enableBubbleMenu = params.enableBubbleMenu
  }
  if (isDefined(params.enableBlockMenu)) {
    if (!isBoolean(params.enableBlockMenu)) {
      throw new Error('"params.enableBlockMenu" must be a boolean.')
    }
    options.value.document.enableBlockMenu = params.enableBlockMenu
  }
  if (isDefined(params.enableMarkdown)) {
    if (!isBoolean(params.enableMarkdown)) {
      throw new Error('"params.enableMarkdown" must be a boolean.')
    }
    $document.value.enableMarkdown = params.enableMarkdown
  }
  if (isDefined(params.enableSpellcheck)) {
    if (!isBoolean(params.enableSpellcheck)) {
      throw new Error('"params.spellcheck" must be a boolean.')
    }
    $document.value.enableSpellcheck = params.enableSpellcheck
  }
  if (params.autoSave) {
    if (!isBoolean(params.autoSave.enabled)) {
      throw new Error('"params.autoSave.enabled" must be a boolean.')
    }
    if (!isNumber(params.autoSave.interval)) {
      throw new Error('"params.autoSave.interval" must be a number.')
    }

    options.value.document ??= {} as DocumentOptions
    options.value.document.autoSave ??= {} as AutoSaveOptions
    options.value.document.autoSave.enabled = params.autoSave.enabled
    options.value.document.autoSave.interval = params.autoSave.interval
  }
}

// Content Methods
const setContent = (
  content: string,
  options = {
    emitUpdate: true,
    focusPosition: 'start',
    focusOptions: { scrollIntoView: true },
  },
) => {
  if (!editor.value) {
    throw new Error('editor is not ready!')
  }
  editor.value
    .chain()
    .setContent(content, options.emitUpdate)
    .focus(options.focusPosition as FocusPosition, options.focusOptions)
    .run()
}

// Content Methods
const insertContent = (
  content: string,
  options = {
    updateSelection: true,
    focusPosition: 'start',
    focusOptions: { scrollIntoView: true },
  },
) => {
  if (!editor.value) {
    throw new Error('editor is not ready!')
  }
  editor.value
    .chain()
    .insertContent(content, { updateSelection: options.updateSelection })
    .focus(options.focusPosition as FocusPosition, options.focusOptions)
    .run()
}

const setContentTypeWriter = (
  content: object,
  options = {
    timerCount: 1,
    state: 0, //0 初始  1刷新  2 停止 3 重新开始 4 清空打字机
  },
) => {
  if (!editor.value) {
    throw new Error('editor is not ready!')
  }
  if (typeof content !== 'object') {
    throw new Error('content is not object!')
  }
  setTypeWriter(editor, content, options)
}

const getContent = (format = 'html') => {
  if (!editor.value) {
    throw new Error('editor is not ready!')
  }
  if (format === 'html') {
    return editor.value.getHTML()
  }
  if (format === 'text') {
    return editor.value.getText()
  }
  if (format === 'json') {
    return editor.value.getJSON()
  }
  throw new Error('format must be html, text or json')
}

// Locale Methods
const setLocale = (params: SupportedLocale) => {
  if (!['zh-CN', 'en-US', 'ru-RU'].includes(params)) {
    throw new Error('"params" must be one of "zh-CN", "en-US" or "ru-RU".')
  }
  if (locale.value === params) {
    return
  }
  $locale.value = params
  location.reload()
}

const getLocale = () => locale.value
const getI18n = () => i18n

// Export Methods
const getImage = async (format: 'blob' | 'jpeg' | 'png' = 'blob') => {
  const { zoomLevel } = page.value
  try {
    page.value.zoomLevel = 100
    const node = document.querySelector(
      `${container} .umo-page-content`,
    ) as HTMLElement
    if (format === 'blob') {
      return await toBlob(node)
    }
    if (format === 'jpeg') {
      return await toJpeg(node)
    }
    if (format === 'png') {
      return await toPng(node)
    }
  } catch {
    throw new Error(t('export.image.error.message'))
  } finally {
    page.value.zoomLevel = zoomLevel
  }
}

// Editor Interaction Methods
const getText = () => getContent('text')
const getHTML = () => getContent('html')
const getJSON = () => getContent('json')

const focus = (position = 'start', options = { scrollIntoView: true }) =>
  editor.value?.commands.focus(position as FocusPosition, options)

const blur = () => editor.value?.chain().blur().run()

const print = () => {
  const { toolbar, document } = options.value
  if (toolbar?.disableMenuItems.includes('print') || editor.value?.isEmpty) {
    return
  }
  if (!document?.readOnly) {
    printing.value = true
  }
}

const toggleFullscreen = (isFullscreen?: boolean) => {
  if (isFullscreen !== undefined) {
    if (!isBoolean(isFullscreen)) {
      throw new Error('"isFullscreen" must be a boolean.')
    }
    fullscreen.value = isFullscreen
    return
  }
  fullscreen.value = !fullscreen.value
}

const reset = (silent: boolean) => {
  const resetFn = () => {
    localStorage.clear()
    location.reload()
  }
  if (silent) {
    resetFn()
    return
  }
  const dialog = useConfirm({
    attach: container,
    theme: 'warning',
    header: t('resetAll.title'),
    body: t('resetAll.message'),
    confirmBtn: {
      theme: 'warning',
      content: t('resetAll.reset'),
    },
    onConfirm() {
      dialog.destroy()
      resetFn()
    },
  })
}

const destroy = () => {
  editor.value?.destroy()
  removeAllHotkeys()
  destroyed.value = true
}

// Content Saving Methods
const saveContent = async (showMessage = true) => {
  if (options.value.document?.readOnly) {
    return
  }
  try {
    useMessage('loading', {
      attach: container,
      content: t('save.saving'),
      placement: 'bottom',
      closeBtn: true,
      offset: [0, -20],
    })
    const success = await options.value?.onSave?.(
      {
        html: editor.value?.getHTML(),
        json: editor.value?.getJSON(),
        text: editor.value?.getText(),
      },
      page.value,
      $document.value,
    )
    if (!success) {
      MessagePlugin.closeAll()
      useMessage('error', {
        attach: container,
        content: t('save.failed'),
        placement: 'bottom',
        offset: [0, -20],
      })
      return
    }
    emits('saved')
    if (showMessage) {
      MessagePlugin.closeAll()
      useMessage('success', {
        attach: container,
        content:
          success === false || success === true ? t('save.success') : success,
        placement: 'bottom',
        offset: [0, -20],
      })
    }
    const time = useTimestamp({ offset: 0 })
    savedAt.value = time.value
  } catch (e: unknown) {
    const error = e as Error
    useMessage('error', {
      attach: container,
      content: error?.message ? error.message : t('save.error'),
      placement: 'bottom',
      offset: [0, -20],
    })
    console.error((e as Error).message)
  }
}
const getAllBookmarks = () => {
  let bookmarkData: any = []
  editor.value?.commands.getAllBookmarks(function (_data: any) {
    bookmarkData = _data
  })
  return bookmarkData
}
const focusBookmark = (bookmarkName: string) => {
  return editor.value?.commands.focusBookmark(bookmarkName)
}
const setBookmark = (bookmarkName: string) => {
  return editor.value?.commands.setBookmark({ bookmarkName })
}
const deleteBookmark = (bookmarkName: string) => {
  if (!bookmarkName) {
    return false
  }
  const element = editor.value?.view.dom.querySelector(
    `bookmark[bookmarkName="${bookmarkName}"]`,
  )
  if (!element) {
    return false
  }
  const pos = editor.value?.view.posAtDOM(element, 0)
  const { tr } = editor.value?.view.state ?? {}
  if (!tr) {
    return false
  }
  const marks = editor.value?.view.state.doc.resolve(pos + 1)?.marks()
  if (marks !== null && marks.length > 0) {
    for (const mark of marks) {
      if (mark.type.name === 'bookmark') {
        editor.value?.view.dispatch(
          tr.removeMark(pos, pos + element.outerText.length, mark),
        )
      }
    }
  } else {
    editor.value?.view.dispatch(
      tr.removeMark(pos, pos + element.outerText.length),
    )
  }
  return true
}
// Content Excerpt Methods
const getContentExcerpt = (charLimit = 100, more = ' ...') => {
  const text = editor.value?.getText()
  if (text?.length === 0) {
    return ''
  }
  return text?.substring(0, charLimit) + more
}

// Hotkeys Setup
watch(
  () => editor.value,
  () => {
    const unsetFormatPainter = () => editor.value?.commands.unsetFormatPainter()
    const bindEscKey = () => {
      useHotkeys('esc', () => {
        if (page.value.preview) {
          page.value.preview.enabled = false
        }
        if (fullscreen.value) {
          fullscreen.value = false
        }
      })
    }
    editor.value?.on('focus', () => {
      useHotkeys('esc', unsetFormatPainter)
      useHotkeys('ctrl+s,command+s', () => {
        void saveContent()
        unsetFormatPainter()
      })
      useHotkeys('ctrl+p,command+p', () => {
        print()
        unsetFormatPainter()
      })
      useHotkeys('ctrl+f, command+f', () => {
        searchReplace.value = true
      })
    })
    bindEscKey()
    editor.value?.on('blur', () => {
      removeAllHotkeys()
      bindEscKey()
    })
  },
)

// Methods Exposed to Descendants
provide('saveContent', saveContent)
provide('setLocale', setLocale)
provide('reset', reset)

// Exposing Methods
defineExpose({
  getOptions: () => options.value,
  setOptions,
  setToolbar,
  setPage,
  setWatermark,
  setDocument,
  setContent,
  insertContent,
  setContentTypeWriter,
  setLocale,
  setTheme,
  getPage: () => page.value,
  getContent,
  getImage,
  getText,
  getHTML,
  getJSON,
  saveContent,
  getContentExcerpt,
  getEditor: () => editor,
  useEditor: () => editor.value,
  getTableOfContents: () => editor.value?.storage.tableOfContents.content,
  getSelectionText: () => (editor.value ? getSelectionText(editor.value) : ''),
  getSelectionNode: () =>
    editor.value ? getSelectionNode(editor.value) : null,
  deleteSelectionNode: () => editor.value?.commands.deleteSelectionNode(),
  setCurrentNodeSelection: () =>
    editor.value?.commands.setCurrentNodeSelection(),
  getLocale,
  getI18n,
  setReadOnly(readOnly = true) {
    if (options.value.document) {
      options.value.document.readOnly = readOnly
    }
  },
  print,
  focus,
  blur,
  toggleFullscreen,
  reset,
  destroy,
  focusBookmark,
  getAllBookmarks,
  setBookmark,
  deleteBookmark,
  useAlert(pramas: DialogOptions) {
    return useAlert({ attach: container, ...pramas })
  },
  useConfirm(pramas: DialogOptions) {
    return useConfirm({ attach: container, ...pramas })
  },
  useMessage(type: string, pramas: MessageOptions) {
    return useMessage(type, { attach: container, ...pramas })
  },
})
</script>

<style lang="less">
@import '@/assets/styles/index.less';

.umo-editor-container {
  --td-brand-color: var(--umo-primary-color);
  --td-warning-color: var(--umo-warning-color);
  --td-error-color: var(--umo-error-color);
  --td-text-color-primary: var(--umo-text-color);
  --td-text-color-disabled: var(--umo-text-color-disabled);
  width: 100%;
  height: 100%;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  color: var(--umo-text-color);
  font-family: var(--umo-font-family);
  position: relative !important;
  .umo-toolbar,
  .umo-footer {
    background-color: var(--umo-color-white);
  }
  .umo-main {
    flex: 1;
    background-color: var(--umo-container-background);
    overflow: hidden;
  }
  &.preview-mode {
    &.laser-pointer {
      .umo-main {
        cursor: url('@/assets/images/laser-pointer.svg'), auto;
      }
    }
    .umo-toolbar {
      display: none;
    }
  }
  &.umo-editor-is-fullscreen {
    position: fixed !important;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
</style>
