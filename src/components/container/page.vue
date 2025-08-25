<template>
  <div class="umo-main-container">
    <container-toc
      v-if="pageOptions.showToc"
      @close="pageOptions.showToc = false"
    />
    <div
      :class="`umo-zoomable-container umo-${pageOptions.layout}-container umo-scrollbar`"
    >
      <div
        class="umo-zoomable-content"
        :style="{
          width: pageZoomWidth,
          height: pageZoomHeight,
        }"
      >
        <t-watermark
          class="umo-page-content"
          :style="{
            '--umo-page-orientation': pageOptions.orientation,
            '--umo-page-background': pageOptions.background,
            '--umo-page-margin-top': (pageOptions.margin?.top ?? '0') + 'cm',
            '--umo-page-margin-bottom':
              (pageOptions.margin?.bottom ?? '0') + 'cm',
            '--umo-page-margin-left': (pageOptions.margin?.left ?? '0') + 'cm',
            '--umo-page-margin-right':
              (pageOptions.margin?.right ?? '0') + 'cm',
            '--umo-page-width':
              pageOptions.layout === 'page' ? pageSize.width + 'cm' : 'auto',
            '--umo-page-height':
              pageOptions.layout === 'page' ? pageSize.height + 'cm' : '100%',
            width:
              pageOptions.layout === 'page' ? pageSize.width + 'cm' : '100%',
            transform: `scale(${pageOptions.zoomLevel ? pageOptions.zoomLevel / 100 : 1})`,
          }"
          :alpha="pageOptions.watermark.alpha"
          v-bind="watermarkOptions"
          :watermark-content="pageOptions.watermark"
        >
          <div class="umo-page-node-header" contenteditable="false">
            <div
              class="umo-page-corner corner-tl"
              style="width: var(--umo-page-margin-left)"
            ></div>

            <div class="umo-page-node-header-content"></div>
            <div
              class="umo-page-corner corner-tr"
              style="width: var(--umo-page-margin-right)"
            ></div>
          </div>
          <div class="umo-page-node-content">
            <editor>
              <template #bubble_menu="props">
                <slot name="bubble_menu" v-bind="props" />
              </template>
            </editor>
          </div>
          <div class="umo-page-node-footer" contenteditable="false">
            <div
              class="umo-page-corner corner-bl"
              style="width: var(--umo-page-margin-left)"
            ></div>
            <div class="umo-page-node-footer-content"></div>
            <div
              class="umo-page-corner corner-br"
              style="width: var(--umo-page-margin-right)"
            ></div>
          </div>
        </t-watermark>
      </div>
    </div>
    <t-image-viewer
      v-model:visible="imageViewer.visible"
      v-model:index="currentImageIndex"
      :images="previewImages"
      @close="imageViewer.visible = false"
    />
    <t-back-top
      :container="`${container} .umo-zoomable-container`"
      :visible-height="800"
      size="small"
      :offset="['25px', '30px']"
    />
    <container-search-replace />
    <container-print />
  </div>
</template>

<script setup lang="ts">
import type { WatermarkOption } from '@/types'

const container = inject('container')
const imageViewer = inject('imageViewer')
const pageOptions = inject('page')

// 页面大小
const pageSize = $computed(() => {
  const { width, height } = pageOptions.value.size ?? { width: 0, height: 0 }
  return {
    width: pageOptions.value.orientation === 'portrait' ? width : height,
    height: pageOptions.value.orientation === 'portrait' ? height : width,
  }
})
// 页面缩放后的大小
const pageZoomWidth = $computed(() => {
  if (pageOptions.value.layout === 'web') {
    return '100%'
  }
  return `calc(${pageSize.width}cm * ${pageOptions.value.zoomLevel ? pageOptions.value.zoomLevel / 100 : 1})`
})

// 页面内容变化后更新页面高度
let pageZoomHeight = $ref('')
const setPageZoomHeight = async () => {
  await nextTick()
  if (pageOptions.value.layout === 'web') {
    pageZoomHeight = 'auto'
    return
  }
  const el = document.querySelector(`${container} .umo-page-content`)
  if (!el) {
    console.warn('The element <.umo-page-content> does not exist.')
    return
  }
  pageZoomHeight = `${(el.clientHeight * (pageOptions.value.zoomLevel ?? 1)) / 100}px`
}
onMounted(() => {
  void setPageZoomHeight()
})
watch(
  () => [
    pageOptions.value.layout,
    pageOptions.value.zoomLevel,
    pageOptions.value.size,
    pageOptions.value.orientation,
  ],
  () => {
    void setPageZoomHeight()
  },
  { deep: true },
)

