<template>
  <editor-content
    :spellcheck="options.document.enableSpellcheck && $document.spellcheck"
    class="editor-container"
    :class="{
      'show-line-number': page.showLineNumber,
    }"
    :editor="editor"
  />
  <template
    v-if="options.document.enableBubbleMenu && editor && !editorDestroyed"
  >
    <bubble-menu
      class="umo-editor-bubble-menu"
      :editor="editor"
      :tippy-options="{
        appendTo: 'parent',
        maxWidth: 480,
        zIndex: 99,
      }"
    >
      <editor-menus-bubble />
    </bubble-menu>
  </template>
  <template
    v-if="options.document.enableBlockMenu && editor && !editorDestroyed"
  >
    <block-menu
      :editor="editor"
      :tippy-options="{
        appendTo: 'parent',
        zIndex: 100,
        onCreate({ popper }) {
          popper.classList.add('umo-editor-block-menu')
        },
        onAfterUpdate({ props }) {
          updateBlockMenuStyle(props)
        },
      }"
      :should-show="() => true"
    >
      <editor-menus-block />
    </block-menu>
  </template>
</template>

<script setup>
import {
  Editor,
  EditorContent,
  BubbleMenu,
  FloatingMenu as BlockMenu,
} from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

// 基本
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
import TaskList from '@tiptap/extension-task-list'
import LineHeight from './extensions/line-height'
import SearchReplace from '@sereneinserenade/tiptap-search-and-replace'

// 插入
import Link from '@tiptap/extension-link'
import Image from './extensions/image'
import Video from './extensions/video'
import Audio from './extensions/audio'
import File from './extensions/file'
import CodeBlock from './extensions/code-block'
import TextBox from './extensions/text-box'
import HorizontalRule from './extensions/horizontal-rule'
import Iframe from './extensions/iframe'
import Mathematics from '@tiptap-pro/extension-mathematics'

// 表格
import Table from '@tiptap/extension-table'
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

// 其他
import Selection from './extensions/selection'
import {
  TableOfContents,
  getHierarchicalIndexes,
} from '@tiptap-pro/extension-table-of-contents'
import Typography from '@tiptap/extension-typography'
import CharacterCount from '@tiptap/extension-character-count'
import FileHandler from './extensions/file-handler'
import Dropcursor from '@tiptap/extension-dropcursor'

import generateId from '@/utils/generate-id'

const {
  container,
  options,
  page,
  editor,
  tableOfContents,
  setEditor,
  editorDestroyed,
} = useStore()
const $document = useState('document')

let enableRules = true
if (!options.value.document.enableMarkdown || !$document.value.markdown) {
  enableRules = [Image, Mathematics, Typography]
}

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
  },
  extensions: [
    StarterKit.configure({
      bold: false,
      bulletList: false,
      orderedList: false,
      codeBlock: false,
      horizontalRule: false,
      gapcursor: true,
      dropcursor: false,
    }),
    Placeholder.configure({
      considerAnyAsEmpty: true,
      placeholder: options.value.document.placeholder,
    }),
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
      defaultLineHeight: options.value.dicts.lineHeights.find(
        (item) => item.default,
      ).value,
    }),
    SearchReplace,

    Link,
    Image,
    Video,
    Audio,
    File,
    TextBox,
    CodeBlock,
    HorizontalRule,
    Iframe,
    Mathematics,

    // 表格
    Table.configure({
      resizable: true,
      allowTableNodeSelection: true,
    }),
    TableRow,
    TableHeader,
    TableCell,

    // 页面
    Toc,
    PageBreak,
    InvisibleCharacters.configure({
      visible: page.value.showBreakMarks,
      builders: [new HardBreakNode(), new ParagraphNode(), new InvisibleNode()],
    }),

    // 其他
    Selection,
    TableOfContents.configure({
      getIndex: getHierarchicalIndexes,
      onUpdate: (content) => (tableOfContents.value = content),
      scrollParent: document.querySelector(`${container} .toc-content`),
      getId: () => generateId(6),
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
        files.forEach((file) =>
          editor.chain().focus().insertFile({ file }).run(),
        )
      },
      onDrop: (editor, files, pos) => {
        files.forEach((file) =>
          editor.chain().focus().insertFile({ file, pos }).run(),
        )
      },
    }),
    Dropcursor.configure({
      color: 'var(--umo-primary-color)',
    }),
  ],
  onUpdate({ editor }) {
    $document.value.content = editor.getHTML()
  },
})
setEditor(editorInstance)

// 初始化块级菜单样式
const initBlockMenuStyle = () => {
  const blockMenuSyle = document.createElement('style')
  blockMenuSyle.setAttribute('data-block-menu-style', '')
  document.querySelector('head').appendChild(blockMenuSyle)
}
// 更新块级菜单样式
const updateBlockMenuStyle = (props) => {
  const { margin } = page.value
  if (!props.getReferenceClientRect) return
  const blockMenuSyle = document.querySelector('[data-block-menu-style]')
  const rect = props.getReferenceClientRect()
  const translateX = `translateX(${margin.left - 1}cm)`
  const translateY =
    rect.top > 0
      ? `translateY(calc(${rect.top - 69}px - ${margin.top}cm))`
      : `translateY(calc(${margin.top}cm - 2px))`
  blockMenuSyle.innerHTML = `.umo-editor-block-menu { transform: ${translateX} ${translateY} !important; }`
}
onMounted(() => initBlockMenuStyle())

// 销毁编辑器实例
onBeforeUnmount(() => editorInstance.destroy())
</script>

<style lang="less">
@import '@/assets/styles/editor.less';
@import '@/assets/styles/drager.less';

.umo-editor-bubble-menu {
  padding: 8px 10px;
  box-shadow: var(--umo-shadow);
  border: 0.5px solid var(--umo-border-color-dark);
  border-radius: var(--umo-radius);
  display: flex;
  align-items: center;
  background-color: var(--umo-color-white);
  flex-wrap: wrap;

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
