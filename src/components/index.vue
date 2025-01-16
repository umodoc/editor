<template>
  <t-config-provider
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
        'toolbar-source': isRecord($toolbar) && $toolbar.mode === 'source',
        'preview-mode': page.preview?.enabled,
        'laser-pointer': page.preview?.enabled && page.preview?.laserPointer,
      }"
      :style="{ height: options.height }"
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
        <container-page v-if="$toolbar.mode !== 'source'">
          <template #bubble_menu="slotProps">
            <slot name="bubble_menu" v-bind="slotProps" />
          </template>
        </container-page>
        <editor-source v-else />
      </main>
      <footer v-if="$toolbar.mode !== 'source'" class="umo-footer">
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
import type { GlobalConfigProvider } from 'tdesign-vue-next'
import enConfig from 'tdesign-vue-next/esm/locale/en_US'
import cnConfig from 'tdesign-vue-next/esm/locale/zh_CN'

import { getSelectionNode, getSelectionText } from '@/extensions/selection'
import { i18n } from '@/i18n'
import { propsOptions } from '@/options'
import type {
  AutoSaveOptions,
  DocumentOptions,
  SupportedLocale,
  WatermarkOption,
} from '@/types'
import { consoleCopyright } from '@/utils/copyright'

import ruConfig from '../locales/td-next-vue/ru-RU'

const { toBlob, toJpeg, toPng } = domToImage

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

// Store Setup
const {
  container,
  toolbarKey,
  options,
  page,
  tableOfContents,
  savedAt,
  editorDestroyed,
  editor,
  setOptions,
  printing,
  resetStore,
} = useStore()

const $toolbar = useState('toolbar', props.editorKey)
const $document = useState('document', props.editorKey)

// Lifecycle Hooks
onBeforeMount(() => setOptions(props))
onMounted(() => {
  setTheme(options.value.theme)
  consoleCopyright()
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
      resetStore()
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
const { t, locale } = useI18n()
const $locale = useState('locale')
const { appContext } = getCurrentInstance() ?? {}
if (appContext) {
  appContext.config.globalProperties.t = t
  appContext.config.globalProperties.l = l
}
locale.value = $locale.value
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
  const $locale = useState('locale')
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
  if ($toolbar.value.mode !== 'source' && !document?.readOnly) {
    printing.value = true
  }
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
  resetStore()
}

// Content Saving Methods
const saveContent = async () => {
  if ($toolbar.value.mode === 'source' || options.value.document?.readOnly) {
    return
  }
  try {
    const message = await useMessage('loading', {
      content: t('save.saving'),
      placement: 'bottom',
      closeBtn: true,
      offset: [0, -20],
    })
    const success = await options.value?.onSave?.(
      {
        html: editor.value?.getHTML(),
        json: editor.value?.getJSON(),
        text: editor.value?.getHTML(),
      },
      page.value,
      $document.value,
    )
    if (!success) {
      message.close()
      useMessage('error', {
        content: t('save.failed'),
        placement: 'bottom',
        offset: [0, -20],
      })
      return
    }
    emits('saved')
    message.close()
    useMessage('success', {
      content: t('save.success'),
      placement: 'bottom',
      offset: [0, -20],
    })
    const time = useTimestamp({ offset: 0 })
    savedAt.value = time.value
  } catch (e) {
    useMessage('error', {
      content: t('save.error'),
      placement: 'bottom',
      offset: [0, -20],
    })
    console.error((e as Error).message)
  }
}

// Content Excerpt Methods
const getContentExcerpt = (charLimit = 100, more = ' ...') => {
  const text = editor.value?.getText()
  if (text?.length === 0) {
    return ''
  }
  return text?.substring(0, charLimit) + more
}

// Toolbar Mode Reset
watch(
  () => $toolbar.value.mode,
  (val: any) => {
    editorDestroyed.value = val === 'source'
  },
)

// Hotkeys Setup
const unsetFormatPainter = () => editor.value?.commands.unsetFormatPainter()
useHotkeys('ctrl+s,command+s', () => {
  void saveContent()
  unsetFormatPainter()
})
useHotkeys('ctrl+p,command+p', () => {
  print()
  unsetFormatPainter()
})
useHotkeys('esc', () => {
  if (page.value.preview) {
    page.value.preview.enabled = false
  }
  unsetFormatPainter()
})

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
  getTableOfContents: () => tableOfContents.value,
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
  reset,
  useAlert,
  useConfirm,
  useMessage,
  destroy,
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
}
</style>
