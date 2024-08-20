import { DOMSerializer, Node, Schema } from '@tiptap/pm/model'
import { createHTMLDocument, VHTMLDocument } from 'zeed-dom'

/**
 * 根据schema doc生成html
 * @param doc
 * @param schema
 * @param options
 */
export function getHTMLFromFragment(doc, schema, options) {
  if (options && options.document) {
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
      document: createHTMLDocument(),
    },
  )

  return zeedDocument.render()
}

export function generateHTML(doc, schema) {
  const contentNode = Node.fromJSON(schema, doc)

  return getHTMLFromFragment(contentNode, schema)
}

function createAndCalculateHeight(node, content) {
  //生成需要计算的节点
  let calculateNode = node.type.create(node.attrs, content, node.marks)
  //生成对应的html
  const htmlNode = generateHTML(getJsonFromDoc(calculateNode), node.type.schema)
  //计算高度
  let htmlNodeHeight = computedHeight(htmlNode, node.attrs.id)
  return htmlNodeHeight
}

/**
 * 计算节点高度超出的位置
 */
function calculateNodeOverflowHeightAndPoint(node, dom, splitContex) {
  //获得 dom现有高度
  const { height } = getDomHeight(dom)
  //拿到最后一个节点
  let lastChild = node.lastChild
  //获取当前需要计算的节点有多少个
  let childCount = node.childCount
  //最终计算的点有多少
  let point = null
  //获得到所有的节点 倒序遍历

  const content = node.content.content
  //倒序遍历content
  for (let i = childCount - 1; i >= 0; i--) {
    if (point) break
    // @ts-ignore
    lastChild = content[i]
    //分割节点 永远保留最后一个节点用作计算
    let calculateContent = i ? content.slice(0, i) : []
    //节点如果是文本的处理方式
    if (lastChild.isText) {
      let text = lastChild.text
      // @ts-ignore
      let calculateLength = text.length - 1
      //计算每一个节点带来的影响
      while (calculateLength) {
        let calculatetext = text.slice(0, calculateLength)
        //计算高度
        let htmlNodeHeight = createAndCalculateHeight(node, [
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
      let htmlNodeHeight = createAndCalculateHeight(node, calculateContent)
      if (height > htmlNodeHeight && !splitContex.isOverflow(htmlNodeHeight)) {
        point = { i, calculateLength: 0 }
        break
      }
    }
  }
  let isFlag = true
  let index = 0
  if (!point) return index
  node.descendants((node, pos, _, i) => {
    if (!isFlag) {
      return isFlag
    }
    if (i == point.i) {
      index = pos + point.calculateLength + 1
      isFlag = false
    }
  })
  return index
}

/**
 * 计算最后一行是否填满
 * @param cnode
 */
export function getFlag(cnode, schema) {
  const paragraphDOM =
    document.getElementById(cnode.attrs.id) ||
    iframeDoc.getElementById(cnode.attrs.id)
  if (!paragraphDOM) return null
  const height = getDomHeight(paragraphDOM)
  let lastChild = cnode.lastChild
  let childCount = cnode.childCount
  let content = cnode.content.content.slice(0, childCount)
  if (!lastChild) return false
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

export function getBreakPos(cnode, dom, splitContex) {
  const paragraphDOM = dom
  if (!paragraphDOM) return null
  const width = paragraphDOM.offsetWidth
  const html = generateHTML(getJsonFromDoc(cnode), splitContex.schema)
  const { width: wordl } = computedWidth(html, false)
  //如果高度超过默认了 但是宽度没有超过 证明 只有一行 只是里面有 行内元素 比如 图片
  if (width >= wordl) {
    return null
  }
  const index = calculateNodeOverflowHeightAndPoint(cnode, dom, splitContex)
  return index ? index : null
}

/**
 * 工具类
 * @param node
 */
export function getJsonFromDoc(node) {
  return {
    type: 'doc',
    content: [node.toJSON()],
  }
}

let iframeComputed = null
var iframeDoc = null

export class UnitConversion {
  arrDPI = []

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
      if (tmpNode && tmpNode.parentNode) {
        tmpNode.parentNode.removeChild(tmpNode)
      }
    }
    this.arrDPI = arr
  }

  /**
   * @description px to mm
   * @param value px值
   */
  pxConversionMm(value) {
    const inch = value / this.arrDPI[0]
    const c_value = inch * 25.4
    return Number(c_value.toFixed())
  }

  /**
   * @description mm to px
   * @param value px值
   */
  mmConversionPx(value) {
    const inch = value / 25.4
    const c_value = inch * this.arrDPI[0]
    return Number(c_value.toFixed())
  }

  cmConversionPx(value) {
    const inch = (value * 10) / 25.4
    const c_value = inch * this.arrDPI[0]
    return Number(c_value.toFixed())
  }
}

let unitConversion = null

export function getPageOption(restore = false) {
  if (restore) map.clear()
  if (!restore && map.has('pageOption')) {
    return map.get('pageOption')
  }
  if (!unitConversion) unitConversion = new UnitConversion()
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
  let pageOption = {
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

export function computedHeight(html, id, cache = true) {
  if (cache && map.has(html)) {
    return map.get(html)
  }
  const computeddiv = iframeDoc.getElementById('computeddiv')
  if (computeddiv) {
    computeddiv.innerHTML = '<p>&nbsp;</p>' + html
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

export function computedWidth(html, cache = true) {
  if (cache && map.has(html)) {
    return map.get(html)
  }
  const computedspan = iframeDoc.getElementById('computedspan')
  if (html == ' ') {
    html = '&nbsp;'
  }
  if (computedspan) {
    computedspan.innerHTML = html
    const width = computedspan.getBoundingClientRect().width
    const height = computedspan.getBoundingClientRect().height
    if (cache) {
      map.set(html, { height, width })
    }
    computedspan.innerHTML = '&nbsp;'
    return { height, width }
  }
  return 0
}

export function getDefault() {
  if (map.has('defaultheight')) {
    return map.get('defaultheight')
  }
  const computedspan = iframeDoc.getElementById('computedspan')
  const { height: pHeight } = getDomHeight(computedspan)
  map.set('defaultheight', pHeight)
  return pHeight
}

export function getDomHeight(dom) {
  const contentStyle =
    window.getComputedStyle(dom) ||
    iframeComputed.contentWindow.getComputedStyle(dom)
  const marginTop = contentStyle.getPropertyValue('margin-top')
  const marginBottom = contentStyle.getPropertyValue('margin-bottom')
  const margin = parseFloat(marginTop) + parseFloat(marginBottom)
  return {
    margin,
    height: margin + dom.offsetHeight + parseFloat(contentStyle.borderWidth),
  }
}

function findTextblockHacksIds(node) {
  let ids = []
  node.descendants((node) => {
    if (node.isTextblock && node.childCount == 0) {
      ids.push(node.attrs.id)
    }
  })
  return ids
}

export function getAbsentHtmlH(node, schema) {
  if (!node.attrs.id) {
    node.attrs.id = getId()
  }
  const html = generateHTML(getJsonFromDoc(node), schema)
  const computeddiv = iframeDoc.getElementById('computeddiv')
  let ids = findTextblockHacksIds(node)
  if (computeddiv) {
    computeddiv.innerHTML =
      "<p><br class='ProseMirror-trailingBreak'></p>" + html
    ids.forEach((id) => {
      const nodeHtml = iframeDoc.getElementById(id)
      if (nodeHtml) {
        nodeHtml.innerHTML = "<br class='ProseMirror-trailingBreak'>"
      }
    })
  }
  const nodesom = iframeDoc.getElementById(node.attrs.id)
  return nodesom
}

export function removeAbsentHtmlH() {
  const computeddiv = iframeDoc.getElementById('computeddiv')
  computeddiv.innerHTML = ''
}

export function removeComputedHtml() {
  const { container } = useStore()
  const iframeComputed1 = document.querySelector(`${container}-computediframe`)
  if (iframeComputed1) {
    document.body.removeChild(iframeComputed1)
    iframeComputed = null
    iframeDoc = null
  }
}

/**
 * 构建计算html需要的辅助iframe 和打印html
 * @param options
 */
export function buildComputedHtml() {
  removeComputedHtml()
  clonePageToIframe()
}

export function changeComputedHtml() {
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
  let pageContent = iframeDoc.getElementById('computeddiv')
  let watermark = iframeDoc.getElementsByClassName('umo-page-watermark')[0]
  watermark.setAttribute(
    'style',
    `width: ${width + 'cm'};height: ${height + 'cm'}`,
  )
  pageContent.setAttribute(
    'style',
    `padding-top: ${top + 'cm'};padding-right:  ${right + 'cm'};padding-bottom: ${bottom + 'cm'} ;padding-left:${left + 'cm'};min-height: ${height - top - bottom + 'cm'}`,
  )
}

function clonePageToIframe() {
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

function cleanPagecontent(iframe) {
  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
  const pageContent = iframeDoc.getElementsByClassName(
    'umo-page-node-content',
  )[0]
  pageContent.setAttribute('id', 'computeddiv')
  pageContent.innerHTML = ''
  let editor = pageContent.parentNode.parentNode
  let page = pageContent.parentNode
  // 使用 while 循环和 firstChild 删除所有子节点
  while (editor.lastChild != page) {
    editor.removeChild(editor.lastChild)
  }
}

function adddPForProseMirror(iframe) {
  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
  const pageContent = iframeDoc.getElementsByClassName('ProseMirror')[0]
  const p = iframeDoc.createElement('p')
  p.setAttribute('id', 'computedspan')
  p.setAttribute('style', 'display: inline-block')
  p.innerHTML = "<br class='ProseMirror-trailingBreak'>"
  pageContent.appendChild(p)
  pageContent.setAttribute('contenteditable', 'false')
}

function createIframe() {
  const iframe = document.createElement('iframe')
  document.body.appendChild(iframe)
  return iframe
}

function copyStylesToIframe(iframeContentDoc) {
  // 获取当前页面的所有样式表
  const links = document.getElementsByTagName('link')
  for (let i = 0; i < links.length; i++) {
    if (links[i].rel === 'stylesheet') {
      const newLink = iframeContentDoc.createElement('link')
      newLink.rel = 'stylesheet'
      newLink.type = 'text/css'
      newLink.href = links[i].href
      iframeContentDoc.head.appendChild(newLink)
    }
  }
  const styles = document.querySelectorAll('style')
  styles.forEach((style) => {
    // 创建一个新的<style>标签
    const newStyle = iframeContentDoc.createElement('style')
    // 将样式内容复制到新标签中
    newStyle.textContent = style.textContent
    // 将新标签插入到iframe的<head>中
    iframeContentDoc.head.appendChild(newStyle)
  })
  const elementsWithInlineStyles = document.querySelectorAll('[style]')
  elementsWithInlineStyles.forEach((element) => {
    const styleAttr = element.getAttribute('style')
    const clonedElement = iframeContentDoc.createElement(element.tagName)
    clonedElement.setAttribute('style', styleAttr)
  })
}

function filterAndCopyHtmlToIframe(iframe, excludedTags) {
  const body = document.body
  const bodyContent = body.innerHTML

  // 使用正则表达式过滤掉不需要的标签
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

//------------------------------util----------------------------------------------
export function getId() {
  return Math.random().toString(36).substring(2, 10)
}

export const findParentDomRefOfType = (nodeType, domAtPos) => (selection) => {
  return findParentDomRef(
    (node) => equalNodeType(nodeType, node),
    domAtPos,
  )(selection)
}
export const equalNodeType = (nodeType, node) => {
  return (
    (Array.isArray(nodeType) && nodeType.indexOf(node.type) > -1) ||
    node.type === nodeType
  )
}

export const findParentDomRef = (predicate, domAtPos) => (selection) => {
  const parent = findParentNode(predicate)(selection)
  if (parent) {
    return findDomRefAtPos(parent.pos, domAtPos)
  }
}

export const findDomRefAtPos = (position, domAtPos) => {
  const dom = domAtPos(position)
  const node = dom.node.childNodes[dom.offset]

  if (dom.node.nodeType === Node.TEXT_NODE) {
    return dom.node.parentNode
  }

  if (!node || node.nodeType === Node.TEXT_NODE) {
    return dom.node
  }

  return node
}

export const findParentNode =
  (predicate) =>
  ({ $from }) =>
    findParentNodeClosestToPos($from, predicate)

export const findParentNodeClosestToPos = ($pos, predicate) => {
  for (let i = $pos.depth; i > 0; i--) {
    const node = $pos.node(i)
    if (predicate(node)) {
      return {
        pos: i > 0 ? $pos.before(i) : 0,
        start: $pos.start(i),
        depth: i,
        node,
      }
    }
  }
}
