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
            '--umo-page-margin-top': pageOptions.margin?.top + 'cm',
            '--umo-page-margin-bottom': pageOptions.margin?.bottom + 'cm',
            '--umo-page-margin-left': pageOptions.margin?.left + 'cm',
            '--umo-page-margin-right': pageOptions.margin?.right + 'cm',
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
    <div class="umo-main-floating-actions">
      <t-back-top
        style="position: relative"
        :container="`${container} .umo-zoomable-container`"
        :visible-height="800"
        size="small"
      />
    </div>
    <t-image-viewer
      :attach="container"
      v-model:visible="imageViewer.visible"
      v-model:index="currentImageIndex"
      :images="previewImages"
      :trigger="() => {}"
      @close="imageViewer.visible = false"
    />
    <container-search-replace />
    <container-print />
  </div>
</template>

<script setup>
const container = inject('container')
const imageViewer = inject('imageViewer')
const pageOptions = inject('page')

const pageSize = $computed(() => {
  const { width, height } = pageOptions.value.size || { width: 0, height: 0 }
  return {
    width: pageOptions.value.orientation === 'portrait' ? width : height,
    height: pageOptions.value.orientation === 'portrait' ? height : width,
  }
})
const pageZoomWidth = $computed(() => {
  if (pageOptions.value.layout === 'web') {
    return '100%'
  }
  return `calc(${pageSize.width}cm * ${pageOptions.value.zoomLevel ? pageOptions.value.zoomLevel / 100 : 1})`
})

let pageZoomHeight = $ref('')
let pageContentEl = $ref(null)
let pageHeightRaf = 0
let pageHeightObserver = $ref(null)
const updatePageZoomHeight = () => {
  if (pageOptions.value.layout === 'web') {
    pageZoomHeight = 'auto'
    return
  }
  if (!pageContentEl) {
    console.warn('The element <.umo-page-content> does not exist.')
    return
  }
  const height = `${(pageContentEl.clientHeight * (pageOptions.value.zoomLevel || 1)) / 100}px`
  if (pageZoomHeight !== height) {
    pageZoomHeight = height
  }
}
const schedulePageZoomHeight = () => {
  if (pageHeightRaf) {
    cancelAnimationFrame(pageHeightRaf)
  }
  pageHeightRaf = requestAnimationFrame(() => {
    pageHeightRaf = 0
    updatePageZoomHeight()
  })
}
onMounted(async () => {
  await nextTick()
  pageContentEl = document.querySelector(`${container} .umo-page-content`)
  if (pageContentEl) {
    pageHeightObserver = new ResizeObserver(() => {
      schedulePageZoomHeight()
    })
    pageHeightObserver.observe(pageContentEl)
  } else {
    console.warn('The element <.umo-page-content> does not exist.')
  }
  schedulePageZoomHeight()
})
onUnmounted(() => {
  if (pageHeightObserver) {
    pageHeightObserver.disconnect()
    pageHeightObserver = null
  }
  if (pageHeightRaf) {
    cancelAnimationFrame(pageHeightRaf)
  }
})

watch(
  () => [
    pageOptions.value.layout,
    pageOptions.value.zoomLevel,
    pageOptions.value.size,
    pageOptions.value.orientation,
  ],
  () => {
    schedulePageZoomHeight()
  },
  { deep: true },
)

const watermarkOptions = $ref({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  type: undefined,
})
watch(
  () => pageOptions.value.watermark,
  (watermarkObj = { type: '' }) => {
    const { type } = watermarkObj
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

let previewImages = $ref([])
let currentImageIndex = $ref(0)

watch(
  () => imageViewer.value.visible,
  async (visible) => {
    if (!visible) {
      previewImages = []
      currentImageIndex = 0
      return
    }
    await nextTick()
    const images = document.querySelectorAll(
      `${container} .umo-page-node-content img[src][data-preview]`,
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
    box-sizing: border-box;
    .umo-zoomable-content {
      margin: 0 auto;
      box-shadow:
        rgba(0, 0, 0, 0.06) 0px 0px 10px 0px,
        rgba(0, 0, 0, 0.04) 0px 0px 0px 1px;
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

.umo-main-floating-actions {
  position: absolute;
  bottom: 25px;
  right: 25px;
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: 10px;
  > * {
    position: relative;
    inset-inline-end: unset !important;
    inset-block-end: unset !important;
    opacity: 0.9;
    &:hover {
      opacity: 1;
      background-color: var(--umo-color-white) !important;
      border: solid 1px var(--umo-primary-color);
    }
  }
}

.umo-viewer-container {
  position: absolute;
  inset: 0;
  z-index: 1000;
}
</style>
