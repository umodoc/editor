<template>
  <menus-button
    :ico="content ? 'edit' : 'mermaid'"
    :text="content ? t('tools.mermaid.edit') : t('tools.mermaid.text')"
    huge
    @menu-click="dialogVisible = true"
  >
    <modal
      :visible="dialogVisible"
      icon="mermaid"
      width="960px"
      @confirm="setMermaid"
      @close="dialogVisible = false"
    >
      <template #header>
        <icon name="mermaid" />
        {{ content ? t('tools.mermaid.edit') : t('tools.mermaid.text') }}
      </template>
      <div class="umo-mermaid-container">
        <div class="umo-mermaid-editor">
          <div class="umo-mermaid-toolbar">
            <menus-button
              style="width: 100px"
              menu-type="select"
              :text="t('tools.mermaid.theme')"
              :select-options="themes"
              :select-value="localConfig.theme"
              @menu-click="(value) => (localConfig.theme = value)"
            />
            <menus-button
              ico="copy"
              :tooltip="t('tools.mermaid.copy')"
              hide-text
              @menu-click="copyCode"
            />
            <menus-button
              ico="node-delete"
              :tooltip="t('tools.mermaid.clear')"
              hide-text
              @menu-click="mermaidCode = ''"
            />
          </div>
          <t-textarea
            v-model="mermaidCode"
            class="umo-mermaid-code"
            autofocus
            :placeholder="t('tools.mermaid.placeholder')"
          />
        </div>
        <div class="umo-mermaid-render">
          <div
            class="umo-mermaid-title"
            v-text="t('tools.mermaid.preview')"
          ></div>
          <div
            ref="mermaidRef"
            class="umo-mermaid-svg umo-scrollbar"
            v-html="svgCode"
          ></div>
        </div>
      </div>
      <t-checkbox
        class="umo-mermaid-keep-size"
        v-if="content && content !== ''"
        v-model="keepSize"
      >
        {{ t('tools.mermaid.keepSize') }}
      </t-checkbox>
    </modal>
  </menus-button>
</template>

<script setup>
import { getSelectionNode } from '@/utils/selection'
import { shortId } from '@/utils/short-id'
import { svgToDataURL } from '@/utils/file'

const props = defineProps({
  config: {
    type: Object,
    default: () => ({
      theme: 'default',
    }),
  },
  content: {
    type: String,
    default: undefined,
  },
})

const editor = inject('editor')
const container = inject('container')

let dialogVisible = $ref(false)

// 工具栏
const themes = [
  { label: t('tools.mermaid.themes.default'), value: 'default' },
  { label: t('tools.mermaid.themes.base'), value: 'base' },
  { label: t('tools.mermaid.themes.dark'), value: 'dark' },
  { label: t('tools.mermaid.themes.forest'), value: 'forest' },
  { label: t('tools.mermaid.themes.neutral'), value: 'neutral' },
]
let localConfig = $ref({})

const copyCode = () => {
  const { copy } = useClipboard({
    source: mermaidCode,
  })
  copy()
  useMessage('success', {
    attach: container,
    content: t('tools.mermaid.copied'),
  })
}

// 判断是否包含中文
const hasChinese = (text = '') => /[\u4e00-\u9fff]/.test(text)

// 判断文本是否已经被双引号包裹
const isQuoted = (text = '') => {
  const value = String(text).trim()
  return value.startsWith('"') && value.endsWith('"')
}

// 如果包含中文且未加引号，则补双引号
const quoteIfChinese = (text = '') => {
  const value = String(text).trim()
  if (!value) return text
  if (!hasChinese(value)) return text
  if (isQuoted(value)) return text
  return `"${value}"`
}

// Mermaid 通用中文兼容处理
const fixMermaidChinese = (code = '') => {
  if (!code) return code

  let result = code

  // 1. |文本| -> |"文本"|
  result = result.replace(/\|([^|\n]+)\|/g, (match, text) => {
    return `|${quoteIfChinese(text)}|`
  })

  // 2. [文本] / {文本} / (文本)
  result = result.replace(
    /(\[[^[\]\n]*\]|\{[^{}\n]*\}|\([^()\n]*\))/g,
    (match) => {
      const [left] = match
      const right = match[match.length - 1]
      const inner = match.slice(1, -1)

      if (!hasChinese(inner) || isQuoted(inner.trim())) return match
      return `${left}${quoteIfChinese(inner)}${right}`
    },
  )

  // 3. 双圆括号 ((文本))
  result = result.replace(/\(\(([^()\n]*)\)\)/g, (match, text) => {
    if (!hasChinese(text) || isQuoted(text.trim())) return match
    return `((${quoteIfChinese(text)}))`
  })

  // 4. 异形节点 A>文本]
  result = result.replace(/>([^[\]\n<>]+)\]/g, (match, text) => {
    if (!hasChinese(text) || isQuoted(text.trim())) return match
    return `>${quoteIfChinese(text)}]`
  })

  // 5. subgraph 标题
  result = result.replace(
    /^(\s*subgraph\s+)(.+)$/gm,
    (match, prefix, title) => {
      const value = title.trim()
      if (!hasChinese(value) || isQuoted(value)) return match
      return `${prefix}${quoteIfChinese(value)}`
    },
  )

  // 6. participant A as 中文
  result = result.replace(
    /^(\s*participant\s+[^\s]+\s+as\s+)(.+)$/gm,
    (match, prefix, title) => {
      const value = title.trim()
      if (!hasChinese(value) || isQuoted(value)) return match
      return `${prefix}${quoteIfChinese(value)}`
    },
  )

  // 7. actor 中文 / actor A as 中文
  result = result.replace(
    /^(\s*actor\s+)(.+)$/gm,
    (match, restPrefix, rest) => {
      const value = rest.trim()

      // actor A as 中文
      const asMatch = value.match(/^([^\s]+\s+as\s+)(.+)$/)
      if (asMatch) {
        const [, prefix, title] = asMatch
        return `${restPrefix}${prefix}${quoteIfChinese(title)}`
      }

      // actor 中文
      if (!hasChinese(value) || isQuoted(value)) return match
      return `${restPrefix}${quoteIfChinese(value)}`
    },
  )

  return result
}

