<template>
  <div class="page-container">
    <container-toc v-if="page.showToc" @close="page.showToc = false" />
    <div class="zoomable-container umo-scrollbar">
      <div
        class="zoomable-content"
        :style="{
          width: pageZoomWidth,
          height: pageZoomHeight,
          minHeight: pageZoomMinHeight,
        }"
      >
        <t-watermark
          class="page-content"
          :alpha="page.watermark.alpha"
          v-bind="watermarkOptions"
          :watermark-content="page.watermark"
          :style="{
            width: pageSize.width + 'cm',
            minHeight: pageSize.height + 'cm',
            transform: `scale(${page.zoomLevel / 100})`,
            padding: `${page.margin.top + 'cm'} ${page.margin.right + 'cm'} ${page.margin.bottom + 'cm'} ${page.margin.left + 'cm'}`,
            background: page.background,
          }"
        >
          <editor />
        </t-watermark>
      </div>
    </div>
    <t-image-viewer
      v-model="imagePreviewVisible"
      :images="previewImages"
      :index="currentImageIndex"
      @close="imagePreview = false"
    />
    <t-back-top
      :container="`${container} .zoomable-container`"
      :visible-height="800"
      size="small"
      :offset="['25px', '30px']"
    />
    <container-search-replace />
    <container-print />
  </div>
</template>

<script setup>
const store = useStore()
const { container, page, imagePreview } = useStore()

// 页面大小
const pageSize = $computed(() => {
  const { width, height } = page.value.size
  return {
    width: page.value.orientation === 'portrait' ? width : height,
    height: page.value.orientation === 'portrait' ? height : width,
  }
})
// 页面缩放后的大小
const pageZoomWidth = $computed(() => {
  return `calc(${pageSize.width + 'cm'} * ${page.value.zoomLevel / 100})`
})
const pageZoomMinHeight = $computed(() => {
  return `calc(${pageSize.height + 'cm'} * ${page.value.zoomLevel / 100})`
})

// 页面内容变化后更新页面高度
let pageZoomHeight = $ref()
const setPageZoomHeight = () => {
  const el = document.querySelector(`${container} .page-content`)
  pageZoomHeight = (el.clientHeight * page.value.zoomLevel) / 100 + 'px'
}
watch(
  () => [page.value.zoomLevel, page.value.size, page.value.orientation],
  async () => {
    await nextTick()
    setTimeout(() => setPageZoomHeight(), 10)
  },
  { immediate: true, deep: true },
)
// 页面内容变化后更新页面高度
watch(
  () => store.editor.value?.getHTML(),
  () => setPageZoomHeight(),
)

// 水印
const watermarkOptions = $ref({
  x: 0,
  height: 0,
})
watch(
  () => page.value.watermark,
  ({ type }) => {
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
let previewImages = $ref([])
let currentImageIndex = $ref(0)
let imagePreviewVisible = $ref(false)
watch(
  () => imagePreview.value,
  (val) => {
    if (val) {
      document
        .querySelectorAll(`${container} .page-content img:not(.icon)`)
        .forEach((item) => {
          const src = item.getAttribute('src')
          if (src) previewImages.push(src)
        })
      currentImageIndex = images.findIndex((item) => item === val)
      imagePreviewVisible = true
    } else {
      previewImages = []
      currentImageIndex = 0
      imagePreviewVisible = false
    }
  },
)
</script>

<style lang="less" scoped>
.page-container {
  height: 100%;
  display: flex;
  position: relative;
}

.zoomable-container {
  flex: 1;
  padding: 30px 50px;
  scroll-behavior: smooth;
  .zoomable-content {
    margin: 0 auto;
    box-shadow:
      rgba(0, 0, 0, 0.06) 0px 0px 10px 0px,
      rgba(0, 0, 0, 0.04) 0px 0px 0px 1px;
    background-color: var(--umo-color-white);
    .page-content {
      transform-origin: 0 0;
      box-sizing: border-box;
      display: flex;
      [contenteditable] {
        outline: none;
      }
    }
  }
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
