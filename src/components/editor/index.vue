<template>
  <editor-content
    class="umo-editor-content"
    :class="{
      'show-bookmark': page.showBookmark,
      'show-line-number': page.showLineNumber,
      'format-painter': editor?.view?.painter?.enabled,
      'is-empty': editor?.isEmpty && editor?.state.doc.childCount <= 1,
      'is-readonly': !editor?.isEditable,
    }"
    :editor="editor"
    :style="{
      lineHeight: defaultLineHeight,
    }"
    :spellcheck="
      options.document?.enableSpellcheck && $document.enableSpellcheck
    "
  />
  <template v-if="editor && !destroyed">
    <menus-block
      v-if="options.document?.enableBlockMenu"
      v-show="
        page.zoomLevel === 100 && !page.preview?.enabled && editor.isEditable
      "
    />
    <menus-bubble
      v-if="options.document?.enableBubbleMenu"
      v-show="!editor?.view?.painter?.enabled && !editor?.isEmpty"
    >
      <template #bubble_menu="props">
        <slot name="bubble_menu" v-bind="props" />
      </template>
    </menus-bubble>
  </template>
</template>

<script setup>
import { migrateMathStrings } from '@tiptap/extension-mathematics'
import { Editor, EditorContent } from '@tiptap/vue-3'

import { getDefaultExtensions, inputAndPasteRules } from '@/extensions'
import { contentTransform } from '@/utils/content-transform'
import { addHistory } from '@/utils/history-record'
import { loadResource } from '@/utils/load-resource'

const destroyed = inject('destroyed')
const page = inject('page')
const options = inject('options')
const uploadFileMap = inject('uploadFileMap')
const historyRecords = inject('historyRecords')

const $document = useState('document', options)

const defaultLineHeight = $computed(
  () => options.value.dicts?.lineHeights?.find((item) => item.default)?.value,
)

const container = inject('container')
const extensions = getDefaultExtensions({
  container,
  options,
  uploadFileMap,
})

let syncContentTimer = null
const syncDocumentContent = (targetEditor = editorInstance) => {
  if (!$document.value || !targetEditor) {
    return
  }
  $document.value.content = targetEditor.getHTML()
}
const scheduleSyncDocumentContent = () => {
  if (syncContentTimer !== null) {
    clearTimeout(syncContentTimer)
  }
  syncContentTimer = setTimeout(() => {
    syncContentTimer = null
    syncDocumentContent(editorInstance)
  }, 800)
}
const flushSyncDocumentContent = () => {
  if (syncContentTimer !== null) {
    clearTimeout(syncContentTimer)
    syncContentTimer = null
  }
  syncDocumentContent(editorInstance)
}

const editorInstance = new Editor({
  editable: !options.value.document?.readOnly,
  autofocus: options.value.document?.autofocus,
  content: contentTransform(options.value.document?.content),
  enableInputRules: inputAndPasteRules(options),
  enablePasteRules: inputAndPasteRules(options),
  editorProps: {
    attributes: {
      class: 'umo-editor',
    },
    ...options.value.document?.editorProps,
  },
  // enableContentCheck: true,
  parseOptions: options.value.document?.parseOptions,
  extensions: [...extensions, ...options.value.extensions],
  onCreate({ editor }) {
    if (options.value.disableExtensions.includes('math')) {
      migrateMathStrings(editor)
    }
  },
  onUpdate({ editor }) {
    addHistory(historyRecords, 'editor', editor?.state?.history$)
    scheduleSyncDocumentContent()
  },
  onBlur() {
    flushSyncDocumentContent()
  },
})
const editor = inject('editor')
editor.value = editorInstance
editor.value.storage.container = container
watch(
  () => options.value,
  () => {
    editor.value.storage.options = options.value
  },
  { immediate: true, deep: true },
)

onMounted(() => {
  const { disableExtensions, cdnUrl } = options.value
  const has = (name) => !disableExtensions.includes(name)
  const libUrl = `${cdnUrl}/libs`
  if (has('math')) {
    loadResource(`${libUrl}/katex/katex.min.css`, 'css', 'katex-style')
  }
  if (has('mermaid')) {
    loadResource(`${libUrl}/mermaid/mermaid.min.js`, 'script', 'mermaid-script')
  }
  window.addEventListener('beforeunload', flushSyncDocumentContent)
  window.addEventListener('pagehide', flushSyncDocumentContent)
  document.addEventListener('visibilitychange', flushSyncDocumentContent)
})

// 销毁编辑器实例
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', flushSyncDocumentContent)
  window.removeEventListener('pagehide', flushSyncDocumentContent)
  document.removeEventListener('visibilitychange', flushSyncDocumentContent)
  flushSyncDocumentContent()
  editorInstance.unmount()
})
</script>

<style lang="less">
@import '@/assets/styles/editor.less';
@import '@/assets/styles/drager.less';
</style>
