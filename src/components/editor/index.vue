<template>
  <editor-content
    class="umo-editor-content"
    :class="{
      'show-bookmark': bookmark,
      'show-line-number': page.showLineNumber,
      'format-painter': painter.enabled,
      'is-empty': editor?.isEmpty,
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
    v-if="
      editor && !editorDestroyed && !page.preview?.enabled && !editorDestroyed
    "
  >
    <menus-context-block v-if="options.document?.enableBlockMenu" />
    <menus-bubble />
  </template>
</template>

<script setup lang="ts">
import { Editor, EditorContent, type Extension } from '@tiptap/vue-3'

import { extensions, inputAndPasteRules } from '@/extensions'

const { options, editor, page, painter, bookmark, setEditor, editorDestroyed } =
  useStore()

const $document = useState('document')

const defaultLineHeight = $computed(
  () =>
    options.value.dicts?.lineHeights?.find((item: any) => item.default)?.value,
)

const editorInstance: Editor = new Editor({
  editable: !options.value.document?.readOnly,
  autofocus: options.value.document?.autofocus,
  content: options.value.document?.content,
  enableInputRules: inputAndPasteRules(),
  enablePasteRules: inputAndPasteRules(),
  editorProps: {
    attributes: {
      class: 'umo-editor',
    },
    ...options.value.document?.editorProps,
  },
  parseOptions: options.value.document?.parseOptions,
  extensions: [...extensions, ...(options.value.extensions as Extension[])],
  onUpdate({ editor }) {
    $document.value.content = editor.getHTML()
  },
})
setEditor(editorInstance)

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
