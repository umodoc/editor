<template>
  <t-config-provider :global-config="globalConfig">
    <div
      :id="container.substr(1)"
      class="umo-editor-container"
      :class="{
        'toolbar-classic': $toolbar.mode === 'classic',
        'toolbar-ribbon': $toolbar.mode === 'ribbon',
        'toolbar-source': $toolbar.mode === 'source',
        'preview-mode': page.preview.enabled,
        'laser-pointer': page.preview.enabled && page.preview.laserPointer,
      }"
      :style="{ height: options.height }"
    >
      <header class="umo-toolbar">
        <toolbar :key="toolbarKey" @menu-change="menuChange" />
      </header>
      <main class="umo-main">
        <container-page v-if="$toolbar.mode !== 'source'" />
        <editor-source v-else />
      </main>
      <footer v-if="$toolbar.mode !== 'source'" class="umo-footer">
        <statusbar />
      </footer>
    </div>
  </t-config-provider>
</template>

<script setup>
import { toBlob, toJpeg, toPng } from 'dom-to-image-more'
import { propsOptions } from './options'
import '@/assets/styles/index.less'
import { onBeforeUnmount } from 'vue'

defineOptions({ name: 'UmoEditor' })

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
  'print',
  'focus',
  'blur',
  'saved',
  'destroy',
])

onBeforeMount(() => setOptions(props))

const {
  container,
  toolbarKey,
  options,
  page,
  savedAt,
  editorDestroyed,
  editor,
  setOptions,
  printing,
  resetStore,
} = useStore()
const $toolbar = useState('toolbar', props.editorKey)
const $document = useState('document', props.editorKey)
watch(
  () => props,
  () => setOptions(props),
  { deep: true },
)

// 全局设置
const globalConfig = {
  classPrefix: 'umo',
}

