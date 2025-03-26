import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { ReplaceStep } from 'prosemirror-transform'

import { shortId } from '@/utils/short-id'

import NodeView from './node-view.vue'

const mimeTypes: any = {
  image: [
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

const getAccept = (type: string, accept: string[]) => {
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
    acceptArray = accept.filter((item: any) => mimeTypes[type].includes(item))
  } else {
    acceptArray = ['notAllow']
  }
  return acceptArray.length === 0 ? '' : acceptArray.toString()
}
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    setFile: {
      setFile: (options: any) => ReturnType
    }
    insertFile: {
      insertFile: (options: any) => ReturnType
    }
    selectFiles: {
      selectFiles: (
        type: string,
        container: string,
        autoType: boolean,
      ) => ReturnType
    }
  }
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
        ({ file, uploadFileMap, autoType, pos }) =>
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
          // 图片
          if (type.startsWith('image/') && mimeTypes.image.includes(type)) {
            previewType = 'image'
          }
          // 视频
          if (type.startsWith('video/') && mimeTypes.video.includes(type)) {
            previewType = 'video'
          }
          // 音频
          if (type.startsWith('audio/') && mimeTypes.audio.includes(type)) {
            previewType = 'audio'
          }
          // 插入节点
          const id = shortId(10)
          uploadFileMap.set(id, file)
          return commands.insertContentAt(position, {
            type: autoType ? previewType : 'file',
            attrs: {
              id,
              [previewType === 'file' ? 'url' : 'src']:
                URL.createObjectURL(file),
              name,
              type: type || 'unknown', // Ensure type is never null
              size,
              previewType,
            },
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
          // 打开文件对话框
          open()
          let bool = false
          // 插入文件
          onChange((fileList) => {
            const files = Array.from(fileList ?? [])
            for (const file of files) {
              bool = editor
                .chain()
                .focus()
                .insertFile({ file, uploadFileMap, autoType })
                .run()
            }
          })
          return bool
        },
    }
  },
  onTransaction({ editor, transaction }) {
    transaction.steps.forEach((step: any) => {
      if (step instanceof ReplaceStep && step.slice.size === 0) {
        // 使用事务前的文档状态来获取被删除的节点
        const deletedNodes = transaction.before.content.cut(step.from, step.to)
        const { options } = editor.storage
        deletedNodes.content.forEach((node: any) => {
          // 如果是文件节点，调用删除方法删除文件
          if (['image', 'video', 'audio', 'file'].includes(node.attrs.type)) {
            const { id, src, url } = node.attrs
            options.onFileDelete(id, src || url)
          }
        })
      }
    })
  },
})
