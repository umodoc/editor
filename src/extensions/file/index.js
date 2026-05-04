import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import { shortId } from '@/utils/short-id'

import NodeView from './node-view.vue'

const mimeTypes = {
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

const getAccept = (type, accept) => {
  if (type === 'file' && accept.length === 0) {
    return ''
  }
  if (!type || !['image', 'video', 'audio', 'inlineImage'].includes(type)) {
    return accept.toString()
  }
  let acceptArray = [...accept]
  if (acceptArray.includes(`${type}/*`) || accept.length === 0) {
    acceptArray = mimeTypes[type]
  } else if (acceptArray.filter((item) => item.startsWith(type)).length > 0) {
    acceptArray = accept.filter((item) => mimeTypes[type].includes(item))
  } else {
    acceptArray = ['notAllow']
  }
  return acceptArray.length === 0 ? '' : acceptArray.toString()
}

export default Node.create({
  name: 'file',
  group: 'block',
  atom: true,
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
            return false
          }
          const position = pos || editor.state.selection.anchor
          let previewType = 'file'
          if (type.startsWith('image/') && mimeTypes.image.includes(type)) {
            previewType = 'image'
          }
          if (type.startsWith('video/') && mimeTypes.video.includes(type)) {
            previewType = 'video'
          }
          if (type.startsWith('audio/') && mimeTypes.audio.includes(type)) {
            previewType = 'audio'
          }
          const id = shortId(10)
          uploadFileMap.set(id, file)

          let nodeData = {
            id,
            [previewType === 'file' ? 'url' : 'src']: URL.createObjectURL(file),
            name,
            type: type || 'unknown', // Ensure type is never null
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
            // if (height && height > 0) {
            //   nodeData = {
            //     ...nodeData,
            //     height,
            //   }
            // }
            if (inline) {
              previewType = 'inlineImage'
              nodeData = {
                ...nodeData,
                inline: true,
              }
            }
          }
          return commands.insertContentAt(position, {
            type: autoType ? previewType : 'file',
            attrs: nodeData,
          })
        },
      selectFiles:
        (type, container = 'body', uploadFileMap, autoType = true) =>
        ({ editor }) => {
          const { options } = editor.storage
          const accept = getAccept(type, options.file.allowedMimeTypes)
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
            reset: true,
          })
          open()
          let bool = false
          onChange((fileList) => {
            const files = Array.from(fileList)
            for (const file of files) {
              bool = editor
                .chain()
                .focus()
                .insertFile({
                  file,
                  uploadFileMap,
                  autoType,
                  dimensions: { inline: type === 'inlineImage' ? true : false },
                })
                .run()
            }
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
