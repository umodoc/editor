<template>
  <iframe ref="iframeRef" class="umo-print-iframe" :srcdoc="iframeCode" />
</template>

<script setup lang="ts">
const { container, options, editor, page, printing, exportPDF } = useStore()

const iframeRef = $ref<HTMLIFrameElement | null>(null)
let iframeCode = $ref('')
const getStylesHtml = () => {
  return Array.from(document.querySelectorAll('link, style'))
    .map((item) => item.outerHTML)
    .join('')
}

const getPlyrSprite = () => {
  return document.querySelector('#sprite-plyr')?.innerHTML ?? ''
}

const getContentHtml = () => {
  return Array.from(
    document.querySelectorAll(`${container} .umo-page-node-view`),
  )
    .map((page) => page.outerHTML)
    .join('')
}

const defaultLineHeight = $computed(() => {
  return (
    options.value.dicts?.lineHeights.find(
      (item: { default: any }) => item.default,
    )?.value ?? '1.5'
  )
})

const getIframeCode = () => {
  const { orientation, size, background } = page.value
  return `
    <!DOCTYPE html>
    <html lang="zh-CN" theme-mode="${options.value.theme}">
    <head>
      <title>${options.value.document?.title}</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${getStylesHtml()}
      <style>
      body{
        overflow: auto;
        height: auto;
      }
      @page {
        size: ${(orientation === 'portrait' ? size?.width : size?.height) ?? '1'}cm ${(orientation === 'portrait' ? size?.height : size?.width) ?? '1'}cm; 
        margin:0;
        background: ${background};
      }
      </style>
    </head>
    <body class="is-print">
      <div id="sprite-plyr" style="display: none;">
      ${getPlyrSprite()}
      </div>
      <div class="umo-editor-container" style="line-height: ${defaultLineHeight};" aria-expanded="false">
        <div class="tiptap umo-editor" translate="no">
          ${getContentHtml()}
        </div>
      </div>
    </body>
    </html>`
}

const printPage = () => {
  editor.value?.commands.blur()
  iframeCode = getIframeCode()

  const dialog = useConfirm({
    theme: 'info',
    header: printing.value ? t('print.title') : t('export.pdf.title'),
    body: printing.value ? t('print.message') : t('export.pdf.message'),
    confirmBtn: printing.value ? t('print.confirm') : t('export.pdf.confirm'),
    onConfirm() {
      dialog.destroy()
      setTimeout(() => {
        iframeRef?.contentWindow?.print()
      }, 300)
    },
    onClosed() {
      printing.value = false
      exportPDF.value = false
    },
  })
}

watch(
  () => [printing.value, exportPDF.value],
  (value: any[]) => {
    if (value[0] || value[1]) {
      printPage()
    }
  },
)
</script>

<style lang="less" scoped>
.umo-print-iframe {
  position: absolute;
  width: 0;
  height: 0;
  border: none;
  overflow: auto;
}
</style>
