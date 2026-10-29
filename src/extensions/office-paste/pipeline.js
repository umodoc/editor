import { normalizeDocumentImages } from '../image'

import { extractRtfImages } from './rtf-images'
import { transformRemoveBookmarks } from './transform/bookmark'
import { transformMsoHtmlClasses } from './transform/html-classes'
import { transformRemoveLineNumberWrapper } from './transform/line-number'
import { transformLists } from './transform/list'
import { transformMsoStyles } from './transform/style'
import { transformToc } from './transform/toc'

const OFFICE_TRANSFORMS = [
  transformLists,
  transformRemoveBookmarks,
  transformMsoStyles,
  transformMsoHtmlClasses,
  transformRemoveLineNumberWrapper,
  transformToc,
]

const LOCAL_IMAGE_SRC = /^(file:|cid:|webkit-fake-url:|about:|$)/i

const isLocalImage = (element) =>
  element.localName !== 'img' ||
  LOCAL_IMAGE_SRC.test((element.getAttribute('src') || '').trim())

const getDocumentImages = (doc) =>
  Array.from(doc.querySelectorAll('img, v\\:imagedata'))

const createPlaceholder = (doc, text) => {
  const placeholder = doc.createElement('span')
  placeholder.style.color = 'var(--umo-error-color, #e34d59)'
  placeholder.textContent = text
  return placeholder
}

// 将无法读取的图片替换为占位文字，返回是否发生了替换
const replaceLocalImages = (doc, placeholderText) => {
  const images = getDocumentImages(doc).filter(isLocalImage)
  images.forEach((image) => {
    const target = image.closest('v\\:shape') || image
    target.replaceWith(createPlaceholder(doc, placeholderText))
  })
  return images.length > 0
}

// RTF 图片与 HTML 图片之间只有顺序这一个对应关系，数量不一致时无法确定
// 对应关系，宁可保留占位提示也不能把图片放错位置
const restoreImagesFromRtf = (doc, rtfImages) => {
  const images = getDocumentImages(doc)
  const localImages = images.filter(isLocalImage)
  let targets = null
  if (rtfImages.length === localImages.length) {
    targets = localImages
  } else if (rtfImages.length === images.length) {
    targets = images
  }
  targets?.forEach((image, index) => {
    const src = rtfImages[index]
    if (!src || !isLocalImage(image)) {
      return
    }
    if (image.localName === 'img') {
      image.setAttribute('src', src)
      return
    }
    const target = image.closest('v\\:shape') || image
    const restored = doc.createElement('img')
    restored.setAttribute('src', src)
    target.replaceWith(restored)
  })
}

export const transformOfficeDocument = (doc, placeholderText) => {
  OFFICE_TRANSFORMS.forEach((transform) => transform(doc))
  const hasImage = replaceLocalImages(doc, placeholderText)
  normalizeDocumentImages(doc)
  return hasImage
}

export const transformOfficeDocumentAsync = async (
  doc,
  { rtf, placeholderText, slice },
) => {
  for (const transform of OFFICE_TRANSFORMS) {
    transform(doc)
    await slice()
  }
  restoreImagesFromRtf(doc, await extractRtfImages(rtf, slice))
  const hasImage = replaceLocalImages(doc, placeholderText)
  normalizeDocumentImages(doc)
  await slice()
  return hasImage
}