// 对外暴露的编辑器方法
const setToolbar = (parmas) => {
  if ((!parmas) instanceof Object) throw new Error('parmas must be an object.')
  if (parmas.mode) {
    if (typeof parmas.mode !== 'string') {
      throw new Error('"parmas.size" must be a string.')
    }
    if (parmas.mode && !['classic', 'ribbon'].includes(parmas.mode)) {
      throw new Error('"parmas.mode" must be one of "classic" or "ribbon".')
    }
    $toolbar.value.mode = parmas.mode
  }
  if (parmas.show !== undefined) {
    if (typeof parmas.show !== 'boolean') {
      throw new Error('"parmas.show" must be a boolean.')
    }
    $toolbar.value.show = parmas.show
  }
}
const setPage = (parmas) => {
  if ((!parmas) instanceof Object) throw new Error('parmas must be an object.')
  if (parmas.size) {
    if (typeof parmas.size !== 'string')
      throw new Error('"parmas.size" must be a string.')
    const size = options.value.dicts.pageSizes.find(
      (item) => item.label === parmas.size,
    )
    if (!size)
      throw new Error(
        `"parmas.size" must be one of ${options.value.dicts.pageSizes.map((item) => item.label)}.`,
      )
    page.value.size = size
  }
  if (parmas.orientation) {
    if (typeof parmas.orientation !== 'string') {
      throw new Error('"parmas.orientation" must be a string.')
    }
    if (!['horizontal', 'vertical'].includes(parmas.orientation)) {
      throw new Error('"parmas.mode" must be one of "classic" or "ribbon".')
    }
    page.value.orientation = parmas.orientation
  }

  if (parmas.background) {
    if (typeof parmas.background !== 'string') {
      throw new Error('"parmas.background" must be a string.')
    }
    page.value.background = parmas.background
  }
  if (parmas.showBreakMarks !== undefined) {
    if (typeof parmas.showBreakMarks !== 'boolean') {
      throw new Error('"parmas.showBreakMarks" must be a boolean.')
    }
    page.value.showBreakMarks = parmas.showBreakMarks
    if (parmas.showBreakMarks) {
      editor.value.commands.showInvisibleCharacters()
    } else {
      editor.value.commands.hideInvisibleCharacters()
    }
  }
}
const setWatermark = (parmas) => {
  if ((!parmas) instanceof Object) throw new Error('parmas must be an object.')
  if (parmas.alpha !== undefined) {
    if (typeof parmas.alpha !== 'number') {
      throw new Error('"parmas.alpha" must be a number.')
    }
    page.value.watermark.alpha = parmas.alpha
  }
  if (parmas.text) {
    if (typeof parmas.text !== 'string') {
      throw new Error('"parmas.text" must be a string.')
    }
    if (parmas.text.length > 30) {
      throw new Error('"parmas.text" must be less than 30 characters.')
    }
    page.value.watermark.text = parmas.text
  }

  if (parmas.type) {
    if (typeof parmas.type !== 'string') {
      throw new Error('"parmas.type" must be a string.')
    }
    if (!['compact', 'spacious'].includes(parmas.type)) {
      throw new Error('"parmas.type" must be one of "compact" or "spacious".')
    }
    page.value.watermark.type = parmas.type
  }
  if (parmas.fontColor) {
    if (typeof parmas.fontColor !== 'string') {
      throw new Error('"parmas.fontColor" must be a string.')
    }
    page.value.watermark.fontColor = parmas.fontColor
  }
  if (parmas.fontSize) {
    if (typeof parmas.fontSize !== 'number') {
      throw new Error('"parmas.fontSize" must be a number.')
    }
    page.value.watermark.fontSize = parmas.fontSize
  }
  if (parmas.fontFamily || parmas.fontFamily === null) {
    if (parmas.fontFamily !== null && typeof parmas.fontFamily !== 'string') {
      throw new Error('"parmas.fontFamily" must be a string.')
    }
    page.value.watermark.fontFamily = parmas.fontFamily
  }
  if (parmas.fontWeight) {
    if (typeof parmas.fontWeight !== 'string') {
      throw new Error('"parmas.fontWeight" must be a string.')
    }
    if (!['normal', 'bold', 'bolder'].includes(parmas.fontWeight)) {
      throw new Error(
        '"parmas.fontWeight" must be one of "normal", "bold" or "bolder".',
      )
    }

    page.value.watermark.fontWeight = parmas.fontWeight
  }
}
const setDocument = (parmas) => {
  if ((!parmas) instanceof Object) throw new Error('parmas must be an object.')
  if (parmas.title) {
    if (typeof parmas.title !== 'string') {
      throw new Error('"parmas.title" must be a string.')
    }
    const title = parmas.title !== '' ? parmas.title : '未命名文档'
    $document.value.title = title
    options.value.document.title = title
  }
  if (parmas.bubbleMenu !== undefined) {
    if (typeof parmas.bubbleMenu !== 'boolean') {
      throw new Error('"parmas.bubbleMenu" must be a boolean.')
    }
    options.value.document.bubbleMenu = parmas.bubbleMenu
  }
  if (parmas.blockMenu !== undefined) {
    if (typeof parmas.blockMenu !== 'boolean') {
      throw new Error('"parmas.blockMenu" must be a boolean.')
    }
    options.value.document.blockMenu = parmas.blockMenu
  }
  if (parmas.markdown !== undefined) {
    if (typeof parmas.markdown !== 'boolean') {
      throw new Error('"parmas.markdown" must be a boolean.')
    }
    $document.value.markdown = parmas.markdown
  }
  if (parmas.spellcheck !== undefined) {
    if (typeof parmas.spellcheck !== 'boolean') {
      throw new Error('"parmas.spellcheck" must be a boolean.')
    }
    $document.value.spellcheck = parmas.spellcheck
  }
  if (parmas.autoSave) {
    if (typeof parmas.autoSave?.enabled !== 'boolean') {
      throw new Error('"parmas.autoSave.enabled" must be a boolean.')
    }
    options.value.document.autoSave.enabled = parmas.autoSave.enabled
    if (parmas.autoSave?.interval !== 'number') {
      throw new Error('"parmas.autoSave.interval" must be a number.')
    }
    options.value.document.autoSave.interval = parmas.autoSave.interval
  }
}
const setContent = (content) => {
  if (!editor.value) throw new Error('editor is not ready!')
  editor.value.chain().setContent(content).focus().run()
}
const getContent = (format = 'html') => {
  if (!editor.value) throw new Error('editor is not ready!')
  if (format === 'html') return editor.value.getHTML()
  if (format === 'text') return editor.value.getText()
  if (format === 'json') return editor.value.getJSON()
  throw new Error('format must be html, text or json')
}
const getImage = async (format = 'blob') => {
  const zoomLevel = page.value.zoomLevel
  try {
    page.value.zoomLevel = 100
    const node = document.querySelector(`${container} .page-content`)
    if ((format = 'blob')) {
      const blob = await toBlob(node)
      return blob
    }
    if ((format = 'jpeg')) {
      const image = await toJpeg(node)
      return image
    }
    if ((format = 'png')) {
      const image = await toPng(node)
      return image
    }
  } catch {
    throw new Error('导出图片失败，请重试或尝试刷新页面。')
  } finally {
    page.value.zoomLevel = zoomLevel
  }
}
const getText = () => getContent('text')
const getHTML = () => getContent('html')
const getJSON = () => getContent('json')
const saveContent = async () => {
  if ($toolbar.value.mode === 'source' || options.value.document.readOnly) {
    return
  }
  try {
    let message = await useMessage(
      'loading',
      {
        content: '正在保存文档内容...',
        placement: 'bottom',
        closeBtn: true,
        offset: [0, -20],
      },
      0,
    )
    const success = await options.value.onSave(
      {
        html: editor.value.getHTML(),
        json: editor.value.getJSON(),
        text: editor.value.getHTML(),
      },
      page.value,
      $document.value,
    )
    if (!success) {
      message.close()
      message = useMessage('error', {
        content: '文档内容失败，请重试！',
        placement: 'bottom',
        offset: [0, -20],
      })
      return
    }
    emits('saved')
    message.close()
    useMessage('success', {
      content: '文档内容保存成功！',
      placement: 'bottom',
      offset: [0, -20],
    })
    const time = useTimestamp({ offset: 0 })
    savedAt.value = time.value
  } catch (e) {
    useMessage('error', {
      content: '文档内容保存出错！',
      placement: 'bottom',
      offset: [0, -20],
    })
    console.error(e.message)
  }
}
const getContentExcerpt = (charLimit = 100, more = ' ...') => {
  const text = editor.value.getText()
  if (text.length === 0) return ''
  return text.substring(0, charLimit) + more
}
const print = () => {
  const { toolbar, document } = options.value
  if (toolbar.disableMenuItems.includes('print')) return
  if ($toolbar.value.mode !== 'source' && !document.readOnly) {
    printing.value = true
  }
}
const focus = (position = 'start') => editor.value.commands.focus(position)
const blur = () => editor.value.chain().blur().run()
const reset = (silent) => {
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
    header: '重置编辑器',
    body: '此操作会清空所有的编辑器设置数据，包括当前编辑的内容，并刷新页面，建议保存内容后再重置，确定要现在重置吗？',
    confirmBtn: {
      theme: 'warning',
      content: '立即重置',
    },
    onConfirm() {
      dialog.destroy()
      resetFn()
    },
  })
}

