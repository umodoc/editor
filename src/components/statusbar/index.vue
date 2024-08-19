<template>
  <div v-if="!page.preview.enabled" class="status-bar">
    <div class="bar-left">
      <tooltip :content="page.showToc ? t('toc.hide') : t('toc.show')">
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
        :content="
          $document.spellcheck
            ? t('spellcheck.disable')
            : t('spellcheck.enable')
        "
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
      <tooltip
        :content="
          page.pagination ? t('pagination.disable') : t('pagination.title')
        "
      >
        <t-button
          class="bar-button"
          :class="{ active: page.pagination }"
          variant="text"
          size="small"
          @click="togglePagination"
        >
          <icon name="page-break" />
        </t-button>
      </tooltip>
      <tooltip :content="t('shortcut.title')">
        <t-button
          class="bar-button"
          variant="text"
          size="small"
          @click="showShortcut = true"
        >
          <icon name="shortcut" />
        </t-button>
      </tooltip>
      <tooltip :content="t('resetAll.title')">
        <t-button class="bar-button" variant="text" size="small" @click="reset">
          <icon name="clear-cache" />
        </t-button>
      </tooltip>
      <div class="bar-split"></div>
      <tooltip :content="t('poweredBy')">
        <t-button
          class="bar-button"
          variant="text"
          size="small"
          :href="`https://editor.umodoc.com/${i18n.global.locale.value === 'zh-CN' ? 'cn' : 'en'}/docs`"
          target="_blank"
        >
          <icon name="home-page" />
        </t-button>
      </tooltip>
      <tooltip :content="t('feedback')">
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
      <t-popup
        v-if="editor"
        v-model="showWordCount"
        trigger="click"
        placement="top-left"
      >
        <t-button
          class="bar-button auto-width word-count"
          variant="text"
          size="small"
        >
          <span v-if="selectionCharacters > 0">
            {{ selectionCharacters }}/
          </span>
          <span> {{ editor.storage.characterCount.characters() }}</span>
          {{ t('wordCount.characters') }} <icon name="arrow-down" />
        </t-button>
        <template #content>
          <div v-if="showWordCount" class="umo-word-count-detail">
            <div class="umo-word-count-title">{{ t('wordCount.title') }}</div>
            <ul>
              <li>
                {{ t('wordCount.input') }}
                <span>
                  {{ editor.storage.characterCount.characters() }}
                </span>
              </li>
              <li>
                {{ t('wordCount.selection') }}
                <span>{{ selectionCharacters }}</span>
              </li>
              <li v-if="options.document.characterLimit > 0">
                {{ t('wordCount.limit') }}
                <span>
                  {{ options.document.characterLimit }}
                </span>
              </li>
              <li>
                {{ t('wordCount.currentPage') }}
                <span>
                  {{ editor?.getAttributes('page').pageNumber }}
                </span>
              </li>
              <li>
                {{ t('wordCount.totalPage') }}
                <span>
                  {{ editor.$nodes('page').length }}
                </span>
              </li>
            </ul>
          </div>
        </template>
      </t-popup>
    </div>
    <div class="bar-right">
      <tooltip
        :content="`${page.preview.enabled ? t('preview.disable') : t('preview.title')} (F5)`"
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
        :content="`${fullscreen.isFullscreen ? t('fullscreen.disable') : t('fullscreen.title')} (F11 / ⌘+F11)`"
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
        <tooltip :content="`${t('zoom.zoomOut')} (${getShortcut('Ctrl-')})`">
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
          class="zoom-level-slider"
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
          :label="t('zoom.level') + '${value}%%'"
        />
        <tooltip :content="`${t('zoom.zoomIn')} (${getShortcut('Ctrl+')})`">
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
        <tooltip :content="`${t('zoom.autoWidth')} (${getShortcut('Ctrl0')})`">
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
        <tooltip :content="`${t('zoom.reset')} (${getShortcut('Ctrl1')})`">
          <t-button
            class="bar-button auto-width"
            variant="text"
            size="small"
            @click="zoomReset"
          >
            {{ page.zoomLevel }}%
          </t-button>
        </tooltip>
      </div>
      <t-dropdown
        :attach="container"
        :options="langs"
        placement="top-left"
        trigger="click"
        @click="changeLang"
      >
        <t-button
          class="bar-button auto-width lang-button"
          variant="text"
          size="small"
          v-text="locale"
          @click="zoomReset"
        >
        </t-button>
      </t-dropdown>
    </div>
  </div>
  <div v-else class="preview-bar">
    <div
      class="item"
      :class="{ active: page.preview.laserPointer }"
      @click="page.preview.laserPointer = !page.preview.laserPointer"
    >
      <icon name="laser-pointer" />
      {{ t('preview.laserPointer') }}
    </div>
    <div class="item" @click="togglePreview">
      <icon name="exit" />
      {{ t('preview.exit') }}
    </div>
  </div>
  <t-drawer
    v-model:visible="showShortcut"
    :attach="container"
    size="320px"
    :footer="false"
    :close-btn="true"
    destroy-on-close
    show-in-attached-element
  >
    <template #header>
      <div class="shortcut-drawer-header">
        <icon name="shortcut" />
        {{ t('shortcut.title') }}
      </div>
    </template>
    <statusbar-shortcuts />
  </t-drawer>
