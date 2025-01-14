<template>
  <div class="umo-page-container">
    <container-toc v-if="page.showToc" @close="page.showToc = false" />
    <div class="umo-zoomable-container umo-scrollbar">
      <div
        class="umo-zoomable-content"
        :style="{
          width: pageZoomWidth,
          height: pageZoomHeight,
        }"
      >
        <t-watermark
          class="umo-page-content"
          :alpha="page.watermark.alpha"
          v-bind="watermarkOptions"
          :watermark-content="page.watermark"
          :style="{
            '--umo-page-background': page.background,
            '--umo-page-margin-top': (page.margin?.top ?? '0') + 'cm',
            '--umo-page-margin-bottom': (page.margin?.bottom ?? '0') + 'cm',
            '--umo-page-margin-left': (page.margin?.left ?? '0') + 'cm',
            '--umo-page-margin-right': (page.margin?.right ?? '0') + 'cm',
            '--umo-page-width': pageSize.width + 'cm',
            '--umo-page-height': pageSize.height + 'cm',
            width: pageSize.width + 'cm',
            transform: `scale(${page.zoomLevel ? page.zoomLevel / 100 : 1})`,
          }"
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
        <container-comments v-if="commentBox" />
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

const { container, page, commentBox, imageViewer } = useStore()

// 页面大小
const pageSize = $computed(() => {
  const { width, height } = page.value.size ?? { width: 0, height: 0 }
  return {
    width: page.value.orientation === 'portrait' ? width : height,
    height: page.value.orientation === 'portrait' ? height : width,
  }
})
// 页面缩放后的大小
const pageZoomWidth = $computed(() => {
  return `calc(${pageSize.width}cm * ${page.value.zoomLevel ? page.value.zoomLevel / 100 : 1})`
})

// 页面内容变化后更新页面高度
let pageZoomHeight = $ref('')
const setPageZoomHeight = () => {
  const el = document.querySelector(`${container} .umo-page-content`)
  if (!el) {
    console.warn('The element <.umo-page-content> does not exist.')
    return
  }
  pageZoomHeight = `${(el.clientHeight * (page.value.zoomLevel ?? 1)) / 100}px`
}
watch(
  () => [page.value.zoomLevel, page.value.size, page.value.orientation],
  async () => {
    await nextTick()
    setTimeout(() => {
      setPageZoomHeight()
    }, 100)
  },
  { immediate: true, deep: true },
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
  () => page.value.watermark,
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

const store = useStore()
watch(
  () => store.editor.value?.getHTML(),
  () => {
    setPageZoomHeight()
  },
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
      `${container} .umo-page-content img:not(.umo-icon)`,
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

<style lang="less" scoped>
.umo-page-container {
  height: 100%;
  display: flex;
  position: relative;
}

.umo-zoomable-container {
  flex: 1;
  padding: 20px 50px;
  scroll-behavior: smooth;
  .umo-zoomable-content {
    margin: 0 auto;
    box-shadow:
      rgba(0, 0, 0, 0.06) 0px 0px 10px 0px,
      rgba(0, 0, 0, 0.04) 0px 0px 0px 1px;
    .umo-page-content {
      transform-origin: 0 0;
      box-sizing: border-box;
      display: flex;
      position: relative;
      box-sizing: border-box;
      background-color: var(--umo-page-background);
      width: var(--umo-page-width);
      min-height: var(--umo-page-height);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      [contenteditable] {
        outline: none;
      }
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

  @media print {
    opacity: 0;
  }

  &::after {
    position: absolute;
    content: '';
    display: block;
    height: 1cm;
    width: 1cm;
    border: solid 1px var(--umo-border-color);
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
  padding: 0 var(--umo-page-margin-right) 0 var(--umo-page-margin-left);
  min-height: calc(
    var(--umo-page-height) - var(--umo-page-margin-top) -
      var(--umo-page-margin-bottom)
  );
}

:deep(.umo-back-top) {
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
