import { Node, mergeAttributes } from '@tiptap/core'
import { vnodeViewRenderer } from '@tiptap/vue-3'
import NodeView from './node-view.vue'

const { options } = useStore()

const mimeTypes = {
  image: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/apng',
  ],
  video: ['video/mp4', 'video/webm', 'video/ogg'],
  audio: ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/flac'],
}

const getAccept = (type) => {
  const accept = options.value.file.allowedMimeTypes
  if (type === 'file' && accept.length === 0) {
    return ''
  }
  if (!type || !['image', 'video', 'audio'].includes(type)) {
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
      id: {
        default: null,
      },
      file: {
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
    return vnodeViewRenderer(NodeView)
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
        ({ file, pos }) =>
        ({ editor, commands }) => {
          const { type, name, size } = file
          const { maxSize } = options.value.file
          if (maxSize !== 0 && size > maxSize) {
            useMessage(
              'error',
              t('file.limit', {
                filename: file.name,
                size: maxSize / 1024 / 1024,
              }),
            )
            return
          }
          const position = pos || editor.state.selection.anchor
          let nodeType = 'file'
          // 图片
          if (type.startsWith('image/') && mimeTypes.image.includes(type)) {
            nodeType = 'image'
          }
          // 视频
          if (type.startsWith('video/') && mimeTypes.video.includes(type)) {
            nodeType = 'video'
          }
          // 音频
          if (type.startsWith('audio/') && mimeTypes.audio.includes(type)) {
            nodeType = 'audio'
          }
          // 插入节点
          commands.insertContentAt(position, {
            type: nodeType,
            attrs: {
              [nodeType === 'file' ? 'url' : 'src']: URL.createObjectURL(file),
              name,
              type,
              size,
              file,
            },
          })
        },
      selectFiles:
        (type) =>
        ({ editor }) => {
          const accept = getAccept(type)
          if ((!accept && accept !== '') || accept === 'notAllow') {
            const dialog = useAlert({
              theme: 'danger',
              header: t('file.notAllow.title'),
              body: t('file.notAllow.message'),
              placement: 'center',
              onConfirm() {
                dialog.destroy()
              },
            })
            return
          }
          const { open, onChange } = useFileDialog({
            accept,
            reset: true,
          })
          // 打开文件对话框
          open()
          // 插入文件
          onChange((fileList) => {
            const files = Array.from(fileList)
            if (!files) {
              return
            }
            files.forEach((file) => {
              editor.chain().focus().insertFile({ file }).run()
            })
          })
        },
    }
  },
})