// 初始化 Mermaid
const mermaidInit = () => {
  mermaid.mermaidAPI.initialize({
    darkMode: false,
    startOnLoad: false,
    fontSize: 12,
    securityLevel: 'loose',
    ...localConfig,
  })
}

// 渲染 Mermaid
let mermaidCode = $ref(props.content || '')
let svgCode = $ref('')
const mermaidRef = $ref(null)

const renderMermaid = async () => {
  if (!mermaidCode || mermaidCode.trim() === '') {
    svgCode = ''
    return
  }

  const safeCode = fixMermaidChinese(mermaidCode)
  const renderId = `mermaid-svg-${shortId(8)}`

  try {
    svgCode = await new Promise((resolve) => {
      mermaid.mermaidAPI.render(renderId, safeCode, (svg) => {
        resolve(svg)
      })
    })
  } catch {
    svgCode = ''
    useMessage('error', {
      attach: container,
      content: t('tools.mermaid.renderError'),
    })
  }
}

watch(
  () => dialogVisible,
  async (visible) => {
    if (visible) {
      localConfig = { ...props.config }
      mermaidCode = props.content || 'graph TB\na-->b'
      await nextTick()
      mermaidInit()
      renderMermaid()
    }
  },
  { immediate: true },
)

watch(
  () => [localConfig.theme, mermaidCode],
  async () => {
    if (!dialogVisible || !mermaidCode || mermaidCode === '') return
    await nextTick()
    mermaidInit()
    renderMermaid()
  },
)

// 创建或更新 Mermaid
const keepSize = $ref(false)
const setMermaid = () => {
  if (mermaidCode === '') {
    useMessage('error', {
      attach: container,
      content: t('tools.mermaid.notEmpty'),
    })
    return
  }

  if (!props.content || (props.content && props.content !== mermaidCode)) {
    const svg = mermaidRef?.querySelector('svg')

    if (!svg) {
      return
    }

    const hasError = svg.querySelector('.error-icon')
    if (hasError) {
      useMessage('error', {
        attach: container,
        content: t('tools.mermaid.renderError'),
      })
      return
    }

    const { width, height } = svg.getBoundingClientRect()
    const { attrs } = getSelectionNode(editor.value) || {}

    const imageOptions = {
      id: shortId(10),
      type: 'mermaid',
      src: svgToDataURL(svgCode),
      config: JSON.stringify(localConfig),
      content: mermaidCode,
      width: keepSize ? attrs?.width || width : width,
      height: keepSize ? attrs?.height || height : height,
      equalProportion: false,
    }

    editor.value?.chain().focus().setImage(imageOptions, !!props.content).run()
  }

  dialogVisible = false
}
</script>

<style lang="less" scoped>
.umo-mermaid-container {
  display: flex;
  .umo-mermaid-editor {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .umo-mermaid-toolbar {
    display: flex;
    align-items: center;
    padding: 2px;
  }
  .umo-mermaid-code {
    width: 320px;
    margin-left: 2px;
    flex: 1;
    :deep(.umo-textarea__inner) {
      height: 100%;
      resize: none;
    }
  }
  .umo-mermaid-render {
    flex: 1;
    margin-left: 20px;
    border: solid 1px var(--td-border-level-2-color);
    border-radius: var(--umo-radius);
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    .umo-mermaid-title {
      background-color: var(--umo-button-hover-background);
      padding: 0 10px;
      position: absolute;
      font-size: 12px;
      border-bottom-right-radius: var(--umo-radius);
    }
    .umo-mermaid-svg {
      box-sizing: border-box;
      height: 320px;
      padding: 40px 20px 20px;
      overflow: auto;
      display: flex;
      justify-content: center;
    }
  }
}
.umo-mermaid-keep-size {
  position: absolute;
  bottom: 30px;
}
</style>
