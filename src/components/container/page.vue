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
        <div
          class="umo-page-content"
          :style="{
            width: pageSize.width + 'cm',
            transform: `scale(${page.zoomLevel ? page.zoomLevel / 100 : 1})`,
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
        <template v-if="options.document?.enableComment">
          <container-comments />
        </template>
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
const { container, page, imageViewer, options } = useStore()

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
  () => [
    page.value.zoomLevel,
    page.value.size,
    page.value.orientation,
    page.value.pagination,
  ],
  async () => {
    await nextTick()
    setTimeout(() => {
      setPageZoomHeight()
    }, 100)
  },
  { immediate: true, deep: true },
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
    position: relative;
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
