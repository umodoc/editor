<template>
  <div class="umo-page-container">
    <container-toc v-if="page.showToc" @close="page.showToc = false" />
    <div class="umo-zoomable-container umo-scrollbar">
      <div
        class="umo-zoomable-content"
        :style="{
          width: pageZoomWidth,
          height: pageZoomHeight,
          minHeight: pageZoomMinHeight,
        }"
      >
        <div
          class="umo-page-content"
          :style="{
            width: pageSize.width + 'cm',
            transform: `scale(${page.zoomLevel / 100})`,
          }"
        >
          <editor>
            <template #page_header="props">
              <slot name="page_header" v-bind="props" />
            </template>
            <template #page_footer="props">
              <slot name="page_footer" v-bind="props" />
            </template>
            <template #bubble_menu="props">
              <slot name="bubble_menu" v-bind="props" />
            </template>
          </editor>
        </div>
      </div>
    </div>
    <t-image-viewer
      v-model="imagePreviewVisible"
      :images="previewImages"
      :index="currentImageIndex"
      @close="imagePreview = false"
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
  const el = document.querySelector(`${container} .umo-page-content`)
  if (!el) {
    console.warn('The element <.umo-page-content> does not exist.')
    return
  }
  pageZoomHeight = (el.clientHeight * page.value.zoomLevel) / 100 + 'px'
}
watch(
  () => [
    page.value.zoomLevel,
    page.value.size,
    page.value.orientation,
    page.value.pagination,
  ],
  async () => {
    await nextTick()
    setTimeout(() => setPageZoomHeight(), 100)
  },
  { immediate: true, deep: true },
)
watch(
  () => store.editor.value?.getHTML(),
  () => setPageZoomHeight(),
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
        .querySelectorAll(`${container} .umo-page-content img:not(.icon)`)
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
    .umo-page-content {
      transform-origin: 0 0;
      box-sizing: border-box;
      display: flex;
      position: relative;
      overflow: visible !important;
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
