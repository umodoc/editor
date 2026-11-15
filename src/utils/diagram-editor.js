import { useI18n } from '@/composables/i18n'

const locales = {
  'zh-CN': 'zh',
  'en-US': 'en',
}

// https://www.diagrams.com/doc/faq/embed-mode
class DiagramEditor {
  constructor({ domain, params, container, onMessage }) {
    this.frame = undefined
    this.container = container
    this.domain = domain || 'https://embed.diagrams.net'
    this.onMessage = onMessage
    // https://www.drawio.com/doc/faq/supported-url-parameters
    this.params = {
      embed: 1,
      ui: 'atlas',
      proto: 'json',
      libraries: 1,
      configure: 1,
      noSaveBtn: 1,
      ...params,
    }
    this.xml = null
    this.format = 'xmlsvg'
    this.data = null
    this.exportPending = false
  }

  handleMessageEvent = (evt) => {
    if (
      !this.frame ||
      evt.source !== this.frame.contentWindow ||
      evt.origin !== this.origin ||
      typeof evt.data !== 'string'
    ) {
      return
    }
    let msg
    try {
      msg = JSON.parse(evt.data)
    } catch {
      return
    }
    if (msg?.event) {
      this.handleMessage(msg)
    }
  }

  // 编辑元素
  edit(src) {
    const fmt = src.startsWith('data:image/png;') ? 'xmlpng' : 'xmlsvg'
    this.startEditing(src, fmt)
    return this
  }

  // 创建 iframe
  createFrame() {
    const url = new URL(this.domain, document.baseURI)
    for (const [key, value] of Object.entries(this.params)) {
      const param = key === 'configure' && typeof value === 'object' ? 1 : value
      url.searchParams.set(key, param)
    }
    const { locale } = useI18n()
    url.searchParams.set('lang', locales[locale.value])
    this.origin = url.origin
    const frame = document.createElement('iframe')
    frame.setAttribute('class', 'umo-diagrams-iframe')
    frame.src = url.href
    return frame
  }

  // diagrams页面和当前页面通信
  postMessage(msg) {
    if (this.frame) {
      this.frame.contentWindow?.postMessage(JSON.stringify(msg), this.origin)
    }
  }

  handleMessage(msg) {
    if (msg.event === 'configure') {
      this.configureEditor()
    } else if (msg.event === 'init') {
      this.initializeEditor()
    } else if (msg.event === 'load') {
      this.onMessage(msg)
    } else if (msg.event === 'save') {
      if (typeof msg.xml !== 'string') return
      this.xml = msg.xml
      if (msg.exit) {
        this.finishEditing()
      } else {
        this.postMessage({
          action: 'status',
          messageKey: 'allChangesSaved',
          modified: false,
        })
      }
    } else if (msg.event === 'exit') {
      this.finishEditing()
    } else if (msg.event === 'export' && this.exportPending) {
      this.exportPending = false
      if (
        typeof msg.data === 'string' &&
        /^data:image\/(png|svg\+xml)[;,]/i.test(msg.data)
      ) {
        this.onMessage(msg)
      }
    }
  }

  finishEditing() {
    if (this.exportPending) return
    if (!this.xml) {
      this.onMessage({ event: 'exit' })
      return
    }
    this.exportPending = true
    this.postMessage({
      action: 'export',
      format: this.format,
      xml: this.xml,
      spinKey: 'export',
    })
  }

  // 开始编辑
  startEditing(data, format) {
    const container = document.querySelector(this.container)
    if (this.frame || !container) return
    this.format = format
    this.data = data
    this.frame = this.createFrame()
    window.addEventListener('message', this.handleMessageEvent)
    container.appendChild(this.frame)
  }

  // 停止编辑
  stopEditing() {
    window.removeEventListener('message', this.handleMessageEvent)
    this.frame?.remove()
    this.frame = undefined
    this.xml = null
    this.data = null
    this.exportPending = false
  }

  // 安装编辑器
  initializeEditor() {
    this.postMessage({
      action: 'load',
      autosave: 0,
      saveAndExit: '1',
      modified: 'unsavedChanges',
      xml: this.data,
    })
  }

  // 设置编辑器
  configureEditor() {
    const { configure } = this.params
    const config = configure && typeof configure === 'object' ? configure : {}
    this.postMessage({ action: 'configure', config })
  }
}

export default DiagramEditor
