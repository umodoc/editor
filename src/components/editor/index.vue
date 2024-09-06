<template>
  <editor-content
    class="umo-editor-container"
    :class="{
      'is-empty': isEmpty,
      'show-line-number': page.showLineNumber,
      'format-painter': painter.enabled,
      'disable-page-break': !page.pagination,
    }"
    :editor="editor"
    :style="{
      lineHeight: defaultLineHeight,
    }"
    :spellcheck="options.document.enableSpellcheck && $document.spellcheck"
  />
  <menus-bubble v-if="editor && !page.preview.enabled && !editorDestroyed" />
  <menus-context-block
    v-if="
      options.document.enableBlockMenu &&
      !page.preview.enabled &&
      editor &&
      !editorDestroyed
    "
  />
</template>

<script setup>
import { Editor, EditorContent } from '@tiptap/vue-3'
import Mathematics from '@tiptap-pro/extension-mathematics'
import Typography from '@tiptap/extension-typography'
import Image from '@/extensions/image'
import { extensions } from '@/extensions'
import Page from '@/extensions/page'
import { pagePlugin } from '@/extensions/page/page-plugin'

const {
  options,
  container,
  editor,
  page,
  painter,
  blockMenu,
  tableOfContents,
  setEditor,
  editorDestroyed,
} = useStore()

const $document = useState('document')

let enableRules = true
if (!options.value.document.enableMarkdown || !$document.value.markdown) {
  enableRules = [Mathematics, Typography, Image]
}

const defaultLineHeight = $computed(() => {
  return options.value.dicts.lineHeights.find((item) => item.default).value
})

let isReady = $ref(false)
let isEmpty = $ref(false)

const editorInstance = new Editor({
  editable: !options.value.document.readOnly,
  autofocus: options.value.document.autofocus,
  content: options.value.document.content,
  enableInputRules: enableRules,
  enablePasteRules: enableRules,
  editorProps: {
    attributes: {
      class: 'umo-editor',
    },
    ...options.value.document.editorProps,
  },
  parseOptions: options.value.document.parseOptions,
  extensions: [
    Page.configure({
      types: options.value.page.nodesComputedOption.types || [],
      slots: useSlots(),
    }),
    ...extensions,
    ...options.value.extensions,
  ],
  onCreate({ editor }) {
    isEmpty = editor.commands.setPlaceholder()
  },
  onUpdate({ editor }) {
    isEmpty = editor.commands.setPlaceholder()
    isReady = true
    $document.value.content = editor.getHTML()
  },
})
setEditor(editorInstance)

// 注册分页组件
const registerPagePlugin = async () => {
  await nextTick()
  const { nodesComputed } = options.value.page.nodesComputedOption
  editorInstance.registerPlugin(pagePlugin(editor, nodesComputed || {}))
  setTimeout(() => {
    const tr = editorInstance.state.tr.setMeta('initSplit', true)
    editorInstance.view.dispatch(tr)
  }, 500)
}
watch(
  () => isReady,
  () => {
    if (isReady) registerPagePlugin()
  },
  { once: true },
)

// 动态导入 katex 样式
const loadTatexStyle = () => {
  const katexStyleElement = document.querySelector('#katex-style')
  if (
    katexStyleElement === null &&
    !options.value.toolbar.disableMenuItems.includes('math')
  ) {
    const style = document.createElement('link')
    style.href = `${options.value.cdnUrl}/libs/katex/katex.min.css`
    style.rel = 'stylesheet'
    style.id = 'katex-style'
    document.querySelector('head').append(style)
  }
}

onMounted(loadTatexStyle)

// 销毁编辑器实例
onBeforeUnmount(() => editorInstance.destroy())
</script>

<style lang="less">
@import '@/assets/styles/editor.less';
@import '@/assets/styles/drager.less';
</style>
