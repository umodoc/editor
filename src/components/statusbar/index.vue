<template>
  <div v-if="!page.preview?.enabled" class="umo-status-bar">
    <div class="umo-status-bar-left">
      <tooltip :content="page.showToc ? t('toc.hide') : t('toc.show')">
        <t-button
          class="umo-status-bar-button"
          :class="{ active: page.showToc }"
          variant="text"
          size="small"
          @click="page.showToc = !page.showToc"
        >
          <icon name="toc" color="red" />
        </t-button>
      </tooltip>
      <tooltip
        v-if="options.document?.enableSpellcheck"
        :content="
          $document?.enableSpellcheck
            ? t('spellcheck.disable')
            : t('spellcheck.enable')
        "
      >
        <t-button
          class="umo-status-bar-button"
          :class="{ active: $document.enableSpellcheck }"
          variant="text"
          size="small"
          @click="toggleSpellcheck"
        >
          <icon name="spellcheck" color="red" />
        </t-button>
      </tooltip>
      <tooltip :content="t('shortcut.title')">
        <t-button
          class="umo-status-bar-button"
          variant="text"
          size="small"
          @click="showShortcut = true"
        >
          <icon name="shortcut" />
        </t-button>
      </tooltip>
      <tooltip :content="t('resetAll.title')">
        <t-button
          class="umo-status-bar-button"
          variant="text"
          size="small"
          @click="reset(false)"
        >
          <icon name="clear-cache" />
        </t-button>
      </tooltip>
      <div class="bar-split"></div>
      <tooltip :content="t('poweredBy')">
        <t-button
          class="umo-status-bar-button"
          variant="text"
          size="small"
          :href="`https://editor.umodoc.com/${locale === 'zh-CN' ? 'cn' : 'en'}/docs`"
          target="_blank"
        >
          <icon name="home-page" />
        </t-button>
      </tooltip>
      <tooltip :content="t('feedback')">
        <t-button
          class="umo-status-bar-button"
          variant="text"
          size="small"
          href="https://github.com/umodoc/editor/issues"
          target="_blank"
        >
          <icon name="message" />
        </t-button>
      </tooltip>
      <div class="umo-status-bar-split"></div>
      <t-popup
        v-if="editor"
        v-model="showWordCount"
        trigger="click"
        placement="top-left"
      >
        <t-button
          class="umo-status-bar-button auto-width word-count"
          variant="text"
          size="small"
        >
          <span v-if="selectionCharacters > 0">
            {{ selectionCharacters }}/
          </span>
          <span class="umo-word-count">
            {{ editor.storage.characterCount.characters() }}</span
          >
          {{ t('wordCount.characters') }}
          <icon
            name="arrow-down"
            :style="{ transform: `rotate(${showWordCount ? '180deg' : 0})` }"
          />
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
              <li v-if="options.document?.characterLimit > 0">
                {{ t('wordCount.limit') }}
                <span>
                  {{ options.document?.characterLimit }}
                </span>
              </li>
            </ul>
          </div>
        </template>
      </t-popup>
    </div>
    <div class="umo-status-bar-right">
      <tooltip
        :content="
          page.preview?.enabled ? t('preview.disable') : t('preview.title')
        "
      >
        <t-button
          class="umo-status-bar-button"
          :class="{ active: page.preview?.enabled }"
          variant="text"
          size="small"
          @click="togglePreview"
        >
          <icon name="preview" />
        </t-button>
      </tooltip>
      <tooltip
        :content="`${fullscreen?.isFullscreen ? t('fullscreen.disable') : t('fullscreen.title')} (${getShortcut('Ctrl+F11')})`"
      >
        <t-button
          class="umo-status-bar-button"
          variant="text"
          size="small"
          @click="toggleFullscreen"
        >
          <icon :name="fullscreen ? 'full-screen-exit' : 'full-screen'" />
        </t-button>
      </tooltip>
      <div class="umo-status-bar-split"></div>
      <div class="umo-zoom-level-bar">
        <tooltip :content="`${t('zoom.zoomOut')} (${getShortcut('Ctrl-')})`">
          <t-button
            class="umo-status-bar-button"
            variant="text"
            size="small"
            :disabled="(page.zoomLevel ?? 21) <= 20"
            @click="zoomOut"
          >
            <icon name="minus" />
          </t-button>
        </tooltip>
        <t-slider
          v-model="page.zoomLevel"
          class="umo-zoom-level-slider"
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
            class="umo-status-bar-button"
            variant="text"
            size="small"
            :disabled="!!(page.zoomLevel && page.zoomLevel >= 500)"
            @click="zoomIn"
          >
            <icon name="plus" />
          </t-button>
        </tooltip>
        <tooltip :content="`${t('zoom.autoWidth')} (${getShortcut('Ctrl0')})`">
          <t-button
            class="umo-status-bar-button"
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
            class="umo-status-bar-button auto-width"
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
          class="umo-status-bar-button auto-width umo-lang-button"
          variant="text"
          size="small"
          @click="zoomReset"
          v-text="lang"
        >
        </t-button>
      </t-dropdown>
    </div>
  </div>
  <div v-else class="umo-preview-bar">
    <div v-if="countdownValue !== ''" class="umo-preview-countdown">
      {{ countdownValue }}
    </div>
    <statusbar-countdown
      :visible="countdownSetting"
      @visible-change="(visible: boolean) => (countdownSetting = visible)"
      @countdown-change="countdownChange"
      @exit-preivew="exitPreview"
      @close="countdownSetting = false"
    >
      <tooltip :content="t('preview.countdown.title')">
        <div class="item" :class="{ active: countdownSetting }">
          <icon name="time" />
        </div>
      </tooltip>
    </statusbar-countdown>
    <tooltip :content="t('preview.laserPointer')">
      <div
        class="item"
        :class="{ active: page.preview?.laserPointer }"
        @click="
          page.preview &&
          (page.preview.laserPointer = !page.preview.laserPointer)
        "
      >
        <icon name="laser-pointer" />
      </div>
    </tooltip>
    <tooltip :content="`${t('zoom.zoomOut')} (${getShortcut('Ctrl-')})`">
      <div class="item" @click="zoomOut">
        <icon name="minus" />
      </div>
    </tooltip>
    <tooltip :content="`${t('zoom.autoWidth')} (${getShortcut('Ctrl0')})`">
      <div
        class="item"
        :class="{ active: page.autoWidth }"
        @click="autoWidth(true)"
      >
        <icon name="auto-width" />
      </div>
    </tooltip>
    <tooltip :content="`${t('zoom.zoomIn')} (${getShortcut('Ctrl+')})`">
      <div class="item" @click="zoomIn">
        <icon name="plus" />
      </div>
    </tooltip>
    <tooltip :content="`${t('preview.disable')} (${getShortcut('Esc')})`">
      <div class="item" @click="togglePreview">
        <icon name="exit" />
      </div>
    </tooltip>
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
      <div class="umo-shortcuts-drawer-header">
        <icon name="shortcut" />
        {{ t('shortcut.title') }}
      </div>
    </template>
    <statusbar-shortcuts />
  </t-drawer>
