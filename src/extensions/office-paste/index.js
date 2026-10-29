import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { useConfirm, useMessage } from '@/composables/dialog'
import { t } from '@/composables/i18n'
import { createTimeSlicer, yieldToMain } from '@/utils/time-slice'

import {
  transformOfficeDocument,
  transformOfficeDocumentAsync,
} from './pipeline'
import {
  canStreamInsert,
  getParseBatches,
  streamInsert,
  streamInsertKey,
  streamInsertState,
} from './stream-insert'
import { transformExcel } from './transform/excel'
import { isOfficeHtml, isOfficeLikeClipboardData, isSheetHtml } from './utils'

// form https://www.npmjs.com/package/@intevation/tiptap-extension-office-paste

const PROGRESS_DELAY = 300

const showImageWarning = () => {
  const dialog = useConfirm({
    theme: 'warning',
    header: t('officePaste.dialog.title'),
    body: t('officePaste.dialog.body'),
    onConfirm: () => {
      dialog.destroy()
    },
  })
}

// 耗时较长时才显示提示，返回关闭函数
const showProgressLater = (editor) => {
  let message = null
  const timer = setTimeout(() => {
    message = useMessage('loading', {
      attach: editor.storage.container,
      content: t('officePaste.processing'),
      duration: 0,
    })
  }, PROGRESS_DELAY)
  return () => {
    clearTimeout(timer)
    message?.then((instance) => instance.close())
  }
}

const shouldHandleAsync = (view, html) => {
  const { $from } = view.state.selection
  return (
    view.editable &&
    !view.input.shiftKey &&
    !$from.parent.type.spec.code &&
    isOfficeHtml(html) &&
    !isSheetHtml(html)
  )
}

const createOfficePastePlugin = (editor) => {
  // 处理完成后交回 ProseMirror 粘贴时跳过本插件的转换
  let processed = false
  let pasteQueue = Promise.resolve()

  const pasteProcessedHtml = (view, html) => {
    processed = true
    try {
      view.pasteHTML(html)
    } finally {
      processed = false
    }
  }

  const pasteOfficeContent = async (view, event, html, rtf) => {
    const closeProgress = showProgressLater(editor)
    try {
      await yieldToMain()
      const slice = createTimeSlicer()
      const doc = new DOMParser().parseFromString(html, 'text/html')
      await slice()
      const hasImage = await transformOfficeDocumentAsync(doc, {
        rtf,
        placeholderText: t('officePaste.imagePlaceholder'),
        slice,
      })
      if (view.isDestroyed) {
        return
      }
      const batches = getParseBatches(doc)
      if (canStreamInsert(view, batches)) {
        const pasted = await streamInsert(view, doc, batches, slice)
        editor.emit('paste', { editor, event, slice: pasted })
      } else {
        pasteProcessedHtml(view, doc.body.innerHTML)
      }
      if (hasImage) {
        showImageWarning()
      }
    } catch (error) {
      console.error(error)
      useMessage('error', {
        attach: editor.storage.container,
        content: t('officePaste.failed'),
      })
    } finally {
      closeProgress()
    }
  }

  return new Plugin({
    key: new PluginKey('office-paste'),
    props: {
      // transformPastedHTML 在 handlePaste 之前同步执行，必须在此拦截才能避免阻塞页面
      handleDOMEvents: {
        paste(view, event) {
          const html = event.clipboardData?.getData('text/html') || ''
          if (!shouldHandleAsync(view, html)) {
            return false
          }
          // 剪贴板数据只在事件回调期间可读
          const rtf = event.clipboardData.getData('text/rtf')
          event.preventDefault()
          pasteQueue = pasteQueue.then(() =>
            pasteOfficeContent(view, event, html, rtf),
          )
          return true
        },
      },
      transformPastedHTML(html) {
        if (processed || !isOfficeHtml(html)) {
          return html
        }
        const doc = new DOMParser().parseFromString(html, 'text/html')
        transformOfficeDocument(doc, t('officePaste.imagePlaceholder'))
        return doc.documentElement.outerHTML
      },
      handlePaste(view, event) {
        if (processed) {
          return false
        }
        const clipboardData = event?.clipboardData
        const officeLike = isOfficeLikeClipboardData(clipboardData)
        const excelHandled = transformExcel(view, event)

        if (excelHandled) {
          if (event) {
            event.skipFileHandler = true
          }
          return true
        }

        if (event && officeLike) {
          // 标记给 file-handler：当前粘贴交由 office-paste/默认流程处理
          event.skipFileHandler = true
        }
        return false
      },
    },
  })
}

const createStreamInsertPlugin = () =>
  new Plugin({ key: streamInsertKey, state: streamInsertState })

export default Extension.create({
  priority: 99999,
  name: 'officePaste',
  addProseMirrorPlugins() {
    return [createOfficePastePlugin(this.editor), createStreamInsertPlugin()]
  },
})
