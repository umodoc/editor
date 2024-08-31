import type { JSONContent } from '@tiptap/core'
import { DOMSerializer, Node, type Schema } from '@tiptap/pm/model'
import { createHTMLDocument, type VHTMLDocument } from 'zeed-dom'

import type { SplitContext } from '@/extensions/page/computed'
import { getId } from '@/extensions/page/utils'

/**
 * Generates HTML from a ProseMirror document fragment.
 * @param {Node} doc - The ProseMirror document node.
 * @param {Schema} schema - The ProseMirror schema.
 * @param {Object} [options] - Additional options.
 * @param {Document} [options.document] - Optional document to use for serialization.
 * @returns {string} - The generated HTML string.
 */
export function getHTMLFromFragment(
  doc: Node,
  schema: Schema,
  options?: { document?: Document },
): string {
  if (options?.document) {
    const wrap = options.document.createElement('div')
    DOMSerializer.fromSchema(schema).serializeFragment(
      doc.content,
      { document: options.document },
      wrap,
    )
    return wrap.innerHTML
  }
  const zeedDocument = DOMSerializer.fromSchema(schema).serializeFragment(
    doc.content,
    {
      document: createHTMLDocument() as unknown as Document,
    },
  ) as unknown as VHTMLDocument

  return zeedDocument.render()
}

/**
 * Generates HTML from a JSON content structure.
 * @param {JSONContent} doc - The JSON content structure.
 * @param {Schema} schema - The ProseMirror schema.
 * @returns {string} - The generated HTML string.
 */
export function generateHTML(doc: JSONContent, schema: Schema): string {
  const contentNode = Node.fromJSON(schema, doc)

  return getHTMLFromFragment(contentNode, schema)
}

function createAndCalculateHeight(node: Node, content: Node[]): number {
  // Creates a node and calculates its height
  const calculateNode = node.type.create(node.attrs, content, node.marks)
  // Generates the corresponding HTML
  const htmlNode = generateHTML(getJsonFromDoc(calculateNode), node.type.schema)
  // Computes the height
  return computedHeight(htmlNode, node.attrs.id)
}

/**
 * Calculates the position where a node's height overflows.
 * @param {Node} node - The ProseMirror node.
 * @param {HTMLElement} dom - The DOM element representing the node.
 * @param {SplitContext} splitContex - The context used for splitting content.
 * @returns {number} - The position where the node's height overflows.
 */
function calculateNodeOverflowHeightAndPoint(
  node: Node,
  dom: HTMLElement,
  splitContex: SplitContext,
): number {
  const { height } = getDomHeight(dom)
  let { lastChild } = node
  const { childCount } = node
  let point = null
  const { content } = node.content

  for (let i = childCount - 1; i >= 0; i--) {
    if (point) {
      break
    }
    lastChild = content[i]
    const calculateContent = i ? content.slice(0, i) : []

    if (lastChild?.isText) {
      const { text } = lastChild
      let calculateLength = text?.length - 1

      while (calculateLength) {
        const calculatetext = text?.slice(0, calculateLength)
        const htmlNodeHeight = createAndCalculateHeight(node, [
          ...calculateContent,
          splitContex.schema.text(calculatetext, lastChild.marks),
        ])
        if (
          height > htmlNodeHeight &&
          !splitContex.isOverflow(htmlNodeHeight)
        ) {
          point = { i, calculateLength }
          break
        }
        calculateLength -= 1
      }
    } else {
      const htmlNodeHeight = createAndCalculateHeight(node, calculateContent)
      if (height > htmlNodeHeight && !splitContex.isOverflow(htmlNodeHeight)) {
        point = { i, calculateLength: 0 }
        break
      }
    }
  }
  let index = 0
  if (!point) {
    return index
  }
  node.descendants((_node, pos, _, i) => {
    if (i === point.i) {
      index = pos + point.calculateLength + 1
    }
  })
  return index
}

/**
 * Checks if the last line of a node is fully filled.
 * @param {Node} cnode - The ProseMirror node.
 * @param {Schema} schema - The ProseMirror schema.
 * @returns {boolean|null} - Returns true if the last line is filled, false otherwise, and null if the node is not found.
 */
