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
    @closed="iframeLoading = true"
  >
    <template #header>
      <div class="preview-header">
        <div class="title">
          <icon name="print" />
          <span>打印预览</span>
        </div>
        <div class="actions">
          <t-button
            size="small"
            variant="outline"
            theme="default"
            @click="pageOptionsVisible = true"
          >
            页面设置
          </t-button>
          <t-popup trigger="click" placement="bottom-right">
            <t-button size="small" variant="outline" theme="default">
              打印设置
            </t-button>
            <template #content>
              <div class="preview-options">
                <t-checkbox v-model="$print.singleColumn"
                  >单列显示页面</t-checkbox
                >
                <t-checkbox v-model="$print.showPageNumber"
                  >打印时包含页码</t-checkbox
                >
              </div>
            </template>
          </t-popup>
        </div>
      </div>
    </template>
    <div class="preview-container">
      <t-loading :loading="iframeLoading" text="加载中..." size="small">
        <iframe ref="iframeRef" :srcdoc="iframeCode" @load="iframeLoaded" />
      </t-loading>
    </div>
  </t-dialog>
  <page-options
    :visible="pageOptionsVisible"
    @close="pageOptionsVisible = false"
  />
</template>

<script setup>
import Katex from 'katex'
import Prism from 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-css-extras'
import 'prismjs/components/prism-ini'
import 'prismjs/components/prism-kotlin'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-r'
import 'prismjs/components/prism-basic'
import 'prismjs/components/prism-vbnet'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-opencl'
import 'prismjs/components/prism-diff'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-less'
import 'prismjs/components/prism-objectivec'
import 'prismjs/components/prism-ruby'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-wasm'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-js-templates'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-lua'
import 'prismjs/components/prism-perl'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-rust'
import 'prismjs/components/prism-swift'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-csharp'
import 'prismjs/components/prism-graphql'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-makefile'
import 'prismjs/components/prism-scss'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-regex'

const { container, options, page, printing } = useStore()
const $document = useState('document')
const $print = useState('print')
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
watch(
  () => $print.value,
  () => {
    iframeCode = getIframeCode()
    iframeRef.contentWindow.location.reload()
  },
  { deep: true },
)

let iframeRef = $ref(null)
let iframeCode = $ref('')
let iframeLoading = $ref(true)
const iframeLoaded = () => {
  setTimeout(() => {
    iframeLoading = false
  }, 1000)
}

const getIframeCode = () => {
  if (!dialogVisible) return ''

  // 获取页面内容并进行清洗和加工
  let pageContent = document
    .querySelector(`${container} .umo-editor`)
    .cloneNode(true)
  pageContent.childNodes.forEach((item) => {
    const classes = item.classList
    // 移除选中样式
    if (classes.contains('ProseMirror-selectednode')) {
      classes.remove('ProseMirror-selectednode')
    }
    // 图片
    if (classes.contains('image-node-view')) {
      if (item.querySelector('.es-drager img')) {
        item.querySelector('.es-drager').innerHTML =
          item.querySelector('.es-drager img').outerHTML
      }
    }
    // 文本框
    if (classes.contains('text-box-node-view')) {
      if (item.querySelector('.es-drager .content')) {
        console.log(item.querySelector('.es-drager .content').outerHTML)
        item.querySelector('.es-drager').innerHTML = item.querySelector(
          '.es-drager .content',
        ).outerHTML
      }
    }
    // Iframe
    if (classes.contains('iframe-node-view')) {
      if (item.querySelector('.es-drager iframe')) {
        item.querySelector('.es-drager').innerHTML =
          item.querySelector('.es-drager iframe').outerHTML
      }
    }
    // 代码块
    if (classes.contains('code-block-node-view')) {
      item.querySelector('.prism-code-editor').innerHTML =
        `<pre>${item.querySelector('textarea').value}</pre>`
      Prism.highlightElement(item.querySelector('pre'))
    }
    // 分页符
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
        item.innerHTML = Katex.renderToString(text.slice(1, -1), {
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
      <link href="${options.value.cdnUrl}/libs/umo-editor/style.css" rel="stylesheet" />
      <link href="${options.value.cdnUrl}/libs/katex/katex.min.css" rel="stylesheet" />
      <style>
      body {
        background-color: var(--umo-container-background);
        padding: 25px;
        box-sizing: border-box;
        margin: 0;
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
      .katex-mathml,
      .block-menu-hander,
      .error-icon,
      [data-tippy-root] {
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

      .prism-code-editor {
        padding: 0.8em;
        display: block;
        max-height: unset!important;
      }
      .prism-code-editor pre{
        white-space: pre-wrap;
        white-space: break-spaces;
      }
      

      /* 打印样式 */
      .pagedjs_pages {
        display: flex;
        align-content: center;
        justify-content: center;
        flex-wrap: wrap;
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
      body.printing:not(.show-page-number) .pagedjs_margin-content {
        display: none !important;
      }
      body.single-column .pagedjs_pages{
        flex-direction: column;
      }
      </style>
      <script>
      class Handler extends Paged.Handler {
        afterPreview() {
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
    <body class="umo-editor-container umo-scrollbar ${$print.value.singleColumn ? 'single-column' : ''} ${$print.value.showPageNumber ? 'show-page-number' : ''}">
      <div id="sprite-plyr" style="display: none;">
        ${document.querySelector('#sprite-plyr')?.innerHTML || ''}
      </div>
      <div class="editor-container">
        ${pageContent.outerHTML}
      </div>
    </body>
    </html>`
}

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
  .actions {
    display: flex;
    gap: 5px;
  }
}
.preview-options {
  padding: 10px 15px;
  > * {
    display: block;
    &:not(:last-child) {
      margin-bottom: 6px;
    }
  }
}
.preview-container {
  height: 100%;
  :deep(.umo-loading__parent) {
    height: 100%;
    background-color: var(--umo-container-background);
    .umo-loading {
      background-color: var(--umo-container-background);
    }
  }
  iframe {
    height: 100%;
    width: 100%;
    border: none;
    display: block;
  }
}
</style>
