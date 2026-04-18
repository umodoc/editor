import Bold from '@tiptap/extension-bold'
import {
  Details,
  DetailsContent,
  DetailsSummary,
} from '@tiptap/extension-details'
import Document from '@tiptap/extension-document'
import Link from '@tiptap/extension-link'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import Mathematics from '@tiptap/extension-mathematics'
import NodeRange from '@tiptap/extension-node-range'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import { getHierarchicalIndexes } from '@tiptap/extension-table-of-contents'
import { TableOfContents } from '@tiptap/extension-table-of-contents'
import { TextStyleKit } from '@tiptap/extension-text-style'
import Typography from '@tiptap/extension-typography'
import UniqueID from '@tiptap/extension-unique-id'
import {
  CharacterCount,
  Dropcursor,
  Focus,
  TrailingNode,
  Placeholder,
  UndoRedo,
} from '@tiptap/extensions'
import StarterKit from '@tiptap/starter-kit'

import { l } from '@/composables/i18n'
import { useState } from '@/composables/state'
import { getImageDimensions } from '@/utils/file'
import { shortId } from '@/utils/short-id'

import Audio from './audio'
import Bookmark from './bookmark'
import BreakMarks from './break-marks'
import BulletList from './bullet-list'
import Callout from './callout'
import CodeBlock from './code-block'
import Columns from './columns'
import Datetime from './datetime'
import Echarts from './echarts'
import File from './file'
import FileHandler from './file-handler'
import { Footnote, FootnoteReference, Footnotes } from './foonotes'
import FormatPainter from './format-painter'
import HorizontalRule from './horizontal-rule'
import Iframe from './iframe'
import { BlockImage, InlineImage } from './image'
import Indent from './indent'
import LetterSpacing from './letter-spacing'
import LineHeight from './line-height'
import Margin from './margin'
import Mention from './mention'
import getUsersSuggestion from './mention/suggestion'
import NodeAlign from './node-align'
import NodeSelect from './node-select'
import OfficePaste from './office-paste'
import OptionBox from './option-box'
import OrderedList from './ordered-list'
import PageBreak from './page-break'
import SearchReplace from './search-replace'
import Selection from './selection'
import { Table, TableCell, TableHeader, TableRow } from './table'
import Tag from './tag'
import TextAlign from './text-align'
import TextBox from './text-box'
import Toc from './toc'
import TypeWriter from './type-writer'
import Video from './video'
import WordWrap from './word-wrap'

const nodeTypes = [
  'paragraph',
  'heading',
  'blockquote',
  'codeBlock',
  'hardBreak',
  'horizontalRule',
  'bulletList',
  'orderedList',
  'listItem',
  'taskList',
  'taskItem',
  'details',
  'detailsSummary',
  'detailsContent',
  'table',
  'tableRow',
  'tableHeader',
  'tableCell',
  'image',
  'inlineImage',
  'video',
  'audio',
  'file',
  'callout',
  'column',
  'columnBlock',
  'textBox',
  'datetime',
  'optionBox',
  'iframe',
  'echarts',
  'toc',
  'tag',
  'pageBreak',
  'mention',
  'blockMath',
  'inlineMath',
]

