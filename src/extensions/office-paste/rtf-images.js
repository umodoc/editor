// Word 粘贴的 HTML 中图片是浏览器无法读取的 file:// 地址，图片数据只存在于剪贴板的 RTF 内容里

const PICTURE_GROUP = '{\\pict'
// 这些分组内的 \pict 不对应正文图片：nonshppict 是旧版本的重复数据，listpicture 是列表符号
const IGNORED_GROUPS = ['{\\nonshppict', '{\\*\\listpicture']
const IMAGE_MIME_TYPES = {
  '\\pngblip': 'image/png',
  '\\jpegblip': 'image/jpeg',
}
const OPEN_BRACE = 123
const CLOSE_BRACE = 125
const BACKSLASH = 92

// 返回与 start 处左括号配对的右括号之后的位置
const findGroupEnd = (rtf, start) => {
  let depth = 0
  for (let i = start; i < rtf.length; i += 1) {
    const code = rtf.charCodeAt(i)
    if (code === BACKSLASH) {
      i += 1
    } else if (code === OPEN_BRACE) {
      depth += 1
    } else if (code === CLOSE_BRACE) {
      depth -= 1
      if (depth === 0) {
        return i + 1
      }
    }
  }
  return rtf.length
}

// 去掉 {\*\picprop ...} 等嵌套分组，只保留 \pict 自身的控制字和十六进制数据
const stripNestedGroups = (rtf, start, end) => {
  const parts = []
  let cursor = start + 1
  let next = rtf.indexOf('{', cursor)
  while (next !== -1 && next < end) {
    parts.push(rtf.slice(cursor, next))
    cursor = findGroupEnd(rtf, next)
    next = rtf.indexOf('{', cursor)
  }
  parts.push(rtf.slice(cursor, end - 1))
  return parts.join('')
}

const hexToBase64 = (hex) => {
  const chunkSize = 0x8000
  const chars = []
  for (let i = 0; i < hex.length; i += chunkSize * 2) {
    const end = Math.min(i + chunkSize * 2, hex.length)
    const bytes = new Uint8Array((end - i) >> 1)
    for (let j = 0; j < bytes.length; j += 1) {
      bytes[j] = Number.parseInt(hex.substr(i + j * 2, 2), 16)
    }
    chars.push(String.fromCharCode.apply(null, bytes))
  }
  return btoa(chars.join(''))
}

const parsePicture = (body) => {
  const mimeKey = Object.keys(IMAGE_MIME_TYPES).find((key) =>
    body.includes(key),
  )
  if (!mimeKey) {
    // EMF/WMF 等浏览器无法显示的格式，保留占位以维持与 HTML 图片的顺序对应
    return null
  }
  const data = body.replace(/\\[a-z]+-?\d*\s?/gi, '').replace(/[^0-9a-f]/gi, '')
  if (!data || data.length % 2 !== 0) {
    return null
  }
  return `data:${IMAGE_MIME_TYPES[mimeKey]};base64,${hexToBase64(data)}`
}

// 按出现顺序返回 RTF 中的图片，无法显示的图片对应项为 null
export const extractRtfImages = async (rtf, slice) => {
  const images = []
  if (!rtf) {
    return images
  }
  const nextIgnored = new Map(IGNORED_GROUPS.map((group) => [group, -1]))
  // 只在缓存位置已被越过时才重新查找，否则每张图片都要重新扫描整个 RTF
  const findNextIgnored = (from) => {
    let next = Infinity
    nextIgnored.forEach((index, group) => {
      let current = index
      if (current !== Infinity && current < from) {
        current = rtf.indexOf(group, from)
        current = current === -1 ? Infinity : current
        nextIgnored.set(group, current)
      }
      next = Math.min(next, current)
    })
    return next
  }
  let cursor = 0
  let start = rtf.indexOf(PICTURE_GROUP, cursor)
  while (start !== -1) {
    const ignored = findNextIgnored(cursor)
    if (ignored < start) {
      cursor = findGroupEnd(rtf, ignored)
    } else {
      const end = findGroupEnd(rtf, start)
      images.push(parsePicture(stripNestedGroups(rtf, start, end)))
      cursor = end
    }
    start = rtf.indexOf(PICTURE_GROUP, cursor)
    await slice()
  }
  return images
}
