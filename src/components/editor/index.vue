<template>
  <editor-content
    :spellcheck="options.document.enableSpellcheck && $document.spellcheck"
    class="editor-container"
    :class="{
      'show-line-number': page.showLineNumber,
      'format-painter': painter.enabled,
    }"
    :style="{ lineHeight: defaultLineHeight }"
    :editor="editor"
  />
  <template v-if="editor && !editorDestroyed">
    <bubble-menu
      v-show="!blockMenu && !painter.enabled"
      class="umo-editor-bubble-menu"
      :class="{ assistant }"
      :editor="editor"
      :tippy-options="tippyOpitons"
    >
      <menus-bubble v-if="options.document.enableBubbleMenu && !assistant">
        <template #bubble_menu="props">
          <slot name="bubble_menu" v-bind="props" />
        </template>
      </menus-bubble>
      <assistant-input v-if="options.assistant.enabled && assistant" />
    </bubble-menu>
  </template>
  <template
    v-if="options.document.enableBlockMenu && editor && !editorDestroyed"
  >
    <menus-context-block />
  </template>
</template>

<script setup>
import { Editor, EditorContent, BubbleMenu } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Focus from '@tiptap/extension-focus'

// 基本
import FormatPainter from './extensions/format-painter'
import FontFamily from '@tiptap/extension-font-family'
import FontSize from './extensions/font-size'
import Bold from '@tiptap/extension-bold'
import Underline from '@tiptap/extension-underline'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Color from '@tiptap/extension-color'
import TextColor from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import BulletList from './extensions/bullet-list'
import OrderedList from './extensions/ordered-list'
import Indent from './extensions/indent'
import TextAlign from './extensions/text-align'
import NodeAlign from './extensions/node-align'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from './extensions/list/tasklist'
import LineHeight from './extensions/line-height'
import Margin from './extensions/margin'
import SearchReplace from '@sereneinserenade/tiptap-search-and-replace'

// 插入
import Link from '@tiptap/extension-link'
import Image from './extensions/image'
import Video from './extensions/video'
import Audio from './extensions/audio'
import File from './extensions/file'
import CodeBlock from './extensions/code-block'
import TextBox from './extensions/text-box'
import hr from './extensions/hr'
import Iframe from './extensions/iframe'
import Mathematics from '@tiptap-pro/extension-mathematics'

// 表格
import Table from './extensions/list/table'
import TableCell from './extensions/table-cell'
import TableHeader from './extensions/table-header'
import TableRow from '@tiptap/extension-table-row'

// 页面
import PageBreak from './extensions/page-break'
import Toc from './extensions/toc'
import InvisibleCharacters, {
  HardBreakNode,
  ParagraphNode,
} from '@tiptap-pro/extension-invisible-characters'
import InvisibleNode from './extensions/invisible-node'
// 分页
import Page from './extensions/page'
import { Document } from '@tiptap/extension-document'
// 其他
import Selection from './extensions/selection'
import TableOfContents from './extensions/table-of-contents'
import { getHierarchicalIndexes } from '@tiptap-pro/extension-table-of-contents'
import Typography from '@tiptap/extension-typography'
import CharacterCount from '@tiptap/extension-character-count'
import FileHandler from './extensions/file-handler'
import Dropcursor from '@tiptap/extension-dropcursor'

import shortId from '@/utils/short-id'
import { pagePlugin } from '@/components/editor/extensions/page/pagePlugn'

const {
  options,
  container,
  editor,
  page,
  painter,
  blockMenu,
  assistant,
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
    Page,
    /* Placeholder.configure({
      considerAnyAsEmpty: true,
      placeholder: l(options.value.document.placeholder),
    }),*/
    Focus.configure({
      className: 'node-focused',
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
        class: 'task-list',
      },
    }),
    LineHeight.configure({
      types: ['heading', 'paragraph'],
      defaultLineHeight,
    }),
    Margin,
    SearchReplace,
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
    PageBreak,
    /*
    InvisibleCharacters.configure({
      visible: page.value.showBreakMarks,
      builders: [new HardBreakNode(), new ParagraphNode(), new InvisibleNode()],
    }),
*/
    // 其他
    Selection,
    TableOfContents.configure({
      getIndex: getHierarchicalIndexes,
      onUpdate: (content) => {
        tableOfContents.value = content
      },
      scrollParent: () =>
        document.querySelector(`${container} .zoomable-container`),
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
  onUpdate({ editor }) {
    $document.value.content = editor.getHTML()
  },
})
setEditor(editorInstance)
/*setTimeout(() => {
  editor.value?.view.dispatch(editor.value?.state.tr.setMeta("splitPage", true));
}, 1000);*/

// 动态导入 katex 样式
onMounted(() => {
  const katexStyleElement = document.getElementById('katex-style')
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
window.onload = () => {
  editor.value?.registerPlugin(pagePlugin(editor.value, {}))
  setTimeout(() => {
    editor.value?.view.dispatch(
      editor.value?.state.tr.setMeta('splitPage', true),
    )
  }, 1000)
}
// 气泡菜单
let tippyInstance = $ref(null)
const tippyOpitons = $ref({
  appendTo: 'parent',
  maxWidth: 580,
  zIndex: 99,
  onShow(instance) {
    tippyInstance = instance
  },
  onHide() {
    assistant.value = false
  },
  onDestroy() {
    tippyInstance = null
  },
})

// AI 助手
watch(
  () => assistant.value,
  (visible) => {
    tippyInstance?.setProps({
      placement: visible ? 'bottom' : 'top',
    })
  },
)

// 销毁编辑器实例
onBeforeUnmount(() => editorInstance.destroy())
</script>

<style lang="less">
@import '@/assets/styles/editor.less';
@import '@/assets/styles/drager.less';

.umo-editor-bubble-menu {
  border-radius: var(--umo-radius);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  &:not(.assistant) {
    padding: 8px 10px;
    box-shadow: var(--umo-shadow);
    border: 1px solid var(--umo-border-color);
    background-color: var(--umo-color-white);
  }
  &:empty {
    display: none;
  }

  .menu-button.show-text .button-content .text {
    display: none !important;
  }
  .menu-button.huge {
    height: var(--td-comp-size-xs);
    min-width: unset;
    .button-content {
      min-width: unset !important;
      .icon {
        font-size: 16px;
        margin-top: 0;
      }
    }
  }
}
.umo-editor-block-menu {
  .menu-button {
    color: var(--umo-text-color-light) !important;
  }
}
</style>
