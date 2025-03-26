<template>
  <editor-content
    class="umo-editor-content"
    :class="{
      'show-bookmark': page.showBookmark,
      'show-line-number': page.showLineNumber,
      'format-painter': editor?.view?.painter?.enabled,
      'is-empty': editor?.isEmpty && editor?.state.doc.childCount <= 1,
      'is-readonly': !editor?.editable,
    }"
    :editor="editor"
    :style="{
      lineHeight: defaultLineHeight,
    }"
    :spellcheck="
      options.document?.enableSpellcheck && $document.enableSpellcheck
    "
  />
  <template
    v-if="editor && !destroyed && !page.preview?.enabled && editor.isEditable"
  >
    <menus-context-block v-if="options.document?.enableBlockMenu" />
    <menus-bubble v-if="options.document?.enableBubbleMenu" />
  </template>
</template>

<script setup lang="ts">
import { Editor, EditorContent } from '@tiptap/vue-3'

import { getDefaultExtensions, inputAndPasteRules } from '@/extensions'

const destroyed = inject('destroyed')
const page = inject('page')
const options = inject('options')
const uploadFileMap = inject('uploadFileMap')

const $document = useState('document', options)

const defaultLineHeight = $computed(
  () =>
    options.value.dicts?.lineHeights?.find((item: any) => item.default)?.value,
)

const container = inject('container')
const extensions: any[] = getDefaultExtensions({
  container,
  options,
  uploadFileMap,
})

const editorInstance: Editor = new Editor({
  editable: !options.value.document?.readOnly,
  autofocus: options.value.document?.autofocus,
  content: options.value.document?.content,
  enableInputRules: inputAndPasteRules(options),
  enablePasteRules: inputAndPasteRules(options),
  editorProps: {
    attributes: {
      class: 'umo-editor',
    },
    ...options.value.document?.editorProps,
  },
  parseOptions: options.value.document?.parseOptions,
  extensions: [...extensions, ...options.value.extensions],
  onUpdate({ editor }) {
    $document.value.content = editor.getHTML()
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

// 动态导入 katex 样式
const loadTatexStyle = () => {
  const katexStyleElement = document.querySelector('#katex-style')
  if (
    katexStyleElement === null &&
    !options.value.toolbar?.disableMenuItems.includes('math')
  ) {
    const style = document.createElement('link')
    style.href = `${options.value.cdnUrl}/libs/katex/katex.min.css`
    style.rel = 'stylesheet'
    style.id = 'katex-style'
    document.querySelector('head')?.append(style)
  }
}

onMounted(() => {
  loadTatexStyle()
})

// 销毁编辑器实例
onBeforeUnmount(() => {
  editorInstance.destroy()
})
</script>

<style lang="less">
@import '@/assets/styles/editor.less';
@import '@/assets/styles/drager.less';
</style>