</template>

<script setup lang="ts">
import type { UseFullscreenReturn } from '@vueuse/core'
import type { DropdownOption } from 'tdesign-vue-next'

import type { SupportedLocale } from '@/types'
import { getShortcut } from '@/utils/shortcut'

const { locale } = useI18n()
const container = inject('container')
const editor = inject('editor')
const page = inject('page')
const options = inject('options')
const $document = useState('document', options)

// 快捷键抽屉
const showShortcut = $ref(false)

const reset = inject('reset') as (silent: boolean) => void

// 字数统计
const showWordCount = $ref(false)
const selectionCharacters = computed(() => {
  if (editor.value) {
    const { selection } = editor.value.state
    const text = editor.value.state.doc.textBetween(
      selection.from,
      selection.to,
      '',
    )
    return text.length
  }
  return 0
})

// 页面全屏
const fullscreen = inject('fullscreen')
const toggleFullscreen = () => {
  fullscreen.value = !fullscreen.value
}

let documentFullscreen: UseFullscreenReturn = $ref(null)
onMounted(() => {
  documentFullscreen = useFullscreen(document.querySelector(container))
})

// 演示模式
const togglePreview = () => {
  page.value.showToc = false
  page.value.preview ??= {}
  page.value.preview.enabled = !page.value.preview.enabled

  const zoomableContainer = document.querySelector(
    `${container} .umo-zoomable-container`,
  )
  if (zoomableContainer && page.value.preview.enabled) {
    zoomableContainer.scrollTop = 0
  }
}
const exitPreview = () => {
  if (page.value.preview.enabled) {
    page.value.preview ??= {}
    page.value.preview.enabled = false
  }
}