export const getDefaultExtensions = ({ container, options, uploadFileMap }) => {
  const { page, document: doc, users, file, disableExtensions } = options.value
  const isTitleBodyStructure =
    String(doc?.structure || '').trim() === 'heading block*'

  const extensions = {
    'ordered-list': OrderedList,
    'bullet-list': BulletList,
    'task-list': TaskList.configure({
      HTMLAttributes: {
        class: 'umo-task-list',
      },
    }),
    margin: Margin,
    link: Link.configure({
      openOnClick: false,
      enableClickSelection: true,
    }),
    image: BlockImage,
    inlineImage: InlineImage,
    video: Video,
    audio: Audio,
    'code-block': CodeBlock,
    symbol: Symbol,
    math: Mathematics.configure({
      katex: { throwOnError: false },
    }),
    tag: Tag,
    columns: Columns,
    callout: Callout,
    mention: Mention.configure({
      suggestion: getUsersSuggestion(users, container),
    }),
    'date-time': Datetime,
    'option-box': OptionBox,
    bookmark: Bookmark,
    footnote: [Footnotes, FootnoteReference, Footnote],
    'hard-break': BreakMarks.configure({
      visible: page?.showBreakMarks,
    }),
    'horizontal-rule': HorizontalRule,
    toc: Toc,
    'text-box': TextBox,
    'web-page': Iframe,
  }

  const buildInExtensions = [
    StarterKit.configure({
      document: false,
      bold: false,
      codeBlock: false,
      horizontalRule: false,
      undoRedo: false,
      link: false,
      placeholder: false,
      dropcursor: false,
      selection: false,
      bulletList: false,
      orderedList: false,
      trailingNode: false,
      listKeymap: true,
    }),
    Document.extend({
      content: disableExtensions.includes('footnote')
        ? doc.structure
        : `${doc.structure} footnotes?`,
    }),
    TextStyleKit.configure({
      lineHeight: false,
    }),
    UndoRedo.extend({
      addKeyboardShortcuts() {
        // 返回空对象表示移除所有默认快捷键
        return {}
      },
    }),
    Focus.configure({
      className: 'umo-node-focused',
      mode: 'all',
    }),
    TrailingNode.configure({
      node: 'paragraph',
    }),
    Placeholder.configure({
      showOnlyCurrent: false,
      placeholder: ({ node, pos }) => {
        if (isTitleBodyStructure && node.type.name === 'heading') {
          return pos === 0 ? t('document.headingPlaceholder') : ''
        }
        return String(l(doc?.placeholder || ''))
      },
    }),
    FormatPainter,
    WordWrap,
    Bold.extend({
      renderHTML: ({ HTMLAttributes }) => ['b', HTMLAttributes, 0],
    }),
    Subscript,
    Superscript,
    Indent,
    TextAlign,
    NodeAlign,
    LetterSpacing,
    TaskItem.configure({ nested: true }),
    LineHeight,
    SearchReplace,

    // 插入
    File,
    Details.configure({
      HTMLAttributes: {
        class: 'umo-node-details',
      },
    }),
    DetailsContent.configure({
      HTMLAttributes: {
        class: 'umo-node-details-content',
      },
    }),
    DetailsSummary.configure({
      HTMLAttributes: {
        class: 'umo-node-details-summary',
      },
    }),

    // 表格
    Table,
    TableRow,
    TableCell,
    TableHeader,

    // 工具
    Echarts,

    // 页面
    PageBreak,

    // 其他
    Selection,
    NodeRange,
    NodeSelect,
    TableOfContents.configure({
      getIndex: getHierarchicalIndexes,
      scrollParent: () =>
        document.querySelector(`${container} .umo-zoomable-container`),
      getId: () => shortId(10),
    }),
    Typography.configure(doc?.typographyRules),
    CharacterCount.configure({
      limit: doc?.characterLimit !== 0 ? doc?.characterLimit : undefined,
    }),
    FileHandler.configure({
      allowedMimeTypes: file?.allowedMimeTypes,
      async onPaste(editor, files) {
        // 记录 已有位置
        const pageContainer = document.querySelector(
          `${container} .umo-zoomable-container`,
        )
        const scrollTop = pageContainer?.scrollTop || 0
        for (const file of files) {
          const dimensions = await getImageDimensions(file)
          editor.commands.insertFile({
            file,
            uploadFileMap: uploadFileMap.value,
            autoType: true,
            dimensions,
          })
        }
        // 恢复滚动位置
        if (pageContainer) {
          // 使用 setTimeout 确保 DOM 更新完成后再恢复滚动位置
          setTimeout(() => {
            pageContainer.scrollTop = scrollTop
          }, 0)
        }
      },
      async onDrop(editor, files, pos) {
        for (const file of files) {
          const dimensions = await getImageDimensions(file)
          editor.commands.insertFile({
            file,
            uploadFileMap: uploadFileMap.value,
            autoType: true,
            pos,
            dimensions,
          })
        }
      },
    }),
    Dropcursor.configure({
      color: 'var(--umo-primary-color)',
    }),
    TypeWriter,
    OfficePaste,
  ]

  // 合并扩展
  Object.values(extensions).forEach((item) => {
    if (!disableExtensions?.includes(item.name)) {
      if (Array.isArray(item)) {
        buildInExtensions.push(...item)
        return
      }
      buildInExtensions.push(item)
    }
  })

  if (doc?.enableNodeId) {
    buildInExtensions.push(
      UniqueID.configure({
        types: nodeTypes,
        generateID: () => shortId(10),
      }),
    )
  }

  return buildInExtensions
}

export const inputAndPasteRules = (options) => {
  let enableRules = true
  const $document = useState('document', options)
  if (
    !options.value.document?.enableMarkdown ||
    !$document.value?.enableMarkdown
  ) {
    enableRules = [Mathematics, Typography, BlockImage]
  }
  return enableRules
}
