import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

// @tiptap-pro/extension-file-handler
const FileHandlePlugin = ({
  key,
  editor,
  onPaste,
  onDrop,
  allowedMimeTypes,
}) => {
  return new Plugin({
    key: key || new PluginKey('fileHandler'),
    props: {
      handleDrop(view, event) {
        const { dataTransfer } = event
        if (!onDrop) return
        if (!dataTransfer?.files?.length) return
        const pos = view.posAtCoords({
          left: event.clientX,
          top: event.clientY,
        })
        let files = Array.from(dataTransfer.files)
        if (allowedMimeTypes.length > 0) {
          files = files.filter((item) => {
            if (allowedMimeTypes.includes(item.type)) return true
            if (allowedMimeTypes.includes(`${item.type.split('/')[0]}/*`))
              return true
            return false
          })
        }
        if (files.length !== 0) {
          onDrop(editor, files, (pos === null ? undefined : pos.pos) || 0)
        }
        event.preventDefault()
        event.stopPropagation()
      },
      handlePaste(view, event) {
        const { clipboardData } = event
        if (!onPaste) return
        if (!clipboardData?.files?.length) return
        let files = Array.from(clipboardData.files)
        const html = clipboardData.getData('text/html')
        if (allowedMimeTypes.length > 0) {
          files = files.filter((item) => {
            if (allowedMimeTypes.includes(item.type)) return true
            if (allowedMimeTypes.includes(`${item.type.split('/')[0]}/*`))
              return true
            return false
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

const FileHandler = Extension.create({
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
export { FileHandlePlugin, FileHandler, FileHandler as default }
