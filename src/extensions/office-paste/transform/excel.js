import { DOMParser as ProseMirrorDOMParser } from '@tiptap/pm/model'

// 解析剪切板中 excel 的 CSS 规则（将 CSS 字符串转换为对象）
const parseCSS = (cssRules) => {
  const results = {}
  const rules = cssRules
    .split(';')
    .map((rule) => rule.trim())
    .filter(Boolean)
  rules.forEach((rule) => {
    const [property, value] = rule.split(':').map((part) => part.trim())
    if (property && value) {
      results[property] = value
    }
  })
  return results
}

// 提取样式规则的方法
const extractStyles = (styleText) => {
  const regex = /\.([\w-]+)\s*\{([^}]+)\}/g
  let match
  const styles = {}

  while ((match = regex.exec(styleText)) !== null) {
    // const className = match[1]
    // const cssRules = match[2]
    const [, className, cssRules] = match
    const parsedRules = parseCSS(cssRules)
    styles[className] = parsedRules
  }

  return styles
}

const getMergedClassStyles = (node, styles, cache) => {
  const className = String(node?.getAttribute?.('class') || '').trim()
  if (!className) {
    return null
  }

  if (cache?.has(className)) {
    return cache.get(className)
  }

  const mergedStyles = {}
  className
    .split(/\s+/)
    .filter(Boolean)
    .forEach((name) => {
      if (styles[name]) {
        Object.assign(mergedStyles, styles[name])
      }
    })

  const result = Object.keys(mergedStyles).length ? mergedStyles : null
  cache?.set(className, result)
  return result
}

const applyClassStyles = (node, styles, cache) => {
  const classStyles = getMergedClassStyles(node, styles, cache)
  if (!classStyles) {
    return
  }

  Object.entries(classStyles).forEach(([property, value]) => {
    if (!property || !value) {
      return
    }
    node.style.setProperty(property, value)
  })
}

const normalizeSheetText = (value) =>
  String(value ?? '').replaceAll('\r\n', '\n')

const applySheetSegmentStyles = (node, style = {}) => {
  const {
    foreColor,
    font,
    fontWeight,
    fontStyle,
    bold,
    italic,
    textDecoration,
  } = style

  if (foreColor) {
    node.style.color = foreColor
  }

  if (font) {
    const fontValue = String(font).trim()
    const fontMatch = fontValue.match(/^(\d+(?:\.\d+)?pt)(?:\/[^\s]+)?\s+(.+)$/)
    if (fontMatch) {
      const [, fontSize, fontFamily] = fontMatch
      node.style.fontSize = fontSize
      node.style.fontFamily = fontFamily.trim()
    } else {
      node.style.font = fontValue
    }
  }

  if (bold || /^(bold|[5-9]00)$/i.test(String(fontWeight || ''))) {
    node.style.fontWeight = 'bold'
  }

  if (italic || String(fontStyle || '').toLowerCase() === 'italic') {
    node.style.fontStyle = 'italic'
  }

  if (typeof textDecoration === 'string' && textDecoration.trim()) {
    node.style.textDecoration = textDecoration.trim()
  } else if (Number(textDecoration) > 0) {
    node.style.textDecoration = 'underline'
  }
}

const appendSheetText = (node, text) => {
  const lines = normalizeSheetText(text).split('\n')
  lines.forEach((line, index) => {
    if (index > 0) {
      node.append(document.createElement('br'))
    }
    if (line) {
      node.append(document.createTextNode(line))
    }
  })
}

const hasRichSheetSegment = (segment) => {
  const href = String(segment?.link ?? '').trim()
  if ((segment?.type === 'url' || href) && href) {
    return true
  }

  const style = segment?.style || {}
  return !!(
    style.foreColor ||
    style.font ||
    style.bold ||
    style.italic ||
    style.fontWeight ||
    style.fontStyle ||
    style.textDecoration
  )
}

const restoreSheetCellRichText = (cell) => {
  const rawValue = cell.getAttribute('data-sheet-value')
  if (!rawValue) {
    return
  }

  let segments
  try {
    segments = JSON.parse(rawValue)
  } catch {
    return
  }

  if (!Array.isArray(segments) || segments.length === 0) {
    return
  }

  if (!segments.some(hasRichSheetSegment)) {
    return
  }

  const fragment = document.createDocumentFragment()
  segments.forEach((segment) => {
    const text = String(segment?.text ?? '')
    if (!text) {
      return
    }

    const href = String(segment?.link ?? '').trim()
    const node =
      (segment?.type === 'url' || href) && href
        ? document.createElement('a')
        : document.createElement('span')

    if (node instanceof HTMLAnchorElement) {
      node.href = href
      node.target = '_blank'
      node.rel = 'noopener noreferrer'
    }

    applySheetSegmentStyles(node, segment?.style)
    appendSheetText(node, text)
    fragment.append(node)
  })

  if (!fragment.childNodes.length) {
    return
  }

  cell.replaceChildren(fragment)
}

export const transformExcel = (view, event) => {
  if (!event) return false
  const { clipboardData } = event
  if (!clipboardData) return false

  const html = clipboardData.getData('text/html')
  if (!html) return false

  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const excel = doc
    ?.querySelector('html')
    ?.getAttribute('xmlns:x')
    ?.includes('office:excel')
  const larkSheet = !!doc.querySelector(
    'byte-sheet-html-origin[data-lark-html-role="root"]',
  )
  if (!excel && !larkSheet) {
    return false
  }

  const table = doc.querySelector('table')
  if (!table) return false

  const styleText = Array.from(doc.head.querySelectorAll('style'))
    .map((style) => style.textContent)
    .join('\n')

  // 提取所有样式规则
  const styles = extractStyles(styleText)
  const classStyleCache = new Map()

  // 先把 class 样式回填成内联样式，保留飞书/Excel 单元格里的富文本格式。
  if (Object.keys(styles).length) {
    table.querySelectorAll('[class]').forEach((node) => {
      if (!(node instanceof HTMLElement)) {
        return
      }
      applyClassStyles(node, styles, classStyleCache)
    })
  }

  // 飞书表格会把富文本样式写进 data-sheet-value，这里先还原成真实节点。
  table
    .querySelectorAll('td[data-sheet-value], th[data-sheet-value]')
    .forEach((cell) => {
      if (!(cell instanceof HTMLElement)) {
        return
      }
      restoreSheetCellRichText(cell)
    })

  // 单元格对齐仍显式落到 align，方便表格 schema 直接读取。
  table.querySelectorAll('td, th').forEach((cell) => {
    const { textAlign } = cell.style
    if (textAlign) {
      cell.setAttribute('align', textAlign)
    }
  })

  // 使用 ProseMirror 的 DOMParser 将表格转换为 ProseMirror 节点
  const { schema } = view.state
  const fragment = ProseMirrorDOMParser.fromSchema(schema).parse(table)
  const transaction = view.state.tr.replaceSelectionWith(fragment)
  view.dispatch(transaction)

  return true
}
