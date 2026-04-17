<template>
  <menus-button
    :text="t('base.fontFamily.text')"
    :placeholder="t('base.fontFamily.text')"
    menu-type="select"
    hide-text
    :select-value="selectedFont"
    :style="{ width: $toolbar.mode !== 'classic' ? '143px' : '90px' }"
    filterable
    :disabled="!editor?.can().chain().focus().setFontFamily().run()"
    @menu-click="setFontFamily"
  >
    <t-option-group
      v-for="(group, index) in allFonts"
      :key="index"
      :label="group.label"
      :divider="false"
    >
      <t-option
        v-for="item in group.children"
        :key="item.value"
        class="umo-font-family-item"
        :value="item.value"
        :label="l(item.label)"
      >
        <span :style="{ fontFamily: item.value }">
          {{ l(item.label) }}
          <span
            v-if="!isFontSupported(item)"
            :title="t('base.fontFamily.unsupport')"
            class="umo-font-family-unsupport"
            >!</span
          >
        </span>
        <span v-if="!isFontSupported(item)" class="umo-font-family-unsupport">
          <span
            v-if="canDownloadFont(item) || isDownloadingFont(item.value)"
            class="umo-font-family-download"
            :class="{ 'is-loading': isDownloadingFont(item.value) }"
            :title="
              isDownloadingFont(item.value)
                ? t('base.fontFamily.downloading')
                : t('base.fontFamily.downloadActionTip')
            "
            @mousedown.stop.prevent
            @click.stop.prevent="
              canDownloadFont(item) ? downloadAndEnableFont(item) : null
            "
          >
            <icon name="download" size="14" />
          </span>
        </span>
      </t-option>
    </t-option-group>
  </menus-button>
</template>

<script setup>
import { isString } from '@tool-belt/type-predicates'

import { MessagePlugin } from '@/composables/dialog'

const editor = inject('editor')
const options = inject('options')
const $toolbar = useState('toolbar', options)
const $recent = useState('recent', options)
const typeWriterIsRunning = inject('typeWriterIsRunning')

const usedFonts = $ref([])
const fontStatusMap = $ref({})
const downloadingFonts = $ref([])
const autoDownloadedFonts = $ref([])
let autoDownloadRunning = $ref(false)
let restoringDownloadedFonts = $ref(true)

