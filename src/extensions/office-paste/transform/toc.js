const TOC_TITLE_PATTERN = /^(目录|大纲目录|contents?|table of contents)$/i
const WORD_SIGNATURE_PATTERN =
  /w:worddocument|urn:schemas-microsoft-com:office:word|class="?Mso/i
const TOC_SIGNATURE_PATTERN = /MsoToc|#?_Toc|table of contents|>目录</i

const isTocLink = (link) => {
  const href = String(link?.getAttribute?.('href') || '').trim()
  return /^#?_Toc/i.test(href) || /_Toc/i.test(href)
}

const isTocBlock = (node) => {
  if (!(node instanceof HTMLElement)) {
    return false
  }

  const className = String(node.className || '')
  if (/\bMsoToc\b/i.test(className) || /\bMsoToc\d+\b/i.test(className)) {
    return true
  }

  const links = Array.from(node.querySelectorAll('a[href]'))
  return links.length > 0 && links.every(isTocLink)
}

const isTocTitle = (node) => {
  if (!(node instanceof HTMLElement)) {
    return false
  }
  return TOC_TITLE_PATTERN.test(String(node.textContent || '').trim())
}

export const transformToc = (html) => {
  if (
    !html ||
    !WORD_SIGNATURE_PATTERN.test(html) ||
    !TOC_SIGNATURE_PATTERN.test(html)
  ) {
    return html
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const blocks = Array.from(doc.body?.querySelectorAll('p, div, li') || [])
  const tocBlocks = blocks.filter(isTocBlock)

  if (!tocBlocks.length) {
    return html
  }

  const groupedBlocks = []
  tocBlocks.forEach((node) => {
    const lastGroup = groupedBlocks[groupedBlocks.length - 1]
    if (
      lastGroup &&
      lastGroup[lastGroup.length - 1].nextElementSibling === node
    ) {
      lastGroup.push(node)
      return
    }
    groupedBlocks.push([node])
  })

  groupedBlocks.forEach((group) => {
    const [first] = group
    const previous = first?.previousElementSibling
    if (previous && isTocTitle(previous)) {
      previous.remove()
    }

    const tocElement = doc.createElement('toc')
    first.replaceWith(tocElement)
    group.slice(1).forEach((node) => node.remove())
  })

  return doc.documentElement.outerHTML
}