defineExpose({
  getOptions: () => options.value,
  setOptions,
  setToolbar,
  setPage,
  setWatermark,
  setDocument,
  setContent,
  getContent,
  getImage,
  getText,
  getHTML,
  getJSON,
  saveContent,
  getContentExcerpt,
  getEditor: () => editor,
  setReadOnly(readOnly = true) {
    options.value.document.readOnly = readOnly
  },
  print,
  focus,
  blur,
  reset,
  useAlert,
  useConfirm,
  useMessage,
  destroy: () => {
    resetStore()
    editor.value.destroy()
  },
})

// 定时保存
let contentUpdated = $ref(false)
let isFirstUpdate = $ref(true)
let autoSaveInterval = $ref(null)
const clearAutoSaveInterval = () => {
  if (autoSaveInterval !== null) {
    clearInterval(autoSaveInterval)
    autoSaveInterval = null
  }
}
watch(
  () => contentUpdated,
  (val) => {
    const { autoSave } = options.value.document
    if (!autoSave.enabled) return
    if (isFirstUpdate) {
      isFirstUpdate = false
      setTimeout(() => (contentUpdated = false))
      return
    }
    if (!val) {
      clearAutoSaveInterval()
      return
    }
    autoSaveInterval = setInterval(() => {
      saveContent()
      contentUpdated = false
      clearAutoSaveInterval()
    }, autoSave.interval)
  },
)
onBeforeUnmount(() => {
  clearAutoSaveInterval()
})

