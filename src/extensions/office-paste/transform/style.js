import { parseStyleAttribute } from '../utils'

const normalizeLineHeight = (value) => {
  const lineHeight = String(value ?? '').trim()
  if (!lineHeight) {
    return ''
  }

  const percentMatch = lineHeight.match(/^(\d+(?:\.\d+)?)%$/)
  if (percentMatch) {
    return String(Number(percentMatch[1]) / 100)
  }

  return lineHeight
}

export const transformMsoStyles = (html) => {
  html = html.replace(/<o:p>(.*?)<\/o:p>/g, ``)

  const parser = new DOMParser()
  const doc = parser.parseFromString(html, `text/html`)
  doc.querySelectorAll(`[style*="mso-"]`).forEach((node) => {
    const styles = parseStyleAttribute(node)
    const newStyles = []
    const normalizedLineHeight =
      normalizeLineHeight(styles[`line-height`]) ||
      normalizeLineHeight(styles[`mso-line-height-alt`])

    for (const prop of Object.keys(styles)) {
      if (prop && !prop.startsWith(`mso-`)) {
        const value = prop === `line-height` ? normalizedLineHeight : styles[prop]
        newStyles.push(`${prop}: ${value}`)
      }
    }

    if (
      normalizedLineHeight &&
      !Object.prototype.hasOwnProperty.call(styles, `line-height`)
    ) {
      newStyles.push(`line-height: ${normalizedLineHeight}`)
    }

    node.setAttribute(`style`, newStyles.join(`;`))
  })

  doc.querySelectorAll(`[style*="line-height"]`).forEach((node) => {
    const normalizedLineHeight = normalizeLineHeight(node.style.lineHeight)
    if (normalizedLineHeight) {
      node.style.lineHeight = normalizedLineHeight
    }
  })

  doc.querySelectorAll(`[style*="color: black"]`).forEach((node) => {
    node.style.removeProperty(`color`)
  })

  return doc.documentElement.outerHTML
}