const selectedFont = computed(() => {
  if (!editor.value || typeWriterIsRunning.value) {
    return null
  }
  if (!editor.value?.getAttributes('textStyle').fontFamily) {
    return null
  }
  return editor.value.getAttributes('textStyle').fontFamily.replace(/"/g, '')
})

const ensureRecentState = () => {
  if (!Array.isArray($recent.value.fonts)) {
    $recent.value.fonts = []
  }
  if (!Array.isArray($recent.value.downloadedFonts)) {
    $recent.value.downloadedFonts = []
  }
}

const commitRecentState = (patch = {}) => {
  ensureRecentState()
  // Replace object to ensure useStorage persists recent state.
  const nextState = {
    ...$recent.value,
    ...patch,
  }
  $recent.value = nextState
}

const normalizeFontFamily = (font) => {
  if (!isString(font)) {
    return ''
  }
  return font
    .split(',')[0]
    .trim()
    .replace(/^["']|["']$/g, '')
}

const measureCanvas = document.createElement('canvas')
const measureContext = measureCanvas.getContext('2d')
const baseFamilies = ['monospace', 'serif', 'sans-serif']
const detectTexts = ['WwMmIi123', '汉字測試', 'AaBbCcXxYyZz']
const signatureCache = {}

const toFixedMetric = (value) => {
  if (!Number.isFinite(value)) {
    return '0'
  }
  return value.toFixed(2)
}

const measureSignature = (fontStack) => {
  if (!measureContext) {
    return ''
  }
  measureContext.font = `72px ${fontStack}`
  return detectTexts
    .map((text) => {
      const metrics = measureContext.measureText(text)
      return [
        toFixedMetric(metrics.width),
        toFixedMetric(metrics.actualBoundingBoxLeft),
        toFixedMetric(metrics.actualBoundingBoxRight),
      ].join(':')
    })
    .join('|')
}

const detectByCanvas = (font) => {
  if (!measureContext) {
    return true
  }
  baseFamilies.forEach((base) => {
    if (!signatureCache[base]) {
      signatureCache[base] = measureSignature(base)
    }
  })
  return baseFamilies.some((base) => {
    const candidate = measureSignature(`"${font}", ${base}`)
    return candidate !== signatureCache[base]
  })
}

const detectFontAvailability = (font) => {
  if (!font) {
    return true
  }
  const normalizedFont = normalizeFontFamily(font)
  if (!normalizedFont) {
    return false
  }
  return detectByCanvas(normalizedFont)
}

const setFontStatus = (font, supported) => {
  if (!font) {
    return
  }
  fontStatusMap[font] = supported
}

const refreshFontSupportStatus = () => {
  const fonts = options.value.dicts?.fonts || []
  fonts.forEach((item) => {
    if (item?.value || item?.value === null) {
      setFontStatus(item.value, detectFontAvailability(item.value))
    }
  })
}

const isDownloadingFont = (font) => downloadingFonts.includes(font)

const isFontSupported = (item) => {
  if (!item?.value) {
    return true
  }
  if (fontStatusMap[item.value] === undefined) {
    setFontStatus(item.value, detectFontAvailability(item.value))
  }
  return !!fontStatusMap[item.value]
}

const canDownloadFont = (item) =>
  !!item?.value && !!item?.url && !isDownloadingFont(item.value)

const buildFontSource = (item) => {
  const source = `url("${item.url}")`
  if (!item.format) {
    return source
  }
  return `${source} format("${item.format}")`
}

const persistDownloadedFont = (item) => {
  ensureRecentState()
  const downloaded = Array.isArray($recent.value.downloadedFonts)
    ? $recent.value.downloadedFonts
    : []
  const next = downloaded.filter((font) => font?.value !== item.value)
  next.unshift({
    value: item.value,
    url: item.url,
    format: item.format,
    style: item.style,
    weight: item.weight,
  })
  commitRecentState({
    downloadedFonts: next.slice(0, 50),
  })
}

const loadWebFont = async (
  fontItem,
  { silent = false, persist = true } = {},
) => {
  if (!fontItem?.value || !fontItem?.url || isDownloadingFont(fontItem.value)) {
    return false
  }
  // Skip network if font is already available in current browser context.
  if (detectFontAvailability(fontItem.value)) {
    setFontStatus(fontItem.value, true)
    if (persist) {
      persistDownloadedFont(fontItem)
    }
    return true
  }
  downloadingFonts.push(fontItem.value)
  try {
    const fontFace = new FontFace(fontItem.value, buildFontSource(fontItem), {
      style: fontItem.style || 'normal',
      weight: fontItem.weight || '400',
      display: 'swap',
    })
    await fontFace.load()
    document.fonts.add(fontFace)
    await document.fonts.load(`16px "${fontItem.value}"`)
    setFontStatus(fontItem.value, detectFontAvailability(fontItem.value))
    if (persist) {
      persistDownloadedFont(fontItem)
    }
    if (!silent) {
      useMessage(
        'success',
        t('base.fontFamily.downloadSuccess', { font: l(fontItem.label) }),
      )
    }
    return true
  } catch {
    setFontStatus(fontItem.value, false)
    if (!silent) {
      useMessage(
        'error',
        t('base.fontFamily.downloadFailed', { font: l(fontItem.label) }),
      )
    }
    return false
  } finally {
    const index = downloadingFonts.indexOf(fontItem.value)
    if (index > -1) {
      downloadingFonts.splice(index, 1)
    }
  }
}

const restoreDownloadedFonts = async () => {
  ensureRecentState()
  for (const item of $recent.value.downloadedFonts) {
    if (!item?.value) {
      continue
    }
    const configFont = options.value.dicts?.fonts?.find(
      ({ value }) => value === item.value,
    )
    const target = {
      ...item,
      ...configFont,
      value: configFont?.value || item.value,
      url: configFont?.url || item.url,
    }
    // If already available, do not redownload.
    if (detectFontAvailability(target.value)) {
      setFontStatus(target.value, true)
      continue
    }
    if (target.url) {
      await loadWebFont(target, { silent: true, persist: false })
    }
  }
  refreshFontSupportStatus()
}

const downloadAndEnableFont = async (item) => {
  if (!item?.url) {
    useMessage('warning', t('base.fontFamily.noDownloadUrl'))
    return
  }
  useMessage(
    'loading',
    t('base.fontFamily.downloadStart', {
      font: l(item.label),
    }),
  )
  const downloaded = await loadWebFont(item, { silent: false, persist: true })
  if (downloaded) {
    setFontFamily(item.value)
  }
}

const allFonts = computed(() => {
  ensureRecentState()
  const all = [
    {
      label: t('base.fontFamily.all'),
      children: options.value.dicts?.fonts,
    },
  ]
  // 通过字体值获取字体列表
  const getFontsByValues = (values) => {
    return values
      .map((item) =>
        options.value.dicts?.fonts.find(({ value }) => value === item),
      )
      .filter(Boolean)
  }
  if ($recent.value.fonts.length > 0) {
    all.unshift({
      label: t('base.fontFamily.recent'),
      children: getFontsByValues($recent.value.fonts),
    })
  }
  if (usedFonts.length > 0) {
    all.unshift({
      label: t('base.fontFamily.used'),
      children: getFontsByValues(usedFonts),
    })
  }
  return all
})

const collectFontFamiliesFromNode = (node, resultSet) => {
  if (!node) {
    return
  }
  const marks = Array.isArray(node.marks) ? node.marks : []
  for (const mark of marks) {
    const fontFamily = normalizeFontFamily(mark?.attrs?.fontFamily)
    if (fontFamily) {
      resultSet.add(fontFamily)
    }
  }
  const content = Array.isArray(node.content) ? node.content : []
  for (const child of content) {
    collectFontFamiliesFromNode(child, resultSet)
  }
}

const getUsedFontValues = () => {
  const doc = editor.value?.getJSON()
  const fontSet = new Set()
  collectFontFamiliesFromNode(doc, fontSet)
  return [...fontSet]
}

// 获取当前文档中所有已使用的字体
const getUsedFonts = () => {
  const values = getUsedFontValues()
  for (const font of values) {
    if (!usedFonts.includes(font)) {
      usedFonts.push(font)
    }
  }
}

const autoDownloadDocumentFonts = async () => {
  if (restoringDownloadedFonts) {
    return
  }
  if (autoDownloadRunning) {
    return
  }
  const downloadedFontValues = new Set(
    ($recent.value.downloadedFonts || [])
      .map((item) => item?.value)
      .filter(Boolean),
  )
  const usedFontValues = getUsedFontValues()
  const targets = usedFontValues
    .map((value) =>
      options.value.dicts?.fonts?.find((item) => item.value === value),
    )
    .filter(
      (item) =>
        item?.url &&
        !isFontSupported(item) &&
        !isDownloadingFont(item.value) &&
        !autoDownloadedFonts.includes(item.value) &&
        !downloadedFontValues.has(item.value),
    )
  if (!targets.length) {
    return
  }
  autoDownloadRunning = true
  try {
    // Keep only one auto-download loading message visible.
    MessagePlugin.closeAll()
    useMessage('loading', {
      content: t('base.fontFamily.autoDownloadStart'),
      duration: 0,
    })
    let downloadedCount = 0
    for (const item of targets) {
      const downloaded = await loadWebFont(item, {
        silent: true,
        persist: true,
      })
      if (downloaded) {
        downloadedCount += 1
        if (!autoDownloadedFonts.includes(item.value)) {
          autoDownloadedFonts.push(item.value)
        }
      }
    }
    refreshFontSupportStatus()
    MessagePlugin.closeAll()
    if (downloadedCount > 0) {
      useMessage('success', t('base.fontFamily.autoDownloadDone'))
    }
  } finally {
    autoDownloadRunning = false
  }
}

const setFontFamily = (fontFamily) => {
  if (fontFamily) {
    const nextFonts = $recent.value.fonts.filter((item) => item !== fontFamily)
    nextFonts.unshift(fontFamily)
    commitRecentState({
      fonts: nextFonts.slice(0, 10),
    })
  }
  editor.value?.chain().focus().setFontFamily(fontFamily).run()
  getUsedFonts()
}

watch(
  () => editor.value,
  (val, _, onCleanup) => {
    if (val) {
      getUsedFonts()
      autoDownloadDocumentFonts()
      val.on('update', autoDownloadDocumentFonts)
      onCleanup(() => val.off('update', autoDownloadDocumentFonts))
    }
  },
)

watch(
  () => options.value.dicts?.fonts,
  () => {
    refreshFontSupportStatus()
  },
  { deep: true, immediate: true },
)

onMounted(async () => {
  ensureRecentState()
  restoringDownloadedFonts = true
  await restoreDownloadedFonts()
  restoringDownloadedFonts = false
  await autoDownloadDocumentFonts()
})
</script>

<style lang="less">
.umo-font-family-item {
  > span {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    width: 100%;
    .umo-font-family-unsupport {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: var(--umo-error-color);
      font-size: 14px;
    }
    .umo-font-family-download {
      color: var(--umo-text-color-light);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      margin-left: 12px;
      user-select: none;
      &:hover {
        color: var(--umo-primary-color);
      }
    }
  }
}
</style>
