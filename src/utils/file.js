const fileTypes = {
  ai: ['ai', 'eps'],
  app: ['app'],
  axure: ['rp'],
  book: [
    'mobi',
    'oeb',
    'lit',
    'xeb',
    'ebx',
    'rb',
    'pdb',
    'epub',
    'azw3',
    'hlp',
    'chm',
    'wdl',
    'ceb',
    'abm',
    'pdg',
    'caj',
  ],
  css: ['css', 'less', 'sass'],
  dmg: ['dmg'],
  excel: [
    'csv',
    'fods',
    'ods',
    'ots',
    'xls',
    'xlsm',
    'xlsx',
    'xlt',
    'xltm',
    'xltx',
    'et',
    'ett',
  ],
  exe: ['exe'],
  html: ['htm', 'html', 'mht'],
  // prettier-ignore
  img: ['png', 'bmp', 'jpg', 'jpeg', 'gif', 'webp', 'tga', 'exif', 'fpx', 'svg', 'hdri', 'raw', 'ico', 'jfif', 'dib', 'pbm', 'pgm', 'ppm', 'rgb'],
  java: ['jar', 'java'],
  js: ['js', 'jsx', 'ts', 'tsx'],
  json: ['json'],
  keynote: ['key'],
  md: ['md', 'markdown'],
  // prettier-ignore
  music: ['au', 'aif', 'aiff', 'aifc', 'rmi', 'mp3', 'mid', 'cda', 'wav', 'wma', 'ra', 'ram', 'snd', 'mida', 'ogg', 'ape', 'flac', 'aac'],
  numbers: ['numbers'],
  pages: ['pages'],
  pdf: ['pdf'],
  php: ['php'],
  pkg: ['pkg'],
  // prettier-ignore
  ppt: ['fodp', 'odp', 'otp', 'pot', 'potm', 'potx', 'pps', 'ppsm', 'ppsx', 'ppt', 'pptm', 'pptx', 'dps', 'dpt', 'wpp'],
  psd: ['psd'],
  python: ['python'],
  sh: ['sh'],
  sketch: ['sketch'],
  sql: ['sql'],
  text: ['text', 'txt'],
  video: ['mp4', 'avi', 'mov', 'rmvb', 'rm', 'flv', 'mpeg', 'wmv', 'mkv'],
  vue: ['vue'],
  // prettier-ignore
  word: ['doc', 'docm', 'docx', 'dot', 'dotm', 'dotx', 'epub', 'fodt', 'odt', 'ott', 'rtf', 'wps', 'wpt'],
  xmind: ['xmind'],
  // prettier-ignore
  zip: ['zip', 'rar', 'tar', 'gz', 'gzip', 'uue', 'bz2', 'iso', '7z', 'z', 'ace', 'lzh', 'arj', 'cab'],
  font: ['eot', 'otf', 'fon', 'font', 'ttf', 'ttc', 'woff', 'woff2'],
}

export const getFileExtname = (filename) => {
  const splitFileName = filename?.split('.')
  return splitFileName ? splitFileName[splitFileName.length - 1] : undefined
}

export const getFileIcon = (filename) => {
  let iconName = 'common'
  const extname = getFileExtname(filename)
  if (extname) {
    for (const type of Object.keys(fileTypes)) {
      if (fileTypes[type].includes(extname)) {
        iconName = type
      }
    }
  }
  return iconName
}

export const getImageDimensions = (file) => {
  try {
    return new Promise((resolve) => {
      const { type } = file
      if (type.startsWith('image/')) {
        const img = new Image()
        img.onload = () => {
          const width = img.naturalWidth
          const height = img.naturalHeight
          URL.revokeObjectURL(img.src)
          resolve({ width, height }) // 返回宽高对象
        }
        img.onerror = () => {
          // 出错时返回默认尺寸或null，根据需求调整
          resolve({ width: 0, height: 0 })
        }
        img.src = URL.createObjectURL(file)
      } else {
        resolve({ width: 0, height: 0 })
      }
    })
  } catch (e) {
    return null
  }
}

export const dataURLToFile = (dataURL, name) => {
  if (!dataURL || !dataURL.startsWith('data:')) {
    throw new Error('Invalid dataURL')
  }

  const [header, data] = dataURL.split(',')
  const mimeMatch = header.match(/data:(.*?)(;|$)/)

  if (!mimeMatch) {
    throw new Error('Cannot parse mime type from dataURL')
  }
  const [, mime] = mimeMatch

  // mime → 后缀映射
  const extensionMap = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/bmp': 'bmp',
    'image/svg+xml': 'svg',
    'image/avif': 'avif',
  }

  const ext = extensionMap[mime] || mime.split('/')[1] || 'png'
  const filename = `${name}.${ext}`

  let content

  if (header.includes('base64')) {
    const binary = atob(data)
    const buffer = new Uint8Array(binary.length)

    for (let i = 0; i < binary.length; i++) {
      buffer[i] = binary.charCodeAt(i)
    }

    content = buffer
  } else {
    // 非 base64（如 svg+xml;utf8）
    content = decodeURIComponent(data)
  }

  const file = new File([content], filename, { type: mime })

  return { file, filename }
}

export const svgToDataURL = (svg) => {
  let svgString = svg
  if (svg instanceof SVGElement) {
    svgString = new XMLSerializer().serializeToString(svg)
  }
  svgString = svgString
    .replace(/>\s+</g, '><') // 去空格
    .replace(/\n/g, '')
    .trim()
  const encoded = btoa(unescape(encodeURIComponent(svgString)))
  return `data:image/svg+xml;base64,${encoded}`
}