// FIXME:
const editorInstance = inject('editor')
watch(
  () => editorInstance.value?.getHTML(),
  () => {
    void setPageZoomHeight()
  },
)

// 水印
const watermarkOptions = $ref<{
  x: number
  y?: number
  width?: number
  height: number
  type?: string
}>({
  x: 0,
  height: 0,
})
watch(
  () => pageOptions.value.watermark,
  ({ type }: Partial<WatermarkOption> = { type: '' }) => {
    if (type === 'compact') {
      watermarkOptions.width = 320
      watermarkOptions.y = 240
    } else {
      watermarkOptions.width = 480
      watermarkOptions.y = 360
    }
  },
  { deep: true, immediate: true },
)

// 图片预览
let previewImages = $ref<string[]>([])
let currentImageIndex = $ref<number>(0)

watch(
  () => imageViewer.value.visible,
  async (visible: boolean) => {
    if (!visible) {
      previewImages = []
      currentImageIndex = 0
      return
    }
    await nextTick()
    const images = document.querySelectorAll(
      `${container} .umo-page-node-content img[src]:not(.umo-icon)`,
    )
    Array.from(images).forEach((image, index) => {
      const src = image.getAttribute('src')
      const nodeId = image.getAttribute('data-id')
      previewImages.push(src)
      if (nodeId === imageViewer.value.current) {
        currentImageIndex = index
      }
    })
  },
)
</script>

<style lang="less">
.umo-main-container {
  height: 100%;
  display: flex;
  position: relative;
}

.umo-zoomable-container {
  flex: 1;
  scroll-behavior: smooth;
  &.umo-page-container {
    padding: 20px 50px;
    .umo-zoomable-content {
      margin: 0 auto;
      box-shadow:
        rgba(0, 0, 0, 0.06) 0px 0px 10px 0px,
        rgba(0, 0, 0, 0.04) 0px 0px 0px 1px;
      overflow: hidden;
    }
  }
  &.umo-web-container {
    display: flex;
    .umo-zoomable-content {
      flex: 1;
      .umo-page-corner {
        display: none;
      }
      .umo-page-content {
        min-height: 100%;
        .umo-page-node-content {
          min-height: 100px;
        }
      }
    }
  }
  .umo-page-content {
    transform-origin: 0 0;
    box-sizing: border-box;
    display: flex;
    position: relative;
    box-sizing: border-box;
    background-color: var(--umo-page-background);
    width: var(--umo-page-width);
    min-height: var(--umo-page-height);
    overflow: visible !important;
    display: flex;
    flex-direction: column;
    [contenteditable] {
      outline: none;
    }
  }
}

.umo-page-node-header {
  height: var(--umo-page-margin-top);
  overflow: hidden;
}

.umo-page-node-footer {
  height: var(--umo-page-margin-bottom);
  overflow: hidden;
}

.umo-page-node-header,
.umo-page-node-footer {
  display: flex;
  justify-content: space-between;
}

.umo-page-corner {
  box-sizing: border-box;
  position: relative;
  z-index: 10;
}

.umo-page-corner {
  @media print {
    opacity: 0;
  }

  &::after {
    position: absolute;
    content: '';
    display: block;
    height: 1cm;
    width: 1cm;
    border: solid 1px rgba(0, 0, 0, 0.08);
  }

  &.corner-tl::after {
    border-top: none;
    border-left: none;
    bottom: 0;
    right: 0;
  }

  &.corner-tr::after {
    border-top: none;
    border-right: none;
    bottom: 0;
    left: 0;
  }

  &.corner-bl::after {
    border-bottom: none;
    border-left: none;
    top: 0;
    right: 0;
  }

  &.corner-br::after {
    border-bottom: none;
    border-right: none;
    top: 0;
    left: 0;
  }
}

.umo-page-node-header-content,
.umo-page-node-footer-content {
  flex: 1;
}

.umo-page-node-content {
  position: relative;
  box-sizing: border-box;
  flex-shrink: 1;
}

.umo-back-top {
  position: absolute;
  &:hover {
    opacity: 0.9;
    background-color: var(--umo-color-white) !important;
    .umo-back-top__icon {
      color: var(--umo-primary-color);
    }
  }
}
</style>