watch(
  () => page.value.preview?.enabled,
  (enabled: boolean) => {
    if (enabled) {
      page.value.preview.editable = editor.value.isEditable
      editor.value.setEditable(false)
    } else {
      editor.value.setEditable(page.value.preview.editable)
    }
  },
)

// 演示模式倒计时
const countdownSetting = $ref(false)
let countdownValue = $ref('')
const countdownChange = (value: string) => {
  countdownValue = value
}

watch(
  () => page.value.preview?.enabled,
  (enabled: boolean) => {
    if (enabled) {
      void documentFullscreen.enter()
      autoWidth(false, 10)
    } else {
      void documentFullscreen.exit()
      zoomReset()
    }
  },
)
watch(
  () => documentFullscreen?.isFullscreen,
  (isFullscreen: boolean) => {
    if (!isFullscreen) {
      exitPreview()
    }
  },
)

// 页面缩放
const zoomIn = () => {
  if (page.value?.zoomLevel && page.value.zoomLevel < 500) {
    page.value.zoomLevel += 10
    page.value.autoWidth = false
  }
}
const zoomOut = () => {
  if (page.value?.zoomLevel && page.value.zoomLevel > 20) {
    page.value.zoomLevel -= 10
    page.value.autoWidth = false
  }
}
const zoomReset = () => {
  page.value.zoomLevel = 100
  page.value.autoWidth = false
}

// 最佳宽度
const autoWidth = (auto = true, padding = 50) => {
  if (auto && page.value.autoWidth) {
    zoomReset()
    return
  }
  try {
    const editorEl = document.querySelector(
      `${container} .umo-zoomable-container`,
    )
    const pageEl = editorEl?.querySelector('.umo-page-content')
    const editorWidth = editorEl?.clientWidth ?? 0
    const pageWidth = pageEl?.clientWidth ?? 0
    page.value.zoomLevel = Math.floor(
      Number((editorWidth - padding * 2) / pageWidth) * 100,
    )

    page.value.autoWidth = true
  } catch (e) {
    page.value.autoWidth = false
    useMessage('error', {
      attach: container,
      content: t('zoom.autoWidthError'),
    })
    console.warn('Page auto width calculation error', e)
  }
}

watch(
  () => page.value.showToc,
  () => {
    if (page.value.autoWidth) {
      autoWidth()
    }
  },
)

// 多语言
const langs = [
  { content: '🇨🇳 简体中文', value: 'zh-CN' },
  { content: '🇱🇷 English', value: 'en-US' },
  { content: '🇷🇺 Русский', value: 'ru-RU' },
]
const setLocale = inject('setLocale') as (value: SupportedLocale) => void

