import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { useConfirm } from '@/composables/dialog'
import { t } from '@/composables/i18n'

import { transformRemoveBookmarks } from './transform/bookmark'
import { transformExcel } from './transform/excel'
import { transformMsoHtmlClasses } from './transform/html-classes'
import { transformRemoveLineNumberWrapper } from './transform/line-number'
import { transformLists } from './transform/list'
import { transformMsoStyles } from './transform/style'
import {
  hasImageInPastePayload,
  isOfficeHtml,
  isOfficeLikeClipboardData,
  replaceImageWithPlaceholder,
} from './utils'

// form https://www.npmjs.com/package/@intevation/tiptap-extension-office-paste

const createOfficePastePlugin = () =>
  new Plugin({
    key: new PluginKey('office-paste'),
    props: {
      transformPastedHTML(html) {
        if (isOfficeHtml(html)) {
          const imagePlaceholder = `<span style="color: var(--umo-error-color, #e34d59);">${t('officePaste.imagePlaceholder')}</span>`
          html = transformLists(html)
          html = transformRemoveBookmarks(html)
          html = transformMsoStyles(html)
          html = transformMsoHtmlClasses(html)
          html = transformRemoveLineNumberWrapper(html)
          html = replaceImageWithPlaceholder(html, imagePlaceholder)
        }
        return html
      },
      handlePaste(view, event) {
        const clipboardData = event?.clipboardData
        const html = clipboardData?.getData('text/html') || ''
        const files = Array.from(clipboardData?.files || [])
        const officeLike = isOfficeLikeClipboardData(clipboardData)
        const hasImage = hasImageInPastePayload(files, html)

        if (event && officeLike) {
          if (hasImage) {
            const dialog = useConfirm({
              width: 400,
              theme: 'warning',
              header: t('officePaste.dialog.title'),
              body: t('officePaste.dialog.body'),
              onConfirm: () => {
                dialog.destroy()
              },
            })
          }
          // 标记给 file-handler：当前粘贴交由 office-paste/默认流程处理
          event.skipFileHandler = true
        }
        return transformExcel(view, event)
      },
    },
  })

export default Extension.create({
  priority: 99999,
  name: 'officePaste',
  addProseMirrorPlugins() {
    return [createOfficePastePlugin()]
  },
})
