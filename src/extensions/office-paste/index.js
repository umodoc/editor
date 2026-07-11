import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { useConfirm } from '@/composables/dialog'
import { t } from '@/composables/i18n'

import { transformRemoveBookmarks } from './transform/bookmark'
import { transformExcel } from './transform/excel'
import { transformMsoHtmlClasses } from './transform/html-classes'
import { transformRemoveLineNumberWrapper } from './transform/line-number'
import { transformLists } from './transform/list'
import { transformToc } from './transform/toc'
import { transformMsoStyles } from './transform/style'
import {
  isOfficeHtml,
  isOfficeLikeClipboardData,
  replaceImageWithPlaceholderResult,
} from './utils'

// form https://www.npmjs.com/package/@intevation/tiptap-extension-office-paste

let cachedOfficePasteHtml = null
let cachedOfficePastePlaceholder = null
let cachedOfficePasteResult = null

const getOfficePasteResult = (html, imagePlaceholder) => {
  if (!isOfficeHtml(html)) {
    return {
      html,
      hasImage: false,
    }
  }

  if (
    cachedOfficePasteHtml === html &&
    cachedOfficePastePlaceholder === imagePlaceholder &&
    cachedOfficePasteResult
  ) {
    return cachedOfficePasteResult
  }

  let nextHtml = transformLists(html)
  nextHtml = transformRemoveBookmarks(nextHtml)
  nextHtml = transformMsoStyles(nextHtml)
  nextHtml = transformMsoHtmlClasses(nextHtml)
  nextHtml = transformRemoveLineNumberWrapper(nextHtml)
  nextHtml = transformToc(nextHtml)
  const { html: transformedHtml, replaced } = replaceImageWithPlaceholderResult(
    nextHtml,
    imagePlaceholder,
  )

  cachedOfficePasteHtml = html
  cachedOfficePastePlaceholder = imagePlaceholder
  cachedOfficePasteResult = {
    html: transformedHtml,
    hasImage: replaced,
  }

  return cachedOfficePasteResult
}

const createOfficePastePlugin = () =>
  new Plugin({
    key: new PluginKey('office-paste'),
    props: {
      transformPastedHTML(html) {
        if (!isOfficeHtml(html)) {
          return html
        }
        const imagePlaceholder = `<span style="color: var(--umo-error-color, #e34d59);">${t('officePaste.imagePlaceholder')}</span>`
        return getOfficePasteResult(html, imagePlaceholder).html
      },
      handlePaste(view, event) {
        const clipboardData = event?.clipboardData
        const html = clipboardData?.getData('text/html') || ''
        const officeLike = isOfficeLikeClipboardData(clipboardData)
        const excelHandled = transformExcel(view, event)

        if (excelHandled) {
          if (event) {
            event.skipFileHandler = true
          }
          return true
        }

        if (event && officeLike) {
          const imagePlaceholder = `<span style="color: var(--umo-error-color, #e34d59);">${t('officePaste.imagePlaceholder')}</span>`
          const { hasImage } = getOfficePasteResult(html, imagePlaceholder)
          if (hasImage) {
            const dialog = useConfirm({
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
        return false
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
