// @ts-nocheck

import Document from '@tiptap/extension-document'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from './placeholder'
import Focus from '@tiptap/extension-focus'

// 基本
import FormatPainter from './format-painter'
import FontFamily from '@tiptap/extension-font-family'
import FontSize from './font-size'
import Bold from '@tiptap/extension-bold'
import Underline from '@tiptap/extension-underline'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Color from '@tiptap/extension-color'
import TextColor from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import BulletList from './bullet-list'
import OrderedList from './ordered-list'
import Indent from './indent'
import TextAlign from './text-align'
import NodeAlign from './node-align'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from './list/tasklist'
import LineHeight from './line-height'
import Margin from './margin'
import SearchReplace from '@sereneinserenade/tiptap-search-and-replace'

// 插入
import Link from '@tiptap/extension-link'
import Image from './image'
import Video from './video'
import Audio from './audio'
import File from './file'
import CodeBlock from './code-block'
import TextBox from './text-box'
import hr from './hr'
import Iframe from './iframe'
import Mathematics from '@tiptap-pro/extension-mathematics'

// 表格
import Table from './list/table'
import TableCell from './table-cell'
import TableHeader from './table-header'
import TableRow from '@tiptap/extension-table-row'

// 页面
import Toc from './toc'

// 其他
import Selection from './selection'
import { TableOfContents } from '@tiptap-pro/extension-table-of-contents'
import { getHierarchicalIndexes } from '@tiptap-pro/extension-table-of-contents'
import Typography from '@tiptap/extension-typography'
import CharacterCount from '@tiptap/extension-character-count'
import FileHandler from './file-handler'
import Dropcursor from '@tiptap/extension-dropcursor'
import { ColorHighlighter } from './color-highlighter'
import shortId from '@/utils/short-id'

const { options, container, tableOfContents } = useStore()

const { dicts, document: doc, file } = options.value

export const extensions = [
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
  Placeholder.configure({
    placeholder: l(doc.placeholder),
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
    defaultLineHeight: dicts.lineHeights.find((item) => item.default).value,
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
  ColorHighlighter,
  hr,
  Iframe,
  Mathematics,

  // 表格
  Table.configure({
    allowTableNodeSelection: true,
    resizable: true,
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
  Typography.configure(doc.typographyRules),
  CharacterCount.configure({
    limit: doc.characterLimit !== 0 ? doc.characterLimit : undefined,
  }),
  FileHandler.configure({
    allowedMimeTypes: file.allowedMimeTypes,
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
]
