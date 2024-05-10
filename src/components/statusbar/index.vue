<template>
  <div v-if="!page.preview.enabled" class="status-bar">
    <div class="bar-left">
      <tooltip :content="page.showToc ? '隐藏大纲' : '显示大纲'">
        <t-button
          class="bar-button"
          :class="{ active: page.showToc }"
          variant="text"
          size="small"
          @click="page.showToc = !page.showToc"
        >
          <icon name="toc" color="red" />
        </t-button>
      </tooltip>
      <tooltip
        v-if="options.document.enableSpellcheck"
        :content="$document.spellcheck ? '关闭拼写检查' : '开启拼写检查'"
      >
        <t-button
          class="bar-button"
          :class="{ active: $document.spellcheck }"
          variant="text"
          size="small"
          @click="$document.spellcheck = !$document.spellcheck"
        >
          <icon name="spellcheck" color="red" />
        </t-button>
      </tooltip>
      <!-- <tooltip
        :content="page.pageBreak ? '退出分页模式' : '进入分页模式'"
      >
        <t-button
          class="bar-button"
          :class="{ active: page.pageBreak }"
          variant="text"
          size="small"
          @click="page.pageBreak=!page.pageBreak"
        >
          <icon name="page-break" />
        </t-button>
      </tooltip> -->
      <tooltip content="快捷键">
        <t-button
          class="bar-button"
          variant="text"
          size="small"
          @click="showShortcut = true"
        >
          <icon name="shortcut" />
        </t-button>
      </tooltip>
      <tooltip content="重置编辑器">
        <t-button class="bar-button" variant="text" size="small" @click="reset">
          <icon name="clear-cache" />
        </t-button>
      </tooltip>
      <div class="bar-split"></div>
      <tooltip content="由「有墨文档」提供技术支持">
        <t-button
          class="bar-button"
          variant="text"
          size="small"
          href="https://umodoc.com"
          target="_blank"
        >
          <icon name="home-page" />
        </t-button>
      </tooltip>
      <tooltip content="使用感受和建议反馈">
        <t-button
          class="bar-button"
          variant="text"
          size="small"
          href="https://github.com/umodoc/editor/issues"
          target="_blank"
        >
          <icon name="message" />
        </t-button>
      </tooltip>
      <div class="bar-split"></div>
      <div class="simple-text word-count" v-if="editor">
        已输入 {{ editor.storage.characterCount.characters() }} 字符，{{
          options.document.characterLimit > 0
            ? `总计不能超过 ${options.document.characterLimit} 字符，`
            : ''
        }}已选中 {{ selectionCharacters }} 字符
      </div>
    </div>
    <div class="bar-right">
      <tooltip
        :content="`${page.preview.enabled ? '退出演示' : '演示模式 '} (F5)`"
      >
        <t-button
          class="bar-button"
          :class="{ active: page.preview.enabled }"
          variant="text"
          size="small"
          @click="togglePreview"
        >
          <icon name="preview" />
        </t-button>
      </tooltip>
      <tooltip
        :content="`${fullscreen.isFullscreen ? '退出全屏' : '全屏模式'} (F11 / ⌘+F11)`"
      >
        <t-button
          class="bar-button"
          variant="text"
          size="small"
          @click="fullscreen.toggle"
        >
          <icon
            :name="fullscreen.isFullscreen ? 'full-screen-exit' : 'full-screen'"
          />
        </t-button>
      </tooltip>
      <div class="bar-split"></div>
      <div class="zoom-level-bar">
        <tooltip :content="`减小缩放 (${getShortcut('Ctrl-')})`">
          <t-button
            class="bar-button"
            variant="text"
            size="small"
            :disabled="page.zoomLevel <= 20"
            @click="zoomOut"
          >
            <icon name="minus" />
          </t-button>
        </tooltip>
        <t-slider
          v-model="page.zoomLevel"
          :min="20"
          :max="500"
          :step="10"
          :tooltip-props="{
            showArrow: false,
            theme: 'light',
            popperOptions: {
              modifiers: [{ name: 'offset', options: { offset: [0, 2] } }],
            },
          }"
          label="当前缩放比例: ${value}%%"
        />
        <tooltip :content="`增加缩放 (${getShortcut('Ctrl+')})`">
          <t-button
            class="bar-button"
            variant="text"
            size="small"
            :disabled="page.zoomLevel >= 500"
            @click="zoomIn"
          >
            <icon name="plus" />
          </t-button>
        </tooltip>
        <tooltip :content="`最佳宽度 (${getShortcut('Ctrl0')})`">
          <t-button
            class="bar-button"
            :class="{ active: page.autoWidth }"
            variant="text"
            size="small"
            @click="autoWidth(true)"
          >
            <icon name="auto-width" />
          </t-button>
        </tooltip>
        <tooltip :content="`点击快速设置为 100% (${getShortcut('Ctrl1')})`">
          <t-button
            class="bar-button zoom-button"
            variant="text"
            size="small"
            @click="zoomReset"
          >
            {{ page.zoomLevel }}%
          </t-button>
        </tooltip>
      </div>
    </div>
  </div>
  <div v-else class="preview-bar">
    <div
      class="item"
      :class="{ active: page.preview.laserPointer }"
      @click="page.preview.laserPointer = !page.preview.laserPointer"
    >
      <icon name="laser-pointer" />
      激光笔
    </div>
    <div class="item" @click="togglePreview">
      <icon name="exit" />
      退出
    </div>
  </div>
  <t-drawer
    v-model:visible="showShortcut"
    :attach="container"
    size="320px"
    :footer="false"
    close-btn
    destroy-on-close
    show-in-attached-element
  >
    <template #header>
      <div class="shortcut-drawer-header">
        <icon name="shortcut" />
        快捷键列表
      </div>
    </template>
    <statusbar-shortcuts />
  </t-drawer>
