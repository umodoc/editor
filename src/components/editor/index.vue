<template>
  <editor-content
    class="umo-editor-container"
    :class="{
      'show-line-number': page.showLineNumber,
      'format-painter': painter.enabled,
      'disable-page-break': !page.pagination,
    }"
    :editor="editor"
    :style="{ lineHeight: defaultLineHeight }"
    :spellcheck="
      options.document?.enableSpellcheck && $document.enableSpellcheck
    "
  />
  <menus-bubble v-if="editor && !page.preview?.enabled && !editorDestroyed" />
  <menus-context-block
    v-if="
      options.document?.enableBlockMenu &&
      !page.preview?.enabled &&
      editor &&
      !editorDestroyed
    "
  />
</template>

<script setup lang="ts">
import SearchReplace from '@sereneinserenade/tiptap-search-and-replace'
import Bold from '@tiptap/extension-bold'
import CharacterCount from '@tiptap/extension-character-count'
import Color from '@tiptap/extension-color'
import { Document } from '@tiptap/extension-document'
import Dropcursor from '@tiptap/extension-dropcursor'
import Focus from '@tiptap/extension-focus'
import FontFamily from '@tiptap/extension-font-family'
import Highlight from '@tiptap/extension-highlight'
// 插入
import Link from '@tiptap/extension-link'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TableRow from '@tiptap/extension-table-row'
import TaskItem from '@tiptap/extension-task-item'
import TextColor from '@tiptap/extension-text-style'
import Typography from '@tiptap/extension-typography'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import { Editor } from '@tiptap/vue-3'
import Mathematics from '@tiptap-pro/extension-mathematics'
import {
  type TableOfContentData,
  TableOfContents,
} from '@tiptap-pro/extension-table-of-contents'
import { getHierarchicalIndexes } from '@tiptap-pro/extension-table-of-contents'

import Audio from '@/extensions/audio'
import BulletList from '@/extensions/bullet-list'
import CodeBlock from '@/extensions/code-block'
import File from '@/extensions/file'
import FileHandler from '@/extensions/file-handler'
import FontSize from '@/extensions/font-size'
// 基本
import FormatPainter from '@/extensions/format-painter'
import hr from '@/extensions/hr'
import Iframe from '@/extensions/iframe'
import Image from '@/extensions/image'
import Indent from '@/extensions/indent'
import LineHeight from '@/extensions/line-height'
// 表格
import Table from '@/extensions/list/table'
import TaskList from '@/extensions/list/tasklist'
import Margin from '@/extensions/margin'
import NodeAlign from '@/extensions/node-align'
import OrderedList from '@/extensions/ordered-list'
// 分页
import Page from '@/extensions/page'
import { pagePlugin } from '@/extensions/page/page-plugin'
// 其他
import Selection from '@/extensions/selection'
import TableCell from '@/extensions/table-cell'
import TableHeader from '@/extensions/table-header'
import TextAlign from '@/extensions/text-align'
import TextBox from '@/extensions/text-box'
// 页面
import Toc from '@/extensions/toc'
import Video from '@/extensions/video'
import shortId from '@/utils/short-id'

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

const enableRules =
  !options.value.document?.enableMarkdown || !$document.value.enableMarkdown
    ? [Image, Mathematics, Typography]
    : []

const defaultLineHeight = $computed(() => {
  return options.value.dicts?.lineHeights?.find((item) => item.default)?.value
})

const editorInstance = new Editor({
  editable: !options.value.document?.readOnly,
  autofocus: options.value.document?.autofocus,
  content: options.value.document?.content,
  enableInputRules: enableRules,
  enablePasteRules: enableRules,
  editorProps: {
    attributes: {
      class: 'umo-editor',
    },
    ...options.value.document?.editorProps,
  },
  parseOptions: options.value.document?.parseOptions,
  extensions: [
    StarterKit.configure({
      document: false,
      bold: false,
      bulletList: false,
      orderedList: false,
      codeBlock: false,
      horizontalRule: false,
      dropcursor: false,
    }),
    Document.extend({ content: 'page+' }),
    Page.configure({
      types: options.value.page.nodesComputedOption?.types ?? [],
      slots: useSlots(),
    }),
    /* Placeholder.configure({
      considerAnyAsEmpty: true,
      placeholder: l(options.value.document.placeholder),
    }),*/
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
      onUpdate: (content: TableOfContentData) => {
        tableOfContents.value = content
      },
      scrollParent: () =>
        document.querySelector(`${container} .umo-zoomable-container`),
      getId: () => shortId(6),
    }),
    Typography.configure(options.value.document?.typographyRules),
    CharacterCount.configure({
      limit:
        options.value.document?.characterLimit !== 0
          ? options.value.document?.characterLimit
          : undefined,
    }),
    FileHandler.configure({
      allowedMimeTypes: options.value?.file?.allowedMimeTypes ?? [],
      onPaste(editor: Editor, files: File[]) {
        for (const file of files) {
          editor.commands?.insertFile?.({ file })
        }
      },
      onDrop: (
        editor: Editor,
        files: File[],
        pos: { top: number; left: number },
      ) => {
        for (const file of files) {
          editor.commands?.insertFile?.({ file, pos })
        }
      },
    }),
    Dropcursor.configure({
      color: 'var(--umo-primary-color)',
    }),
    ...(options.value?.extensions ?? []),
  ],
  onCreate() {},
  onUpdate({ editor }) {
    $document.value.content = editor.getHTML()
  },
})
setEditor(editorInstance)

// 动态导入 katex 样式
onMounted(() => {
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
})
window.addEventListener('load', () => {
  editorInstance.registerPlugin(
    pagePlugin(
      editor.value,
      options.value.page.nodesComputedOption?.nodesComputed ?? {},
    ),
  )
  setTimeout(() => {
    const tr = editorInstance.state.tr.setMeta('initSplit', true)
    editorInstance.view.dispatch(tr)
  }, 500)
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