// 编辑器事件
emits('beforeCreate')
watch(
  () => editor.value,
  () => {
    if (!editor.value) return
    editor.value.on('create', ({ editor }) => emits('created', { editor }))
    editor.value.on('update', ({ editor }) => {
      emits('changed', { editor })
      contentUpdated = true
    })
    editor.value.on('selectionUpdate', ({ editor }) => {
      emits('changed:selection', { editor })
    })
    editor.value.on('transaction', ({ editor, transaction }) =>
      emits('changed:transaction', { editor, transaction }),
    )
    editor.value.on('focus', ({ editor, event }) =>
      emits('focus', { editor, event }),
    )
    editor.value.on('blur', ({ editor, event }) =>
      emits('blur', { editor, event }),
    )
    editor.value.on('destroy', () => {
      resetStore()
      emits('destroy')
    })
  },
)
const menuChange = (menu) => emits('changed:menu', menu)
watch(
  () => $toolbar.value,
  (toolbar, oldToolbar) => {
    emits('changed:toolbar', { toolbar, oldToolbar })
  },
  { deep: true },
)
watch(
  () => page.value.size,
  (pageSize, oldPageSize) =>
    emits('changed:pageSize', { pageSize, oldPageSize }),
  { deep: true },
)
watch(
  () => page.value.margin,
  (pageMargin, oldPageMargin) =>
    emits('changed:pageMargin', { pageMargin, oldPageMargin }),
  { deep: true },
)
watch(
  () => page.value.background,
  (pageBackground, oldPageBackground) =>
    emits('changed:pageBackground', { pageBackground, oldPageBackground }),
)
watch(
  () => page.value.orientation,
  (pageOrientation, oldPageOrientation) =>
    emits('changed:pageOrientation', { pageOrientation, oldPageOrientation }),
)
watch(
  () => page.value.showToc,
  (showToc) => emits('changed:pageShowToc', showToc),
)
watch(
  () => page.value.zoomLevel,
  (zoomLevel, oldZoomLevel) =>
    emits('changed:pageZoom', { zoomLevel, oldZoomLevel }),
)
watch(
  () => page.value.preview.enabled,
  (previewEnabled) => emits('changed:pagePreview', previewEnabled),
)
watch(
  () => page.value.watermark,
  (pageWatermark, oldPageWatermark) =>
    emits('changed:pageWatermark', { pageWatermark, oldPageWatermark }),
  { deep: true },
)
watch(
  () => printing.value,
  () => emits('print'),
  { deep: true },
)

// 将方法传递给子孙组件使用
provide('saveContent', saveContent)
provide('reset', reset)

// 快捷键
useHotkeys('ctrl+s,command+s', saveContent)
useHotkeys('ctrl+p,command+p', print)

// 工具栏切换时重置编辑器
watch(
  () => $toolbar.value.mode,
  (val) => (editorDestroyed.value = val === 'source'),
)
</script>

<style lang="less" scoped>
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
  background-color: var(--umo-color-white);
  overflow: hidden;
  .umo-main {
    flex: 1;
    background-color: var(--umo-container-background);
    overflow: hidden;
  }
  &.preview-mode {
    &.laser-pointer {
      cursor: url('@/assets/images/laser-pointer.svg'), auto;
    }

    .umo-toolbar {
      display: none;
    }
  }
}
</style>
