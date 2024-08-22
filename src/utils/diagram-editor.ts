//@ts-nocheck
import i18n from '@/i18n'

const locales = {
  'zh-CN': 'zh',
  'en-US': 'en',
}

// https://www.diagrams.com/doc/faq/embed-mode
class DiagramEditor {
  constructor({ domain, params, container }) {
    this.domain = domain ?? this.domain
    this.params = Object.assign(params || {}, this.params)
    this.container = container
    this.handleuseMessageEvent = (evt) => {
      if (
        this.frame !== undefined &&
        evt.source === this.frame.contentWindow &&
        evt.data.length > 0
      ) {
        try {
          const msg = JSON.parse(evt.data)
          if (msg) {
            this.handleuseMessage(msg)
          }
        } catch (e) {
          console.error(e)
        }
      }
    }
  }

  domain = 'https://embed.diagrams.net'
  // https://www.drawio.com/doc/faq/supported-url-parameters
  params = {
    ui: 'atlas',
    proto: 'json',
    libraries: 1,
    configure: 1,
    noSaveBtn: 1,
  }
  xml = null
  format = 'xmlsvg'

  // 编辑元素
  edit(src) {
    let fmt = this.format
    if (src.substring(0, 15) === 'data:image/png;') {
      fmt = 'xmlpng'
    } else if (src.substring(0, 19) === 'data:image/svg+xml;') {
      fmt = 'xmlsvg'
    }
    this.startEditing(src, fmt)
    return this
  }

  // 创建 iframe
  createFrame() {
    const params = Object.keys(this.params)
      .map((key) => key + '=' + this.params[key])
      .join('&')
    const lang = locales[i18n.global.locale.value]
    const frame = document.createElement('iframe')
    frame.setAttribute('class', 'umo-diagrams-iframe')
    frame.setAttribute('src', `${this.domain}?${params}&lang=${lang}`)
    return frame
  }

  // diagrams页面和当前页面通信
  postMessage(msg) {
    if (this.frame) {
      this.frame.contentWindow.postMessage(JSON.stringify(msg), '*')
    }
  }
  handleuseMessage(msg) {
    if (msg.event === 'configure') {
      this.configureEditor()
    } else if (msg.event === 'init') {
      this.initializeEditor()
    } else if (msg.event === 'save') {
      this.export(msg.data)
      this.xml = msg.xml
      if (msg.exit) {
        msg.event = 'exit'
      } else {
        this.postMessage({
          action: 'status',
          messageKey: 'allChangesSaved',
          modified: false,
        })
      }
    }
    if (msg.event === 'exit') {
      if (this.format !== 'xml') {
        if (this.xml) {
          this.postMessage({
            action: 'export',
            format: this.format,
            xml: this.xml,
            spinKey: 'export',
          })
        }
      }
      this.stopEditing(msg)
    }
  }

  // 开始编辑
  startEditing(data, format) {
    if (!this.frame) {
      window.addEventListener('message', this.handleuseMessageEvent)
      this.format = format ?? this.format
      this.data = data
      this.frame = this.createFrame()
      const container = document.querySelector(this.container)
      container.appendChild(this.frame)
    }
  }

  // 停止编辑
  stopEditing() {
    window.removeEventListener('message', this.handleuseMessageEvent)
    this.frame = undefined
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
    this.postMessage({ action: 'configure', config: this.params.configure })
  }
  // 导出数据
  export(data) {
    return data
  }
}

export default DiagramEditor
