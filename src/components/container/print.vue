<template>
  <t-dialog
    :visible="dialogVisible"
    :attach="container"
    :prevent-scroll-through="false"
    placement="center"
    confirmBtn="打印文档"
    cancelBtn="关闭预览"
    mode="full-screen"
    @confirm="printPage"
    @close="printing = false"
  >
    <template #header>
      <div class="preview-header">
        <div class="title">
          <icon name="print" />
          <span>打印预览</span>
        </div>
        <t-button
          size="small"
          variant="outline"
          theme="default"
          @click="pageOptionsVisible = true"
        >
          页面设置
        </t-button>
      </div>
    </template>
    <div class="preview-container">
      <iframe ref="iframeRef" :srcdoc="iframeCode" />
    </div>
  </t-dialog>
  <toolbar-page-options
    :visible="pageOptionsVisible"
    @close="pageOptionsVisible = false"
  />
</template>

<script setup>
const { container, editor, page, printing } = useStore()
const $document = useState('document')
let dialogVisible = $ref(false)
let pageOptionsVisible = $ref(false)

watch(
  () => printing.value,
  (val) => {
    dialogVisible = val
  },
)
watch(
  () => pageOptionsVisible,
  (val) => {
    if (!val) {
      iframeCode = getIframeCode()
      iframeRef.contentWindow.location.reload()
    }
  },
)

let iframeRef = $ref(null)
let iframeCode = $ref('')

const getIframeCode = () => {
  if (!dialogVisible) return ''
  editor.value.commands.blur()
  let pageContent = document
    .querySelector(`${container} .umo-editor`)
    .cloneNode(true)
  pageContent.childNodes.forEach((item) => {
    const classes = item.classList
    if (classes.contains('ProseMirror-selectednode')) {
      classes.remove('ProseMirror-selectednode')
    }
    if (classes.contains('image-node-view')) {
      if (item.querySelector('.es-drager img')) {
        item.querySelector('.es-drager').innerHTML =
          item.querySelector('.es-drager img').outerHTML
      }
    }
    if (classes.contains('text-box-node-view')) {
      if (item.querySelector('.es-drager .content')) {
        console.log(item.querySelector('.es-drager .content').outerHTML)
        item.querySelector('.es-drager').innerHTML = item.querySelector(
          '.es-drager .content',
        ).outerHTML
      }
    }
    if (classes.contains('iframe-node-view')) {
      if (item.querySelector('.es-drager iframe')) {
        console.log(item.querySelector('.es-drager iframe').outerHTML)
        item.querySelector('.es-drager').innerHTML =
          item.querySelector('.es-drager iframe').outerHTML
      }
    }
    // if (classes.contains('code-block-node-view')) {
    //   // 在 item 中查找 textarea
    //    item.innerHTML = item.querySelector('textarea').value
    // }
    if (classes.contains('page-break')) {
      item.innerHTML =
        '<div class="page-break"></div><div class="page-break"></div>'
    }
  })
  const { orientation, size, margin, background } = page.value
  const watermark = document
    .querySelector('.umo-watermark')
    .lastChild.cloneNode(true)
  watermark.classList.add('page-watermark')
  return `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <title>${$document.value.title}</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="/libs/paged.polyfill.min.js"><\/script>
      <script src="/libs/katex/katex.min.js"><\/script>
      <link rel="stylesheet" href="/libs/katex/katex.min.css" />
      <link href="/dist/umd/style.css?v=${new Date().getTime()}" rel="stylesheet" />
      <link href="/print.css" rel="stylesheet" />
      <style>
        @page {
          size: ${orientation === 'horizontal' ? size.width : size.height}cm ${orientation === 'horizontal' ? size.height : size.width}cm; 
          margin: ${margin.top}cm ${margin.right}cm ${margin.bottom}cm ${margin.left}cm; 
          background: ${background};
        }
      </style>
      <script>
      class Handler extends Paged.Handler {
        afterPreview() {
          document.querySelector('body').classList.remove('loading');
          const pages = document.querySelectorAll('.pagedjs_pagebox');
          const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
              if (mutation.removedNodes) {
                Array.from(mutation.removedNodes).forEach(node => {
                  if (node?.classList?.contains('page-watermark')) {
                    location.reload();
                  }
                });
              }
            });
          });
          const config = { childList: true, subtree: true };
          pages.forEach(page => {
            page.insertAdjacentHTML('beforeend', '${watermark.outerHTML}')
            observer.observe(page, config);
          });
        }
      }
      Paged.registerHandlers(Handler);

      window.onbeforeprint = function () {
        document.querySelector('body').classList.add('printing');
      }
      window.onafterprint = function () {
        document.querySelector('body').classList.remove('printing');
      }
      <\/script>
    </head>
    <body class="umo-editor-container umo-scrollbar loading">
      <div id="sprite-plyr" style="display: none;">
        ${document.querySelector('#sprite-plyr')?.innerHTML || ''}
      </div>
      <div class="editor-container">
        ${pageContent.outerHTML}
      </div>
    </body>
    </html>`
}

// TODO: 代码缩进、数学公式
watch(
  () => dialogVisible,
  () => {
    iframeCode = getIframeCode()
  },
)

const printPage = () => {
  iframeRef.contentWindow.print()
}
</script>

<style lang="less" scoped>
.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  .title {
    display: flex;
    align-items: center;
    :deep(.icon) {
      margin-right: 8px;
      font-size: 24px;
    }
  }
}
.preview-container {
  height: 100%;
  background-color: var(--umo-container-background);
  iframe {
    height: 100%;
    width: 100%;
    border: none;
    display: block;
  }
}
</style>
