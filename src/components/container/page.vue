<template>
  <div class="umo-main-container">
    <container-toc
      v-if="pageOptions.showToc"
      @close="pageOptions.showToc = false"
    />
    <div class="umo-zoomable-container umo-web-container umo-scrollbar">
      <div class="umo-zoomable-content">
        <t-watermark
          class="umo-page-content"
          :style="{
            width: '100%',
            transform: `scale(${pageOptions.zoomLevel ? pageOptions.zoomLevel / 100 : 1})`,
          }"
          :alpha="pageOptions.watermark.alpha"
          v-bind="watermarkOptions"
          :watermark-content="pageOptions.watermark"
        >
          <div class="umo-page-node-content">
            <editor>
              <template #bubble_menu="props">
                <slot name="bubble_menu" v-bind="props" />
              </template>
            </editor>
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

<style lang="scss">
.umo-main-container {
  height: 100%;
  display: flex;
  position: relative;
}

.umo-zoomable-container {
  flex: 1;
  scroll-behavior: smooth;
  &.umo-web-container {
    display: flex;
    .umo-zoomable-content {
      flex: 1;
      width: 100%;
      height: auto;
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
    flex-direction: column;
    position: relative;
    background-color: var(--umo-color-white);
    width: 100%;
    min-height: 100%;
    overflow: visible !important;
    [contenteditable] {
      outline: none;
    }
  }
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
