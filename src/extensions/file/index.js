import { mergeAttributes, Node } from '@tiptap/core'
import { Fragment } from '@tiptap/pm/model'
import { Selection } from '@tiptap/pm/state'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import { shortId } from '@/utils/short-id'

import NodeView from './node-view.vue'

export const fileMimeTypes = {
  image: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/apng',
  ],
  inlineImage: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/apng',
  ],
  video: ['video/mp4', 'video/mpeg', 'video/webm', 'video/ogg'],
  audio: [
    'audio/mp3',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/aac',
    'audio/flac',
  ],
}

export const resolveFileAccept = (type, accept = []) => {
  if (type === 'file' && accept.length === 0) {
    return ''
  }
  if (!type || !['image', 'video', 'audio', 'inlineImage'].includes(type)) {
    return accept.toString()
  }
  let acceptArray = [...accept]
  if (acceptArray.includes(`${type}/*`) || accept.length === 0) {
    acceptArray = fileMimeTypes[type]
  } else if (acceptArray.filter((item) => item.startsWith(type)).length > 0) {
    acceptArray = accept.filter((item) => fileMimeTypes[type].includes(item))
  } else {
    acceptArray = ['notAllow']
  }
  return acceptArray.length === 0 ? '' : acceptArray.toString()
}

const insertBatchContent = (editor, nodes = [], inline = false) => {
  const list = nodes.filter(Boolean)
  if (!editor || list.length === 0) {
    return false
  }
  const { state, view, chain } = editor
  if (inline || list.length === 1) {
    return chain().focus().insertContent(list).run()
  }
  const parsedNodes = list.map((node) => state.schema.nodeFromJSON(node))
  const content = Fragment.fromArray(parsedNodes)
  const { tr } = state
  let { from, to } = tr.selection
  const isOnlyBlockContent = parsedNodes.every((node) => node.isBlock)
  if (from === to && isOnlyBlockContent) {
    const { parent } = tr.doc.resolve(from)
    const isEmptyTextBlock =
      parent.isTextblock && !parent.type.spec.code && !parent.childCount
    if (isEmptyTextBlock) {
      from = Math.max(0, from - 1)
      to += 1
    }
  }
  tr.replaceWith(from, to, content)
  tr.setSelection(Selection.near(tr.doc.resolve(from + content.size), -1))
  view.dispatch(tr.scrollIntoView())
  return true
}

const createInsertFileNode = ({
  file,
  uploadFileMap,
  autoType,
  dimensions = {},
  editor,
}) => {
  const { type, name, size } = file
  const { options } = editor.storage
  const { maxSize } = options.file
  if (maxSize !== 0 && size > maxSize) {
    useMessage('error', {
      attach: editor.storage.container,
      content: t('file.limit', {
        filename: file.name,
        size: maxSize / 1024 / 1024,
      }),
    })
    return null
  }
  let previewType = 'file'
  if (type.startsWith('image/') && fileMimeTypes.image.includes(type)) {
    previewType = 'image'
  }
  if (type.startsWith('video/') && fileMimeTypes.video.includes(type)) {
    previewType = 'video'
  }
  if (type.startsWith('audio/') && fileMimeTypes.audio.includes(type)) {
    previewType = 'audio'
  }
  const id = shortId(10)
  uploadFileMap.set(id, file)

  let nodeData = {
    id,
    [previewType === 'file' ? 'url' : 'src']: URL.createObjectURL(file),
    name,
    type: type || 'unknown',
    size,
    previewType,
  }

  if (previewType === 'image') {
    const { width, height, inline } = dimensions
    if (width && width > 0) {
      nodeData = {
        ...nodeData,
        width,
      }
    }
    if (height && height > 0) {
      nodeData = {
        ...nodeData,
        height,
      }
    }
    if (inline) {
      previewType = 'inlineImage'
      nodeData = {
        ...nodeData,
        inline: true,
      }
    }
  }

  return {
    type: autoType ? previewType : 'file',
    attrs: nodeData,
  }
}

export default Node.create({
  name: 'file',
  group: 'block',
  atom: true,
  renderMarkdown: (node) => {
    const url = node?.attrs?.url
    const name = node?.attrs?.name
    if (!url) return name ? String(name) : ''
    const label = name ? `file: ${name}` : 'file'
    return `[${label}](${url})`
  },
  addAttributes() {
    return {
      vnode: {
        default: true,
      },
      file: {
        default: null,
      },
      id: {
        default: null,
      },
      url: {
        default: null,
      },
      name: {
        default: null,
      },
      type: {
        default: null,
      },
      size: {
        default: null,
      },
      uploaded: {
        default: false,
      },
      previewType: {
        default: null,
      },
      width: {
        default: null,
      },
      height: {
        default: 200,
      },
      fitWidth: {
        default: false,
      },
    }
  },
  parseHTML() {
    return [{ tag: 'file' }]
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'file',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ]
  },
  addNodeView() {
    return VueNodeViewRenderer(NodeView)
  },
  addCommands() {
    return {
      setFile:
        (options) =>
        ({ commands, editor }) => {
          return commands.insertContentAt(editor.state.selection.anchor, {
            type: this.name,
            attrs: options,
          })
        },
      insertFile:
        ({ file, uploadFileMap, autoType, pos, dimensions }) =>
        ({ editor, commands }) => {
          const node = createInsertFileNode({
            file,
            uploadFileMap,
            autoType,
            dimensions,
            editor,
          })
          if (!node) {
            return false
          }
          const position = pos || editor.state.selection.anchor
          return commands.insertContentAt(position, node)
        },
      selectFiles:
        (type, container = 'body', uploadFileMap, autoType = true) =>
        ({ editor }) => {
          const { options } = editor.storage
          const accept = resolveFileAccept(type, options.file.allowedMimeTypes)
          if ((!accept && accept !== '') || accept === 'notAllow') {
            const dialog = useAlert({
              attach: container,
              theme: 'danger',
              header: t('file.notAllow.title'),
              body: t('file.notAllow.message'),
              onConfirm() {
                dialog.destroy()
              },
            })
            return false
          }
          const { open, onChange } = useFileDialog({
            accept,
            multiple: true,
            reset: true,
          })
          // 打开文件对话框
          open()
          let bool = false
          // 插入文件
          onChange((fileList) => {
            const files = Array.from(fileList)
            const nodes = files
              .map((file) =>
                createInsertFileNode({
                  file,
                  uploadFileMap,
                  autoType,
                  dimensions: {
                    inline: type === 'inlineImage' ? true : false,
                  },
                  editor,
                }),
              )
              .filter(Boolean)
            if (nodes.length === 0) {
              return
            }
            bool = insertBatchContent(editor, nodes, type === 'inlineImage')
          })
          return bool
        },
    }
  },
})

export const updateAttributesWithoutHistory = (editor, attrs, pos) => {
  const { state, view } = editor

  if (typeof pos !== 'number') return

  const node = state.doc.nodeAt(pos)
  if (!node) return

  const tr = state.tr.setNodeMarkup(pos, undefined, {
    ...node.attrs,
    ...attrs,
  })

  tr.setMeta('addToHistory', false)
  view.dispatch(tr)
}