const lang = computed(
  () => langs.find((item) => item.value === locale.value)?.content,
)
const changeLang = (dropdownItem: DropdownOption) => {
  const value = dropdownItem.value as SupportedLocale
  if (lang.value === value) {
    return
  }
  const dialog = useConfirm({
    attach: container,
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

const toggleSpellcheck = () => {
  if ($document.value) {
    $document.value.enableSpellcheck = !$document.value.enableSpellcheck
  }
}

// 快捷键
watch(
  () => editor.value,
  () => {
    editor.value?.on('focus', () => {
      useHotkeys('ctrl+f11, command+f11', toggleFullscreen)
      useHotkeys('ctrl+0,command+0', autoWidth)
      useHotkeys('ctrl+-,command+-', zoomOut)
      useHotkeys('ctrl+=,command+=', zoomIn)
      useHotkeys('ctrl+1,command+1', zoomReset)
    })
  },
  { immediate: true },
)
</script>

<style lang="less" scoped>
.umo-status-bar {
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
  .umo-status-bar-split {
    height: 16px;
    width: 1px;
    background-color: var(--umo-border-color);
    margin: 0 10px;
  }
  .umo-status-bar-button {
    --td-comp-size-xs: 18px;
    --td-comp-paddingLR-l: 8px;
    --td-radius-default: 2px;
    font-size: 14px;
    margin: 0 4px;
    color: var(--umo-text-color);
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
        .umo-icon {
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
  &-left {
    display: flex;
    align-items: center;
  }

  &-right {
    display: flex;
    align-items: center;
    .umo-zoom-level-bar {
      width: 240px;
      display: flex;
      --td-comp-size-xxxs: 8px;
      --td-size-2: 3px;
      --td-brand-color: var(--umo-text-color);
      .umo-zoom-level-slider {
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
    .umo-lang-button {
      :deep(.umo-button__text) {
        display: flex;
        align-items: center;
        .umo-icon {
          font-size: 16px;
          margin-right: 3px;
        }
      }
    }
    @media screen and (max-width: 720px) {
      .umo-zoom-level-bar {
        width: auto;
      }
      .umo-zoom-level-slider,
      .umo-lang-button {
        display: none !important;
      }
    }
  }
}
.umo-preview-bar {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 30px;
  border-radius: var(--umo-radius-medium);
  padding: 8px;
  overflow: hidden;
  user-select: none;
  display: flex;
  background: var(--umo-color-white);
  box-shadow:
    var(--td-shadow-2), var(--td-shadow-inset-top),
    var(--td-shadow-inset-right), var(--td-shadow-inset-bottom),
    var(--td-shadow-inset-left);
  gap: 5px;
  .umo-preview-countdown {
    display: flex;
    align-items: center;
    padding: 0 12px;
    background-color: var(--umo-button-hover-background);
    border-radius: var(--umo-radius-medium);
    font-size: 14px;
    color: var(--umo-text-color-light);
  }
  .item {
    padding: 6px;
    border-radius: 8px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 1;
    font-size: 12px;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--umo-text-color-light);
    border-radius: var(--umo-radius-medium);
    cursor: pointer;
    &:hover {
      background-color: var(--umo-button-hover-background);
      color: var(--umo-text-color);
    }
    &.active {
      background-color: var(--umo-button-hover-background);
      color: var(--umo-primary-color);
    }
    :deep(.umo-icon) {
      font-size: 20px;
    }
  }
}
</style>

<style lang="less">
.umo-shortcuts-drawer-header {
  display: flex;
  align-items: center;
  font-weight: 400;
  color: var(--umo-text-color);
  .umo-icon {
    font-size: 20px;
    margin-right: 6px;
  }
}
.umo-drawer__close-btn {
  margin-right: 3px;
}

.umo-word-count {
  margin-right: 0.25em;
  &-detail {
    padding: 10px 0 8px;
    width: 160px;
    font-size: 12px;
    color: var(--umo-text-color-light);
    ul {
      padding: 0;
      margin: 0;
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
  &-title {
    padding: 0 12px;
    margin-bottom: 3px;
  }
}
</style>