export function getFlag(cnode: Node, schema: Schema): boolean | null {
  const paragraphDOM =
    document.getElementById(cnode.attrs.id) ??
    iframeDoc.getElementById(cnode.attrs.id)
  if (!paragraphDOM) {
    return null
  }
  const height = getDomHeight(paragraphDOM)
  const { lastChild } = cnode
  const { childCount } = cnode
  const content = cnode.content.content.slice(0, childCount)
  if (!lastChild) {
    return false
  }
  if (lastChild.isText) {
    content.push(schema.text('gg'))
  }
  const html = generateHTML(
    getJsonFromDoc(cnode.type.create(cnode.attrs, content, cnode.marks)),
    schema,
  )
  const htmlNodeHeight = computedHeight(html, cnode.attrs.id, false)
  return htmlNodeHeight > height
}

/**
 * Calculates the breaking position in a node based on DOM and context.
 * @param {Node} cnode - The ProseMirror node.
 * @param {HTMLElement} dom - The DOM element representing the node.
 * @param {SplitContext} splitContex - The context used for splitting content.
 * @returns {number|null} - The position where the node should be split, or null if no break is needed.
 */
export function getBreakPos(
  cnode: Node,
  dom: HTMLElement,
  splitContex: SplitContext,
): number | null {
  const width = dom.offsetWidth
  const html = generateHTML(getJsonFromDoc(cnode), splitContex.schema)
  const { width: wordl } = computedWidth(html, false)

  if (width >= wordl) {
    return null
  }
  const index = calculateNodeOverflowHeightAndPoint(cnode, dom, splitContex)
  return index ? index : null
}

/**
 * Converts a ProseMirror node to a JSON structure.
 * @param {Node} node - The ProseMirror node.
 * @returns {Object} - The JSON representation of the document.
 */
export function getJsonFromDoc(node: Node): object {
  return {
    type: 'doc',
    content: [node.toJSON()],
  }
}

let iframeComputed: any = null
let iframeDoc: any = null

export class UnitConversion {
  arrDPI: any[] = []

  constructor() {
    const arr = []
    if (window.screen.deviceXDPI) {
      arr.push(window.screen.deviceXDPI)
      arr.push(window.screen.deviceYDPI)
    } else {
      const tmpNode = document.createElement('DIV')
      tmpNode.style.cssText =
        'width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:-99;visibility:hidden'
      document.body.appendChild(tmpNode)
      arr.push(tmpNode.offsetWidth)
      arr.push(tmpNode.offsetHeight)
      if (tmpNode.parentNode) {
        tmpNode.parentNode.removeChild(tmpNode)
      }
    }
    this.arrDPI = arr
  }

  /**
   * Converts pixels to millimeters.
   * @param {number} value - The value in pixels.
   * @returns {number} - The value in millimeters.
   */
  pxConversionMm(value: number): number {
    const inch = value / this.arrDPI[0]
    const cValue = inch * 25.4
    return Number(cValue.toFixed())
  }

  /**
   * Converts millimeters to pixels.
   * @param {number} value - The value in millimeters.
   * @returns {number} - The value in pixels.
   */
  mmConversionPx(value: number): number {
    const inch = value / 25.4
    const cValue = inch * this.arrDPI[0]
    return Number(cValue.toFixed())
  }

  /**
   * Converts centimeters to pixels.
   * @param {number} value - The value in centimeters.
   * @returns {number} - The value in pixels.
   */
  cmConversionPx(value: number): number {
    const inch = (value * 10) / 25.4
    const cValue = inch * this.arrDPI[0]
    return Number(cValue.toFixed())
  }
}

let unitConversion: UnitConversion | null = null

/**
 * Retrieves or calculates the page options, including body dimensions and margins.
 * @param {boolean} [restore=false] - Whether to restore the options.
 * @returns {Object} - The calculated page options.
 */
export function getPageOption(restore = false): object {
  if (restore) {
    map.clear()
  }
  if (!restore && map.has('pageOption')) {
    return map.get('pageOption')
  }
  if (!unitConversion) {
    unitConversion = new UnitConversion()
  }
  const { page } = useStore()
  const { right, left, bottom, top } = page.value.margin
  const pageSize = () => {
    const { width, height } = page.value.size
    return {
      width: page.value.orientation === 'portrait' ? width : height,
      height: page.value.orientation === 'portrait' ? height : width,
    }
  }
  const { width, height } = pageSize()
  const pageOption = {
    bodyHeight: unitConversion.cmConversionPx(height - bottom - top),
    bodyWidth: unitConversion.cmConversionPx(width - right - left),
    right: unitConversion.cmConversionPx(right),
    left: unitConversion.cmConversionPx(left),
    bottom: unitConversion.cmConversionPx(bottom),
    top: unitConversion.cmConversionPx(top),
  }
  map.set('pageOption', pageOption)
  return pageOption
}