export const imageNodeTypes = new Set(['image', 'inlineImage'])
export const videoNodeTypes = new Set(['video'])
export const audioNodeTypes = new Set(['audio'])
export const fileNodeTypes = new Set(['file'])
export const allFileNodeTypes = new Set([
  ...imageNodeTypes,
  ...videoNodeTypes,
  ...audioNodeTypes,
  ...fileNodeTypes,
])

export const srcAttrs = ['src']
export const urlAttrs = ['url']
export const fileSourceAttrs = [...srcAttrs, ...urlAttrs]
export const fileDeleteDelay = 500
export const fileSearchRange = 80

const isSameNodeType = (nodeTypeSet, nodeTypeList, nodeTypeName) => {
  if (nodeTypeSet) {
    return nodeTypeSet.has(nodeTypeName)
  }
  return !!nodeTypeList?.includes(nodeTypeName)
}

const isSameFileNode = (
  node,
  targetId,
  targetSourceEntries,
  nodeTypeSet,
  nodeTypeList,
) => {
  if (!node || !isSameNodeType(nodeTypeSet, nodeTypeList, node.type.name)) {
    return false
  }

  const { attrs = {} } = node
  for (let i = 0; i < targetSourceEntries.length; i += 1) {
    const [attrName, sourceValue] = targetSourceEntries[i]
    if (attrs[attrName] === sourceValue) {
      return true
    }
  }

  return !!targetId && attrs.id === targetId
}

const getFileSource = (fileNode, sourceAttrs = fileSourceAttrs) => {
  const sourceAttrList = Array.isArray(sourceAttrs) ? sourceAttrs : []
  for (let i = 0; i < sourceAttrList.length; i += 1) {
    const sourceValue = fileNode?.[sourceAttrList[i]]
    if (sourceValue) {
      return sourceValue
    }
  }
  return null
}

export class FileNodeChecker {
  static hasSameNodeInDocument(
    editorState,
    fileNode,
    nodeTypes = allFileNodeTypes,
    sourceAttrs = fileSourceAttrs,
    options = {},
  ) {
    const doc = editorState?.doc
    const targetId = fileNode?.id
    const nodeTypeSet = nodeTypes instanceof Set ? nodeTypes : null
    const nodeTypeList = nodeTypeSet ? null : nodeTypes
    const sourceAttrList = Array.isArray(sourceAttrs) ? sourceAttrs : []
    const position = Number.isFinite(options?.position)
      ? options.position
      : null
    const searchRange = Math.max(0, Number(options?.searchRange) || 120)
    const allowGlobalScan = !!options?.allowGlobalScan
    const targetSourceEntries = []

    for (let i = 0; i < sourceAttrList.length; i += 1) {
      const attrName = sourceAttrList[i]
      const sourceValue = fileNode?.[attrName]
      if (sourceValue) {
        targetSourceEntries.push([attrName, sourceValue])
      }
    }

    if (!doc || (!targetId && targetSourceEntries.length === 0)) {
      return false
    }

    if (position !== null) {
      if (
        isSameFileNode(
          doc.nodeAt(position),
          targetId,
          targetSourceEntries,
          nodeTypeSet,
          nodeTypeList,
        ) ||
        isSameFileNode(
          doc.nodeAt(Math.max(0, position - 1)),
          targetId,
          targetSourceEntries,
          nodeTypeSet,
          nodeTypeList,
        ) ||
        isSameFileNode(
          doc.nodeAt(position + 1),
          targetId,
          targetSourceEntries,
          nodeTypeSet,
          nodeTypeList,
        )
      ) {
        return true
      }

      if (searchRange > 0) {
        const from = Math.max(0, position - searchRange)
        const to = Math.min(doc.content.size, position + searchRange)
        let foundNearPosition = false
        doc.nodesBetween(from, to, (node) => {
          if (
            isSameFileNode(
              node,
              targetId,
              targetSourceEntries,
              nodeTypeSet,
              nodeTypeList,
            )
          ) {
            foundNearPosition = true
            return false
          }
        })
        if (foundNearPosition) {
          return true
        }
      }
    }

    if (!allowGlobalScan) {
      return false
    }

    let found = false
    doc.descendants((node) => {
      if (
        isSameFileNode(
          node,
          targetId,
          targetSourceEntries,
          nodeTypeSet,
          nodeTypeList,
        )
      ) {
        found = true
        return false
      }
    })
    return found
  }
}

export const scheduleFileDelete = ({
  editor,
  options,
  fileNode,
  nodeTypes = allFileNodeTypes,
  matchSourceAttrs = fileSourceAttrs,
  deleteSourceAttrs = matchSourceAttrs,
  delay = fileDeleteDelay,
  searchRange = fileSearchRange,
  deleteTypePrefix = 'image',
}) => {
  const editorInstance = editor?.value
  if (editorInstance?.storage?.versionCompare?.isPreviewing) {
    return
  }

  const deletedFileNode = {
    ...fileNode,
    position: Number.isFinite(fileNode?.position) ? fileNode.position : null,
  }

  setTimeout(() => {
    const currentEditor = editor?.value
    if (currentEditor?.isDestroyed) {
      return
    }

    if (
      FileNodeChecker.hasSameNodeInDocument(
        currentEditor?.state,
        deletedFileNode,
        nodeTypes,
        matchSourceAttrs,
        {
          position: deletedFileNode.position,
          searchRange,
        },
      )
    ) {
      return
    }

    options?.value?.onFileDelete(
      deletedFileNode.id,
      getFileSource(deletedFileNode, deleteSourceAttrs),
      `${deleteTypePrefix}:${deletedFileNode.type}`,
    )
  }, delay)
}
