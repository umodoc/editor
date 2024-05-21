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
import katex from 'katex'

const { container, options, page, printing } = useStore()
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

  // 获取页面内容并进行整理和清洗
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

  // 数学公式
  const mathematics = pageContent.querySelectorAll('.Tiptap-mathematics-editor')
  if (mathematics) {
    mathematics.forEach((item) => {
      const text = item.textContent
      if (text.length > 2) {
        item.classList.remove('Tiptap-mathematics-editor--hidden')
        item.setAttribute('style', '')
        item.innerHTML = katex.renderToString(text.slice(1, -1), {
          output: 'html',
        })
      }
    })
  }
  const mathRender = pageContent.querySelectorAll('.Tiptap-mathematics-render')
  if (mathRender) {
    mathRender.forEach((item) => item.parentNode.removeChild(item))
  }

  // 页面水印
  const watermark = document
    .querySelector('.umo-watermark')
    .lastChild.cloneNode(true)
  watermark.classList.add('page-watermark')

  // 页面属性
  const { orientation, size, margin, background } = page.value

  return `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <title>${$document.value.title}</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="${options.value.cdnUrl}/libs/paged.polyfill.min.js"><\/script>
      <link href="/dist/umd/style.css" rel="stylesheet" />
      <link href="${options.value.cdnUrl}/libs/katex/katex.min.css" rel="stylesheet" />
      <style>
      body {
        background-color: var(--umo-container-background);
        padding: 25px;
        box-sizing: border-box;
        margin: 0;
      }
      body.loading {
        overflow: hidden;
        position: relative;
        height: 100vh;
        padding: 0;
      }
      body.loading:after {
        content: '正在加载中...';
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #999;
        font-size: 12px;
        background-color: var(--umo-container-background);
        z-index: 9999;
      }
      body.printing {
        padding: 0;
      }

      /* 文档节点 */
      .umo-editor {
        position: relative;
        word-wrap: break-word;
        white-space: pre-wrap;
        white-space: break-spaces;
        -webkit-font-variant-ligatures: none;
        font-variant-ligatures: none;
        font-feature-settings: 'liga' 0;
      }
      .umo-editor > .is-empty,
      .ProseMirror-selectednode,
      .Tiptap-invisible-character,
      .node-view .uploading,
      .select-outline.file .file-action,
      .node-view .code-block .show-toolbar,
      .node-view .uploading,
      .selectedCell::after,
      .prism-code-editor .guide-indents,
      .prism-code-editor .active-line::after,
      .katex-mathml {
        display: none !important;
      }

      .hover-shadow {
        box-shadow: none !important;
      }
      .select-outline {
        outline: none !important;
      }
      .select-outline.code-block,
      .select-outline.iframe,
      .select-outline.toc,
      .select-outline.file,
      .select-outline.audio {
        outline: solid 1px var(--umo-content-node-border) !important;
      }

      .Tiptap-mathematics-editor {
        background: none !important;
      }

      .page-break {
        margin: 0 !important;
        height: 0 !important;
        overflow: hidden;
      }

      /* 打印样式 */
      .pagedjs_pages {
        display: flex;
        align-content: center;
        flex-wrap: wrap;
        flex-direction: column;
        gap: 15px;
      }

      @page {
        size: ${orientation === 'horizontal' ? size.width : size.height}cm ${orientation === 'horizontal' ? size.height : size.width}cm; 
          margin: ${margin.top}cm ${margin.right}cm ${margin.bottom}cm ${margin.left}cm; 
          background: ${background};
        box-shadow:
          rgba(0, 0, 0, 0.06) 0px 0px 10px 0px,
          rgba(0, 0, 0, 0.04) 0px 0px 0px 1px;
        pointer-events: none;
        @bottom-center {
          content: '第 ' counter(page) ' 页 / 共 ' counter(pages) ' 页';
          font-size: 12px;
          color: #999;
        }
      }

      body.printing .pagedjs_page {
        box-shadow: none !important;
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

// TODO: 代码缩进
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