const map = new Map()

/**
 * Computes the height of the HTML content.
 * @param {string} html - The HTML string.
 * @param {string} id - The ID of the element.
 * @param {boolean} [cache=true] - Whether to cache the result.
 * @returns {number} - The computed height.
 */
export function computedHeight(html: string, id: string, cache = true): number {
  if (cache && map.has(html)) {
    return map.get(html)
  }
  const computeddiv = iframeDoc.getElementById('computeddiv')
  if (computeddiv) {
    computeddiv.innerHTML = `<p>&nbsp;</p>${html}`
    const htmldiv = iframeDoc.getElementById(id)
    const { height } = getDomHeight(htmldiv)
    computeddiv.innerHTML = '&nbsp;'
    if (cache) {
      map.set(html, height)
    }
    return height
  }
  return 0
}

/**
 * Computes the width of the HTML content.
 * @param {string} html - The HTML string.
 * @param {boolean} [cache=true] - Whether to cache the result.
 * @returns {Object} - An object containing the computed width and height.
 */
export function computedWidth(
  html: string,
  cache = true,
): { height: number; width: number } {
  if (cache && map.has(html)) {
    return map.get(html)
  }
  const computedspan = iframeDoc.getElementById('computedspan')
  if (html === ' ') {
    html = '&nbsp;'
  }
  if (computedspan) {
    computedspan.innerHTML = html
    const { width } = computedspan.getBoundingClientRect()
    const { height } = computedspan.getBoundingClientRect()
    if (cache) {
      map.set(html, { height, width })
    }
    computedspan.innerHTML = '&nbsp;'
    return { height, width }
  }
  return { height: 0, width: 0 }
}

/**
 * Gets the default height for a text block.
 * @returns {number} - The default height.
 */
export function getDefault(): number {
  if (map.has('defaultheight')) {
    return map.get('defaultheight')
  }
  const computedspan = iframeDoc.getElementById('computedspan')
  const { height: pHeight } = getDomHeight(computedspan)
  map.set('defaultheight', pHeight)
  return pHeight
}

/**
 * Gets the height of a DOM element, including margins.
 * @param {HTMLElement} dom - The DOM element.
 * @returns {Object} - An object containing the margin and height.
 */
export function getDomHeight(dom: HTMLElement): {
  margin: number
  height: number
} {
  const contentStyle =
    window.getComputedStyle(dom) ||
    iframeComputed.contentWindow.getComputedStyle(dom)
  const marginTop = contentStyle.getPropertyValue('margin-top')
  const marginBottom = contentStyle.getPropertyValue('margin-bottom')
  const margin = Number.parseFloat(marginTop) + Number.parseFloat(marginBottom)
  return {
    margin,
    height:
      margin + dom.offsetHeight + Number.parseFloat(contentStyle.borderWidth),
  }
}

function findTextBlockHacksIds(node: Node): any[] {
  const ids: any[] = []
  node.descendants((node) => {
    if (node.isTextblock && node.childCount === 0) {
      ids.push(node.attrs.id)
    }
  })
  return ids
}

/**
 * Gets the computed HTML element for a node.
 * @param {Node} node - The ProseMirror node.
 * @param {Schema} schema - The ProseMirror schema.
 * @returns {HTMLElement} - The corresponding HTML element.
 */
export function getAbsentHtmlH(node: Node, schema: Schema): HTMLElement {
  if (!node.attrs.id) {
    node.attrs.id = getId()
  }
  const html = generateHTML(getJsonFromDoc(node), schema)
  const computeddiv = iframeDoc.getElementById('computeddiv')
  const ids = findTextBlockHacksIds(node)
  if (computeddiv) {
    computeddiv.innerHTML = `<p><br class='ProseMirror-trailingBreak'></p>${html}`
    ids.forEach((id) => {
      const nodeHtml = iframeDoc.getElementById(id)
      if (nodeHtml) {
        nodeHtml.innerHTML = "<br class='ProseMirror-trailingBreak'>"
      }
    })
  }
  return iframeDoc.getElementById(node.attrs.id)
}

/**
 * Clears the computed HTML content.
 */
export function removeAbsentHtmlH(): void {
  const computeddiv = iframeDoc.getElementById('computeddiv')
  computeddiv.innerHTML = ''
}

/**
 * Removes the computed iframe from the document.
 */
export function removeComputedHtml(): void {
  const { container } = useStore()
  const computedIframe = document.querySelector(`${container}-computediframe`)
  if (computedIframe) {
    document.body.removeChild(computedIframe)
    iframeComputed = null
    iframeDoc = null
  }
}