</template>

<script setup>
import getShortcut from '@/utils/shortcut'

const { container, options, page, editor } = useStore()
const $document = useState('document')

// 快捷键抽屉
const showShortcut = $ref(false)

const reset = inject('reset')

// 字数统计
const selectionCharacters = computed(() => {
  const { state } = editor.value
  if (state) {
    const { selection } = state
    const text = state.doc.textBetween(selection.from, selection.to, '')
    return text.length
  }
  return 0
})

// 页面全屏
let fullscreen = $ref({})
onMounted(() => {
  fullscreen = useFullscreen(document.querySelector(container))
  useHotkeys('f11, command+f11', fullscreen.toggle)
})

// 演示模式
const togglePreview = async () => {
  page.value.showToc = false
  page.value.preview.enabled = !page.value.preview.enabled
  if (page.value.preview.enabled) {
    document.querySelector(`${container} .zoomable-container`).scrollTop = 0
  }
}
onMounted(() => useHotkeys('f5', togglePreview))
watch(
  () => page.value.preview.enabled,
  (val) => {
    if (val) {
      fullscreen.enter()
      autoWidth(false, 10)
    } else {
      fullscreen.exit()
      zoomReset()
    }
  },
)
watch(
  () => fullscreen.isFullscreen,
  (val) => {
    if (!val) page.value.preview.enabled = false
  },
  { deep: true },
)

// 页面缩放
const zoomIn = () => {
  if (page.value.zoomLevel < 500) {
    page.value.zoomLevel = page.value.zoomLevel + 10
    page.value.autoWidth = false
  }
}
const zoomOut = () => {
  if (page.value.zoomLevel > 20) {
    page.value.zoomLevel = page.value.zoomLevel - 10
    page.value.autoWidth = false
  }
}
const zoomReset = () => {
  page.value.zoomLevel = 100
  page.value.autoWidth = false
}
useHotkeys('ctrl+-,command+-', zoomOut)
useHotkeys('ctrl+=,command+=', zoomIn)
useHotkeys('ctrl+1,command+1', zoomReset)

