import SearchReplace from '@sereneinserenade/tiptap-search-and-replace'
import Bold from '@tiptap/extension-bold'
import CharacterCount from '@tiptap/extension-character-count'
import Color from '@tiptap/extension-color'
import Dropcursor from '@tiptap/extension-dropcursor'
import Focus from '@tiptap/extension-focus'
import FontFamily from '@tiptap/extension-font-family'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import TextColor from '@tiptap/extension-text-style'
import Typography from '@tiptap/extension-typography'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import type { Editor, Extension } from '@tiptap/vue-3'
import InvisibleCharacters, {
  HardBreakNode,
  ParagraphNode,
} from '@tiptap-pro/extension-invisible-characters'
import Mathematics from '@tiptap-pro/extension-mathematics'
import { getHierarchicalIndexes } from '@tiptap-pro/extension-table-of-contents'
import { TableOfContents } from '@tiptap-pro/extension-table-of-contents'

import { shortId } from '@/utils/short-id'

import Audio from './audio'
import Bookmark from './bookmark'
import BulletList from './bullet-list'
import CodeBlock from './code-block'
import File from './file'
import FileHandler from './file-handler'
import FontSize from './font-size'
import FormatPainter from './format-painter'
import hr from './hr'
import Iframe from './iframe'
import Image from './image'
import Indent from './indent'
import InvisibleNode from './invisible-node'
import LineHeight from './line-height'
import Margin from './margin'
import NodeAlign from './node-align'
import OrderedList from './ordered-list'
import PageBreak from './page-break'
import Selection from './selection'
import TableCell from './table-cell'
import TableHeader from './table-header'
import TextAlign from './text-align'
import TextBox from './text-box'
import Toc from './toc'
import Video from './video'

const { options, container, page, tableOfContents } = useStore()

const { dicts, document: doc, file } = options.value

export const extensions = [
  StarterKit.configure({
    bold: false,
    bulletList: false,
    orderedList: false,
    codeBlock: false,
    horizontalRule: false,
    dropcursor: false,
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
    defaultLineHeight: dicts.lineHeights.find((item: any) => item.default)
      .value,
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
    resizable: true,
  }),
  TableRow,
  TableHeader,
  TableCell,
  // 页面
  Toc,
  InvisibleCharacters.configure({
    visible: page.value.showBreakMarks,
    builders: [new HardBreakNode(), new ParagraphNode(), new InvisibleNode()],
  }),
  PageBreak,
  // 其他
  Selection,
  TableOfContents.configure({
    getIndex: getHierarchicalIndexes,
    onUpdate: (content) => {
      tableOfContents.value = content
    },
    scrollParent: () =>
      document.querySelector(
        `${container} .umo-zoomable-container`,
      ) as HTMLElement,
    getId: () => shortId(6),
  }),
  Typography.configure(doc.typographyRules),
  CharacterCount.configure({
    limit: doc.characterLimit !== 0 ? doc.characterLimit : undefined,
  }),
  FileHandler.configure({
    allowedMimeTypes: file.allowedMimeTypes,
    onPaste(editor: Editor, files: any) {
      for (const file of files) {
        editor.commands.insertFile({ file, autoType: true })
      }
    },
    onDrop: (editor: Editor, files: any, pos: number) => {
      for (const file of files) {
        editor.commands.insertFile({ file, autoType: true, pos })
      }
    },
  }),
  Dropcursor.configure({
    color: 'var(--umo-primary-color)',
  }),
  Bookmark.configure({
    class: 'umo-editor-bookmark',
  }),
]

export const inputAndPasteRules = () => {
  let enableRules: boolean | Extension[] = true
  const $document = useState('document')
  if (
    !options.value.document?.enableMarkdown ||
    !$document.value?.enableMarkdown
  ) {
    enableRules = [Mathematics, Typography, Image as Extension]
  }
  return enableRules
}