/**
 * Constructs the auxiliary iframe needed for computing HTML and printing it.
 */
export function buildComputedHtml(): void {
  removeComputedHtml()
  clonePageToIframe()
}

/**
 * Updates the computed HTML content based on the current page options.
 */
export function changeComputedHtml(): void {
  getPageOption(true)
  const { page } = useStore()
  const pageSize = () => {
    const { width, height } = page.value.size
    return {
      width: page.value.orientation === 'portrait' ? width : height,
      height: page.value.orientation === 'portrait' ? height : width,
    }
  }
  const { width, height } = pageSize()
  const { right, left, bottom, top } = page.value.margin
  const pageContent = iframeDoc.getElementById('computeddiv')
  const [watermark] = iframeDoc.getElementsByClassName('umo-page-watermark')
  watermark.setAttribute('style', `width: ${width}cm;height: ${height}cm`)
  pageContent.setAttribute(
    'style',
    `padding-top: ${top}cm;padding-right:  ${right}cm;padding-bottom: ${bottom}cm ;padding-left:${left}cm;min-height: ${height - top - bottom}cm`,
  )
}

function clonePageToIframe(): void {
  const iframe = createIframe()
  const { container } = useStore()
  iframeComputed = iframe
  iframeComputed.setAttribute(
    'id',
    `${container.replace('#', '')}-computediframe`,
  )
  iframeComputed.setAttribute('class', 'umo-editor-page-computed')
  iframeDoc =
    iframeComputed.contentDocument || iframeComputed.contentWindow.document
  copyStylesToIframe(iframeDoc)
  filterAndCopyHtmlToIframe(iframe, ['header', 'iframe', 'footer'])
  cleanPagecontent(iframe)
  adddPForProseMirror(iframe)
}

function cleanPagecontent(iframe: any): void {
  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
  const [pageContent] = iframeDoc.getElementsByClassName(
    'umo-page-node-content',
  )
  pageContent.setAttribute('id', 'computeddiv')
  pageContent.innerHTML = ''
  const editor = pageContent.parentNode.parentNode
  const page = pageContent.parentNode
  while (editor.lastChild !== page) {
    editor.removeChild(editor.lastChild)
  }
}

function adddPForProseMirror(iframe: any): void {
  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
  const [pageContent] = iframeDoc.getElementsByClassName('ProseMirror')
  const p = iframeDoc.createElement('p')
  p.setAttribute('id', 'computedspan')
  p.setAttribute('style', 'display: inline-block')
  p.innerHTML = "<br class='ProseMirror-trailingBreak'>"
  pageContent.appendChild(p)
  pageContent.setAttribute('contenteditable', 'false')
}

function createIframe(): HTMLIFrameElement {
  const iframe = document.createElement('iframe')
  document.body.appendChild(iframe)
  return iframe
}

function copyStylesToIframe(iframeContentDoc: Document): void {
  const links = document.getElementsByTagName('link')
  for (const link of links) {
    if (link.rel === 'stylesheet') {
      const newLink = iframeContentDoc.createElement('link')
      newLink.rel = 'stylesheet'
      newLink.type = 'text/css'
      newLink.href = link.href
      iframeContentDoc.head.appendChild(newLink)
    }
  }
  const styles = document.querySelectorAll('style')
  styles.forEach((style) => {
    const newStyle = iframeContentDoc.createElement('style')
    newStyle.textContent = style.textContent
    iframeContentDoc.head.appendChild(newStyle)
  })
  const elementsWithInlineStyles = document.querySelectorAll('[style]')
  elementsWithInlineStyles.forEach((element) => {
    const styleAttr = element.getAttribute('style') ?? ''
    const clonedElement = iframeContentDoc.createElement(element.tagName)
    clonedElement.setAttribute('style', styleAttr)
  })
}

function filterAndCopyHtmlToIframe(iframe: any, excludedTags: string[]): void {
  const { body } = document
  const bodyContent = body.innerHTML

  const regex = new RegExp(`<(${excludedTags.join('|')})[^>]*>.*?</\\1>`, 'g')
  const filteredContent = bodyContent.replace(regex, '')
  const docFragment = document.createDocumentFragment()
  const newBody = document.createElement('body')
  newBody.innerHTML = filteredContent
  docFragment.appendChild(newBody)

  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
  iframeDoc.adoptNode(docFragment)
  iframeDoc.body.parentNode.replaceChild(docFragment, iframeDoc.body)
}