/**
 * Parses a roman number string into a number
 *
 * Example: a -> 1, ab -> 28, ...
 */
export function parseRomanNumber(roman) {
  roman = roman.toUpperCase()
  let value = 0
  const values = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }
  let i = roman.length
  let lastVal = 0
  while (i--) {
    if (values[roman.charAt(i)] >= lastVal) {
      value += values[roman.charAt(i)]
    } else {
      value -= values[roman.charAt(i)]
    }
    lastVal = values[roman.charAt(i)]
  }

  return value
}

/**
 * Parses a list item index of letters.
 *
 * Example: a -> 1, ab -> 28, ...
 */
export function parseLetterNumber(str) {
  const alphaVal = (s) => s.toLowerCase().charCodeAt(0) - 97 + 1
  let value = 0
  let i = str.length
  while (i--) {
    const factor = Math.pow(26, str.length - i - 1)
    value += alphaVal(str.charAt(i)) * factor
  }
  return value
}

/**
 * Removes the sourounding tag of a node
 *
 * @param {Node} node
 * @returns {Node}
 */
export function unwrapNode(node) {
  const parent = node.parentNode
  while (node.firstChild) {
    parent?.insertBefore(node.firstChild, node)
  }
  parent?.removeChild(node)
}

/**
 * Parses arbitrary style properties of an element into an object
 *
 * @param {Element} el
 * @returns {Object}
 */
export function parseStyleAttribute(el) {
  const styleRaw = el?.attributes[`style`]?.value || ``
  return Object.fromEntries(
    styleRaw.split(`;`).map((line) => line.split(`:`).map((v) => v.trim())),
  )
}

export function isOfficeHtml(html) {
  if (!html) {
    return false
  }
  const normalized = html.toLowerCase()
  const hasMsOfficeSignature =
    (normalized.includes('microsoft-com') && normalized.includes('office')) ||
    normalized.includes('urn:schemas-microsoft-com:office') ||
    normalized.includes('class=mso') ||
    normalized.includes('class="mso') ||
    normalized.includes('mso-') ||
    normalized.includes('w:worddocument')

  const hasWpsSignature =
    normalized.includes('wps office') ||
    normalized.includes('kingsoft') ||
    normalized.includes('xmlns:wps') ||
    normalized.includes('name="generator" content="wps')

  return hasMsOfficeSignature || hasWpsSignature
}

export function replaceImageWithPlaceholderResult(
  html,
  placeholder = '[图片]',
) {
  if (!html) {
    return {
      html,
      replaced: false,
    }
  }

  let replaced = false
  const replaceWithPlaceholder = () => {
    replaced = true
    return placeholder
  }

  let nextHtml = html
  nextHtml = nextHtml.replace(
    /<v:shape\b[^>]*>[\s\S]*?<v:imagedata[\s\S]*?<\/v:shape>/gi,
    replaceWithPlaceholder,
  )
  nextHtml = nextHtml.replace(
    /<v:imagedata\b[^>]*\/?>/gi,
    replaceWithPlaceholder,
  )
  nextHtml = nextHtml.replace(/<img\b[^>]*>/gi, replaceWithPlaceholder)

  return {
    html: nextHtml,
    replaced,
  }
}

export function replaceImageWithPlaceholder(html, placeholder = '[图片]') {
  return replaceImageWithPlaceholderResult(html, placeholder).html
}

export function isOfficeLikeClipboardData(clipboardData) {
  if (!clipboardData) {
    return false
  }
  const html = clipboardData.getData('text/html') || ''
  if (isOfficeHtml(html)) {
    return true
  }
  const types = Array.from(clipboardData.types || [])
  return types.includes('text/rtf') || types.includes('application/rtf')
}
