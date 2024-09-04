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
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@/extensions/placeholder'
import Focus from '@tiptap/extension-focus'

// 基本
import FormatPainter from '@/extensions/format-painter'
import FontFamily from '@tiptap/extension-font-family'
import FontSize from '@/extensions/font-size'
import Bold from '@tiptap/extension-bold'
import Underline from '@tiptap/extension-underline'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Color from '@tiptap/extension-color'
import TextColor from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import BulletList from '@/extensions/bullet-list'
import OrderedList from '@/extensions/ordered-list'
import Indent from '@/extensions/indent'
import TextAlign from '@/extensions/text-align'
import NodeAlign from '@/extensions/node-align'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@/extensions/list/tasklist'
import LineHeight from '@/extensions/line-height'
import Margin from '@/extensions/margin'
import SearchReplace from '@sereneinserenade/tiptap-search-and-replace'

// 插入
import Link from '@tiptap/extension-link'
import Image from '@/extensions/image'
import Video from '@/extensions/video'
import Audio from '@/extensions/audio'
import File from '@/extensions/file'
import CodeBlock from '@/extensions/code-block'
import TextBox from '@/extensions/text-box'
import hr from '@/extensions/hr'
import Iframe from '@/extensions/iframe'
import Mathematics from '@tiptap-pro/extension-mathematics'

// 表格
import Table from '@/extensions/list/table'
import TableCell from '@/extensions/table-cell'
import TableHeader from '@/extensions/table-header'
import TableRow from '@tiptap/extension-table-row'

// 页面
import Toc from '@/extensions/toc'
// 分页
import Page from '@/extensions/page'
import { Document } from '@tiptap/extension-document'
// 其他
import Selection from '@/extensions/selection'
import { TableOfContents } from '@tiptap-pro/extension-table-of-contents'
import { getHierarchicalIndexes } from '@tiptap-pro/extension-table-of-contents'
import Typography from '@tiptap/extension-typography'
import CharacterCount from '@tiptap/extension-character-count'
import FileHandler from '@/extensions/file-handler'
import Dropcursor from '@tiptap/extension-dropcursor'

import shortId from '@/utils/short-id'
import { pagePlugin } from '@/extensions/page/page-plugin'
import placeholder from '@/extensions/placeholder'

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
  enableRules = [Image, Mathematics, Typography]
}

const defaultLineHeight = $computed(() => {
  return options.value.dicts.lineHeights.find((item) => item.default).value
})

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
    StarterKit.configure({
      document: false,
      bold: false,
      bulletList: false,
      orderedList: false,
      codeBlock: false,
      horizontalRule: false,
      gapcursor: true,
      dropcursor: false,
    }),
    Document.extend({ content: 'page+' }),
    Page.configure({
      types: options.value.page.nodesComputedOption.types || [],
      slots: useSlots(),
    }),
    Placeholder.configure({
      placeholder: l(options.value.document.placeholder),
    }),
    Focus.configure({
      className: 'umo-node-focused',
      mode: 'all',
    }),
    FormatPainter,
    FontFamily,
    FontSize,
    Bold.extend({
      renderHTML: ({ HTMLAttributes }) => ['b', HTMLAttributes, 0],
    }),
    Underline,
    Subscript,
    Superscript,
    Color,
    TextColor,
    Highlight.configure({
      multicolor: true,
    }),
    BulletList,
    OrderedList,
    Indent,
    TextAlign,
    NodeAlign,
    TaskItem.configure({ nested: true }),
    TaskList.configure({
      HTMLAttributes: {
        class: 'umo-task-list',
      },
    }),
    LineHeight.configure({
      types: ['heading', 'paragraph'],
      defaultLineHeight,
    }),
    Margin,
    SearchReplace.configure({
      searchResultClass: 'umo-search-result',
    }),
    Link,
    Image,
    Video,
    Audio,
    File,
    TextBox,
    CodeBlock,
    hr,
    Iframe,
    Mathematics,

    // 表格
    Table.configure({
      allowTableNodeSelection: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
    // 页面
    Toc,
    // 其他
    Selection,
    TableOfContents.configure({
      getIndex: getHierarchicalIndexes,
      onUpdate: (content) => {
        tableOfContents.value = content
      },
      scrollParent: () =>
        document.querySelector(`${container} .umo-zoomable-container`),
      getId: () => shortId(6),
    }),
    Typography.configure(options.value.document.typographyRules),
    CharacterCount.configure({
      limit:
        options.value.document.characterLimit !== 0
          ? options.value.document.characterLimit
          : undefined,
    }),
    FileHandler.configure({
      allowedMimeTypes: options.value.file.allowedMimeTypes,
      onPaste(editor, files, html) {
        files.forEach((file) => editor.commands.insertFile({ file }))
      },
      onDrop: (editor, files, pos) => {
        files.forEach((file) => editor.commands.insertFile({ file, pos }))
      },
    }),
    Dropcursor.configure({
      color: 'var(--umo-primary-color)',
    }),
    ...options.value.extensions,
  ],
  onCreate({ editor }) {
    setPlaceholder(editor)
  },
  onUpdate({ editor }) {
    $document.value.content = editor.getHTML()
    setPlaceholder(editor)
  },
})
setEditor(editorInstance)

let isEmpty = $ref(false)
const setPlaceholder = (editor) => {
  if (editor.isEmpty && editor.state.doc.content.size <= 4) {
    isEmpty = true
    editor
      .chain()
      .setContent(
        `<p data-placeholder="${l(options.value.document.placeholder)}"></p>`,
      )
      .focus(3)
      .run()
  } else {
    isEmpty = false
  }
}

// 动态导入 katex 样式
onMounted(() => {
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
})
window.addEventListener('load', function () {
  editorInstance.registerPlugin(
    pagePlugin(
      editor,
      options.value.page.nodesComputedOption.nodesComputed || {},
    ),
  )
  setTimeout(() => {
    const tr = editorInstance.state.tr.setMeta('initSplit', true)
    editorInstance.view.dispatch(tr)
  }, 500)
})

// 销毁编辑器实例
onBeforeUnmount(() => editorInstance.destroy())
</script>

<style lang="less">
@import '@/assets/styles/editor.less';
@import '@/assets/styles/drager.less';
</style>
