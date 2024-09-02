import { type Editor, Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

// @tiptap-pro/extension-file-handler

export interface FileHandlePluginOption {
  key: PluginKey
  editor: Editor
  onPaste: any
  onDrop: any
  allowedMimeTypes: string[]
}
const FileHandlePlugin = (option: FileHandlePluginOption) => {
  const { key, editor, onPaste, onDrop, allowedMimeTypes } = option
  return new Plugin({
    key: key || new PluginKey('fileHandler'),
    props: {
      handleDrop(view, event) {
        const { dataTransfer } = event
        if (!onDrop) {
          return
        }
        if (!dataTransfer?.files.length) {
          return
        }
        const pos = view.posAtCoords({
          left: event.clientX,
          top: event.clientY,
        })
        let files = Array.from(dataTransfer.files)
        if (allowedMimeTypes.length > 0) {
          files = files.filter((item) => {
            if (allowedMimeTypes.includes(item.type)) {
              return true
            }
            return allowedMimeTypes.includes(`${item.type.split('/')[0]}/*`)
          })
        }
        if (files.length !== 0) {
          onDrop(editor, files, (pos === null ? undefined : pos.pos) ?? 0)
        }
        event.preventDefault()
        event.stopPropagation()
      },
      handlePaste(view, event) {
        const { clipboardData } = event
        if (!onPaste) {
          return
        }
        if (!clipboardData?.files.length) {
          return
        }
        let files = Array.from(clipboardData.files)
        const html = clipboardData.getData('text/html')
        if (allowedMimeTypes.length > 0) {
          files = files.filter((item) => {
            if (allowedMimeTypes.includes(item.type)) {
              return true
            }
            return allowedMimeTypes.includes(`${item.type.split('/')[0]}/*`)
          })
        }
        if (files.length !== 0) {
          onPaste(editor, files, html)
        }
        event.preventDefault()
        event.stopPropagation()
      },
    },
  })
}
export interface FileHandlerOption {
  onPaste: any
  onDrop: any
  allowedMimeTypes: string[]
}
const FileHandler = Extension.create<FileHandlerOption>({
  name: 'fileHandler',
  addOptions: () => ({
    onPaste: undefined,
    onDrop: undefined,
    allowedMimeTypes: [],
  }),
  addProseMirrorPlugins() {
    return [
      FileHandlePlugin({
        key: new PluginKey(this.name),
        editor: this.editor,
        allowedMimeTypes: this.options.allowedMimeTypes,
        onDrop: this.options.onDrop,
        onPaste: this.options.onPaste,
      }),
    ]
  },
})
export { FileHandler as default, FileHandlePlugin, FileHandler }
