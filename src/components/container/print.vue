<template>
  <iframe ref="iframeRef" class="umo-print-iframe" :srcdoc="iframeCode" />
</template>

<script setup>
const container = inject('container')
const editor = inject('editor')
const printing = inject('printing')
const exportFile = inject('exportFile')
const page = inject('page')
const options = inject('options')

const iframeRef = $ref(null)
let iframeCode = $ref('')
const getStylesHtml = () => {
  return Array.from(document.querySelectorAll('link, style'))
    .map((item) => item.outerHTML)
    .join('')
}

const getPlyrSprite = () => {
  return document.querySelector('#sprite-plyr')?.innerHTML || ''
}

const getContentHtml = () => {
  const originalContent =
    document.querySelector(`${container} .umo-page-content`)?.outerHTML || ''
  return prepareEchartsForPrint(originalContent)
}
const prepareEchartsForPrint = (htmlContent) => {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = htmlContent

  const charts = tempDiv.querySelectorAll('.umo-node-echarts-body')
  for (const chartElement of charts) {
    const chartInstance = echarts.getInstanceByDom(chartElement)
    if (chartInstance) {
      const imgData = chartInstance.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#fff',
      })

      const imgElement = document.createElement('img')
      imgElement.src = imgData
      imgElement.style.width = '100%'

      if (chartElement && chartElement.parentNode) {
        chartElement.parentNode.replaceChild(imgElement, chartElement)
      }
    }
  }
  return tempDiv.innerHTML
}

const defaultLineHeight = $computed(
  () => options.value.dicts?.lineHeights.find((item) => item.default)?.value,
)

const getIframeCode = () => {
  const { orientation, size, margin, background } = page.value
  /* eslint-disable */
  return `
    <!DOCTYPE html>
    <html lang="en" theme-mode="${options.value.theme}">
    <head>
      <title>${options.value.document?.title}</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${getStylesHtml()}
      <style>
      html{
        margin: 0;
        padding: 0;
        overflow: visible;
      }
      body{
        margin: 0;
        padding: 0;
        background-color: ${background};
        -webkit-print-color-adjust: exact;
      }
      .umo-editor-container{
        background-color: ${background} !important;
      }
      .umo-page-content{
        transform: scale(1) !important;
        overflow: hidden;
      }
      @page {
        size: ${orientation === 'portrait' ? size?.width : size?.height}cm ${orientation === 'portrait' ? size?.height : size?.width}cm;
        padding: ${margin?.top}cm 0 ${margin?.bottom}cm;
        margin: 0;
        background-color: ${background};
      }
      @page:first {
        padding-top: 0;
      }
      @page:last {
        padding-bottom: 0;
        page-break-after: avoid;
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
      <script>
        document.addEventListener("DOMContentLoaded", (event) => {
          const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
              if (mutation.removedNodes) {
                Array.from(mutation.removedNodes).forEach(node => {
                  if (node?.classList?.contains('umo-page-watermark')) {
                    location.reload();
                  }
                });
              }
            });
          });
        });
      <\/script>
    </body>
    </html>`
  /* eslint-enable */
}

const printPage = () => {
  editor.value?.commands.blur()
  iframeCode = getIframeCode()

  const dialog = useConfirm({
    attach: container,
    theme: 'info',
    header: printing.value ? t('print.title') : t('export.pdf.title'),
    body: printing.value ? t('print.message') : t('export.pdf.message'),
    confirmBtn: printing.value ? t('print.confirm') : t('export.pdf.confirm'),
    onConfirm() {
      dialog.destroy()
      setTimeout(() => {
        if (iframeRef && iframeRef.contentWindow) {
          iframeRef.contentWindow.print()
        }
      }, 300)
    },
    onClosed() {
      printing.value = false
      exportFile.value.pdf = false
    },
  })
}

watch(
  () => [printing.value, exportFile.value.pdf],
  (value) => {
    if (!value[0] && !value[1]) {
      return
    }
    printPage()
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
