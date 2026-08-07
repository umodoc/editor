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
        <div
          class="umo-mermaid-render"
          :class="{ 'is-invalid': isRenderError }"
        >
          <div
            class="umo-mermaid-title"
            v-text="t('tools.mermaid.preview')"
          ></div>
          <div class="umo-mermaid-error" v-if="errorTxt">
            {{ errorTxt }}
          </div>
          <div
            v-else
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
import { svgBoundsNormalizer } from '@/utils/svg-normalizer'

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
  useCopy(mermaidCode, t('tools.mermaid.copied'), container)
}

// 初始化 Mermaid
const mermaidInit = () => {
  const { mermaid } = window
  if (!mermaid) return
  mermaid.initialize({
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
let errorTxt = $ref('')
let isRenderError = $ref(false)
const mermaidRef = $ref(null)
let renderedSvgSize = $ref({ width: 0, height: 0 })

const renderMermaid = async () => {
  const { mermaid } = window

  if (!mermaid) {
    svgCode = ''
    renderedSvgSize = { width: 0, height: 0 }
    errorTxt = t('tools.mermaid.notLoaded')
    isRenderError = false
    return
  }

  if (!mermaidCode || mermaidCode.trim() === '') {
    svgCode = ''
    renderedSvgSize = { width: 0, height: 0 }
    errorTxt = t('tools.mermaid.codeEmpty')
    isRenderError = false
    return
  }

  const renderId = `mermaid-svg-${shortId(8)}`

  try {
    const { svg } = await mermaid.render(renderId, mermaidCode)
    svgCode = svg
    await nextTick()
    const renderedSvg = mermaidRef?.querySelector('svg')
    const normalizedSvg = renderedSvg
      ? svgBoundsNormalizer.normalize(renderedSvg, { mutate: true })
      : svgBoundsNormalizer.normalize(svg)
    svgCode = normalizedSvg.svg
    renderedSvgSize = {
      width: normalizedSvg.width,
      height: normalizedSvg.height,
    }
    errorTxt = ''
    isRenderError = false
  } catch (err) {
    svgCode = ''
    renderedSvgSize = { width: 0, height: 0 }
    errorTxt = t('tools.mermaid.renderError')
    isRenderError = true
  }
}

watch(
  () => dialogVisible,
  async (visible) => {
    if (visible) {
      localConfig = { ...props.config }
      mermaidCode = props.content || 'graph TB\na-->b'
      isRenderError = false
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
    if (errorTxt) {
      useMessage('error', {
        attach: container,
        content: t('tools.mermaid.renderError'),
      })
      return
    }

    const svg = mermaidRef?.querySelector('svg')

    if (!svg) {
      return
    }

    const { attrs } = getSelectionNode(editor.value) || {}
    const width =
      renderedSvgSize.width ||
      svgBoundsNormalizer.parseNumber(svg.getAttribute('width'))
    const height =
      renderedSvgSize.height ||
      svgBoundsNormalizer.parseNumber(svg.getAttribute('height'))

    const imageOptions = {
      id: shortId(10),
      type: 'mermaid',
      src: svgToDataURL(svg),
      config: JSON.stringify(localConfig),
      content: mermaidCode,
      alt: t('tools.mermaid.text'),
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
    .umo-mermaid-error {
      height: 320px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--umo-text-color-light);
      font-size: 12px;
    }
    .umo-mermaid-svg {
      box-sizing: border-box;
      height: 320px;
      padding: 40px 20px 20px;
      overflow: auto;
      display: flex;
      justify-content: center;
    }

    &.is-invalid {
      border-color: rgba(231, 36, 36, 0.18);
      background-color: rgba(231, 36, 36, 0.04);

      .umo-mermaid-title {
        color: var(--td-error-color);
        background-color: rgba(231, 36, 36, 0.08);
      }

      .umo-mermaid-error {
        color: var(--td-error-color);
        background-color: transparent;
      }
    }
  }
}
.umo-mermaid-keep-size {
  position: absolute;
  bottom: 30px;
}
</style>
