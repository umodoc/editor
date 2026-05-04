// https://www.diagrams.com/doc/faq/embed-mode
class DiagramEditor {
  constructor({ domain, params, container }) {
    this.frame = undefined
    this.container = container
    this.domain = 'https://embed.diagrams.net'
    // https://www.drawio.com/doc/faq/supported-url-parameters
    this.params = {
      ui: 'atlas',
      proto: 'json',
      libraries: 1,
      configure: 1,
      noSaveBtn: 1,
    }
    this.xml = null
    this.format = 'xmlsvg'
    this.data = null

    this.domain = domain || this.domain
    this.params = { ...this.params, ...params }
    this.container = container
  }

  handleMessageEvent = (evt) => {
    if (
      this.frame !== undefined &&
      evt.source === this.frame.contentWindow &&
      evt.data.length > 0
    ) {
      try {
        const msg = JSON.parse(evt.data)
        if (msg) {
          this.handleMessage(msg)
        }
      } catch (e) {
        console.error(e)
      }
    }
  }

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

  createFrame() {
    const params = Object.keys(this.params)
      .map((key) => `${key}=${this.params[key]}`)
      .join('&')
    const frame = document.createElement('iframe')
    frame.setAttribute('class', 'umo-diagrams-iframe')
    frame.setAttribute('src', `${this.domain}?${params}&lang=en`)
    return frame
  }

  postMessage(msg) {
    if (this.frame) {
      this.frame.contentWindow?.postMessage(JSON.stringify(msg), '*')
    }
  }

  handleMessage(msg) {
    if (msg.event === 'configure') {
      this.configureEditor()
    } else if (msg.event === 'init') {
      this.initializeEditor()
    } else if (msg.event === 'save') {
      this.exportData(msg.data)
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
      this.stopEditing()
    }
  }

  startEditing(data, format) {
    if (!this.frame) {
      window.addEventListener('message', this.handleMessageEvent)
      this.format = format || this.format
      this.data = data
      this.frame = this.createFrame()
      const container = document.querySelector(this.container)
      container?.appendChild(this.frame)
    }
  }

  stopEditing() {
    window.removeEventListener('message', this.handleMessageEvent)
    this.frame = undefined
  }

  initializeEditor() {
    this.postMessage({
      action: 'load',
      autosave: 0,
      saveAndExit: '1',
      modified: 'unsavedChanges',
      xml: this.data,
    })
  }

  configureEditor() {
    this.postMessage({ action: 'configure', config: this.params.configure })
  }

  exportData(data) {
    return data
  }
}

export default DiagramEditor
