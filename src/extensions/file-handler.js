import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { isOfficeLikeClipboardData } from './office-paste/utils'

const FileHandlePlugin = (option) => {
  const { key, editor, onPaste, onDrop, allowedMimeTypes } = option
  return new Plugin({
    key: key || new PluginKey('file-handler'),
    props: {
      handleDrop(view, event) {
        const { dataTransfer } = event
        if (!onDrop) {
          return false
        }
        if (!dataTransfer?.files.length) {
          return false
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
          onDrop(editor, files, pos === null ? undefined : pos.pos)
          event.preventDefault()
          event.stopPropagation()
          return true
        }
        return false
      },
      handlePaste(_view, event) {
        const { clipboardData } = event
        if (event.skipFileHandler) {
          return false
        }
        if (isOfficeLikeClipboardData(clipboardData)) {
          return false
        }
        if (!onPaste) {
          return false
        }
        if (!clipboardData?.files.length) {
          return false
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
          event.preventDefault()
          event.stopPropagation()
          return true
        }
        return false
      },
    },
  })
}

export default Extension.create({
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
