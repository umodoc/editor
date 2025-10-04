import { mergeAttributes, Node } from '@tiptap/core'
import { type Editor, VueNodeViewRenderer } from '@tiptap/vue-3'

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
          const position = pos ?? editor.state.selection.anchor
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
              type: type ?? 'unknown', // Ensure type is never null
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
    // 只有在文档内容发生变化时才处理
    if (!transaction.docChanged) return
    // 收集事务前的文件节点
    const beforeNodes: any[] = []
    transaction.before.descendants((node: any, pos: number) => {
      if (['image', 'video', 'audio', 'file'].includes(node?.type?.name)) {
        beforeNodes.push({ node, pos })
      }
    })
    // 无这一类的节点
    if (beforeNodes?.length === 0) {
      return
    }

    // 收集事务后的文件节点
    const afterNodes: any[] = []
    transaction.doc.descendants((node: any, pos: number) => {
      if (['image', 'video', 'audio', 'file'].includes(node?.type?.name)) {
        afterNodes.push({ node, pos })
      }
    })
    // 前后节点标识相同
    if (beforeNodes?.length === afterNodes?.length) {
      return
    }

    // 找出被删除的节点（在事务前存在但在事务后不存在的节点）
    const deletedNodes = beforeNodes.filter((beforeNode) => {
      // 检查节点是否在事务后仍然存在
      return !afterNodes.some((afterNode) => {
        // 通过ID来匹配节点，因为位置可能已经改变
        return (
          beforeNode.node.attrs.id &&
          afterNode.node.attrs.id &&
          beforeNode.node.attrs.id === afterNode.node.attrs.id
        )
      })
    })
    if (deletedNodes?.length === 0) {
      return
    }
    // 对每个被删除的节点调用删除回调
    deletedNodes.forEach(({ node }) => {
      const { id, src, url } = node.attrs
      const { onFileDelete } = editor.storage.options ?? {}
      if (onFileDelete && id) {
        onFileDelete(id, src ?? url)
      }
    })
  },
})

export const updateAttributesWithoutHistory = (
  editor: Editor,
  attrs: Record<string, any>,
  pos?: number,
) => {
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