</template>

<script setup>
import i18n from '@/i18n'
import getShortcut from '@/utils/shortcut'

const { container, options, page, editor } = useStore()
const $document = useState('document')

// 快捷键抽屉
const showShortcut = $ref(false)

const reset = inject('reset')

// 分页
const togglePagination = () => {
  page.value.pagination = !page.value.pagination
  const tr = editor.value.state.tr.setMeta('splitPage', false)
  editor.value.view.dispatch(tr)
}

// 字数统计
let showWordCount = $ref(false)
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
    if (!val) {
      page.value.preview.enabled = false
    }
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
    useMessage('error', t('zoom.autoWidthError'))
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

// 多语言
const langs = [
  { content: '🇨🇳 简体中文', value: 'zh-CN' },
  { content: '🇱🇷 English', value: 'en-US' },
]
const setLocale = inject('setLocale')
const locale = computed(
  () => langs.find((item) => item.value === i18n.global.locale.value).content,
)
const changeLang = ({ value }) => {
  if (i18n.global.locale.value === value) {
    return
  }
  const dialog = useConfirm({
    theme: 'warning',
    header: t('changeLocale.title'),
    body: t('changeLocale.message'),
    confirmBtn: {
      theme: 'warning',
      content: t('changeLocale.confirm'),
    },
    onConfirm() {
      dialog.destroy()
      setTimeout(() => setLocale(value), 300)
    },
  })
}
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
    &:not(.auto-width) {
      width: var(--td-comp-size-xs);
    }
    &.auto-width {
      font-size: var(--umo-font-size-small);
      padding-left: 6px;
      padding-right: 6px;
    }
    &.word-count {
      padding-left: 2px;
      padding-right: 0;
      :deep(.umo-button__text) {
        display: flex;
        align-items: center;
        .icon {
          margin-left: 3px;
          transform: rotate(180deg);
        }
      }
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
      .zoom-level-slider {
        :deep(.umo-slider__button) {
          background: var(--td-brand-color);
          border: none;
          box-shadow: none;
        }
        :deep(.umo-slider__track) {
          background: none;
        }
      }
    }
    .lang-button {
      :deep(.umo-button__text) {
        display: flex;
        align-items: center;
        .icon {
          font-size: 16px;
          margin-right: 3px;
        }
      }
    }
    @media screen and (max-width: 720px) {
      .zoom-level-bar {
        width: auto;
      }
      .zoom-level-slider,
      .lang-button {
        display: none !important;
      }
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
    padding: 50px 30px !important;
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

.umo-word-count-detail {
  padding: 10px 0 8px;
  width: 160px;
  font-size: 12px;
  color: var(--umo-text-color-light);
  .umo-word-count-title {
    padding: 0 12px;
    margin-bottom: 3px;
  }
  li {
    list-style: none;
    cursor: default;
    padding: 0 12px;
    display: flex;
    justify-content: space-between;
    line-height: 28px;
    color: var(--umo-text-color);
    &:hover {
      background-color: var(--td-bg-color-container-hover);
    }
  }
}
</style>