// 最佳宽度
const autoWidth = (auto, padding = 50) => {
  if (auto && page.value.autoWidth) {
    zoomReset()
    return
  }
  try {
    const editorEl = document.querySelector(`${container} .zoomable-container`)
    const pageEl = editorEl.querySelector('.page-content')
    const editorWidth = editorEl.clientWidth
    const pageWidth = pageEl.clientWidth
    page.value.zoomLevel = parseInt(
      ((editorWidth - padding * 2) / pageWidth) * 100,
    )
    page.value.autoWidth = true
  } catch (e) {
    page.value.autoWidth = false
    useMessage('error', '页面自动宽度计算出错')
    console.warn('Page auto width calculation error', e)
  }
}
useHotkeys('ctrl+0,command+0', autoWidth)

watch(
  () => page.value.showToc,
  () => {
    if (page.value.autoWidth) autoWidth()
  },
)
</script>

<style lang="less" scoped>
.status-bar {
  padding: 6px 10px;
  display: flex;
  justify-content: space-between;
  font-size: var(--umo-font-size-small);
  border-top: solid 1px var(--umo-border-color);

  @media screen and (max-width: 640px) {
    overflow-x: auto;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .bar-split {
    height: 16px;
    width: 1px;
    background-color: var(--umo-border-color);
    margin: 0 10px;
  }
  .bar-button {
    --td-comp-size-xs: 18px;
    --td-comp-paddingLR-l: 8px;
    --td-radius-default: 2px;
    font-size: 14px;
    margin: 0 4px;
    &:not(.zoom) {
      width: var(--td-comp-size-xs);
    }
    :deep(.umo-button__text) {
      padding: 0 5px;
    }
    &.active {
      background-color: var(--umo-button-hover-background);
      border-color: var(--umo-button-hover-background);
      color: var(--umo-primary-color);
    }
  }
  .bar-left {
    display: flex;
    align-items: center;
    .word-count {
      @media screen and (max-width: 960px) {
        display: none;
      }
    }
  }

  .bar-right {
    display: flex;
    align-items: center;
    .zoom-level-bar {
      width: 240px;
      display: flex;
      --td-comp-size-xxxs: 8px;
      --td-size-2: 3px;
      --td-brand-color: var(--umo-text-color);
      :deep(.umo-slider__button) {
        background: var(--td-brand-color);
        border: none;
        box-shadow: none;
      }
      :deep(.umo-slider__track) {
        background: none;
      }
    }

    .zoom-button {
      font-size: var(--umo-font-size-small);
      width: 64px;
    }
  }
}
.preview-bar {
  position: absolute;
  right: 50px;
  bottom: 50px;
  border-radius: 10px;
  padding: 10px;
  overflow: hidden;
  cursor: pointer;
  user-select: none;
  &::before {
    position: absolute;
    content: '';
    display: block;
    left: -20px;
    right: -20px;
    top: -20px;
    bottom: -20px;
    background-color: rgba(0, 0, 0, 0.3);
    filter: blur(3px);
    z-index: 0;
  }
  .item {
    color: var(--umo-color-white);
    padding: 10px 12px;
    border-radius: 8px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 1;
    &:not(:last-child) {
      margin-bottom: 8px;
    }
    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
    &.active {
      background-color: var(--umo-primary-color);
    }
    :deep(.icon) {
      font-size: 24px;
      margin-bottom: 5px;
    }
  }
}
</style>

<style lang="less">
.editor-powerby {
  font-size: var(--umo-font-size-small);
  a {
    text-decoration: none;
    color: var(--umo-text-color);
    &:hover {
      color: var(--umo-primary-color);
      text-decoration: underline;
    }
  }
}
.umo-editor-container.preview-mode {
  .zoomable-container {
    padding: 10px !important;
  }
}
.shortcut-drawer-header {
  display: flex;
  align-items: center;
  font-weight: 400;
  color: var(--umo-text-color);
  .icon {
    font-size: 20px;
    margin-right: 6px;
  }
}
.umo-drawer__close-btn {
  margin-right: 3px;
}
</style>
