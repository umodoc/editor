const TOC_TITLE_PATTERN = /^(目录|大纲目录|contents?|table of contents)$/i

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

  // 容器（如 WordSection）不算目录块，否则仅含目录链接时整篇内容会被替换
  if (node.querySelector('p, div, li, table')) {
    return false
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

export const transformToc = (doc) => {
  const blocks = Array.from(doc.body?.querySelectorAll('p, div, li') || [])
  const tocBlocks = blocks.filter(isTocBlock)

  if (!tocBlocks.length) {
    return
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
}
