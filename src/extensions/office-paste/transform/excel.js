import { DOMParser as ProseMirrorDOMParser } from '@tiptap/pm/model'

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

const extractStyles = (styleText) => {
  const regex = /\.(\w+)\s*\{([^}]+)\}/g
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
  if (!excel) {
    return false
  }

  const table = doc.querySelector('table')
  if (!table) return false

  const styleText = Array.from(doc.head.querySelectorAll('style'))
    .map((style) => style.textContent)
    .join('\n')

  const styles = extractStyles(styleText)

  table.querySelectorAll('td, th').forEach((cell) => {
    const style = styles[cell.getAttribute('class')]
    if (style?.background) {
      cell.style.background = style.background
    }
    if (style?.color) {
      cell.style.color = style.color
    }
    if (style?.['text-align']) {
      cell.setAttribute('align', style['text-align'])
    }
  })

  const { schema } = view.state
  const fragment = ProseMirrorDOMParser.fromSchema(schema).parse(table)
  const transaction = view.state.tr.replaceSelectionWith(fragment)
  view.dispatch(transaction)

  return true
}
