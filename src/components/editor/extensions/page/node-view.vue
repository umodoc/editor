<template>
  <node-view-wrapper
    ref="containerRef"
    class="page-node-view"
    :class="{ 'no-shadow': exportImage }"
    :style="{
      background: page.background,
    }"
  >
    <t-watermark
      :alpha="page.watermark.alpha"
      v-bind="watermarkOptions"
      :watermark-content="page.watermark"
      :style="{
        width: pageSize.width + 'cm',
        height: pageSize.height + 'cm',
        transform: `scale(${page.zoomLevel / 100})`
      }"
    >
      <div
        class="page-corner corner-tl"
        :style="{
          left: page.margin.left - 1 + 'cm',
          top: page.margin.top - 1 + 'cm',
        }"
      ></div>
      <div
        class="page-corner corner-tr"
        :style="{
          right: page.margin.right - 1 + 'cm',
          top: page.margin.top - 1 + 'cm',
        }"
      ></div>
      <div
        class="page-corner corner-bl"
        :style="{
          left: page.margin.left - 1 + 'cm',
          bottom: page.margin.bottom - 1 + 'cm',
        }"
      ></div>
      <div
        class="page-corner corner-br"
        :style="{
          right: page.margin.right - 1 + 'cm',
          bottom: page.margin.bottom - 1 + 'cm',
        }"
      ></div>
      <node-view-content
        class="page-node-content"
        :style="{
          padding: `${page.margin.top + 'cm'} ${page.margin.right + 'cm'} ${page.margin.bottom + 'cm'} ${page.margin.left + 'cm'}`,
          minHeight: pageSize.height-page.margin.top-page.margin.bottom + 'cm'
        }"
      />
    </t-watermark>
  </node-view-wrapper>
</template>
<script setup>
import { nodeViewProps, NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'

const { page, exportImage } = useStore()
const { editor } = defineProps(nodeViewProps)
const containerRef = ref(null)

const pageSize = $computed(() => {
  const { width, height } = page.value.size
  return {
    width: page.value.orientation === 'portrait' ? width : height,
    height: page.value.orientation === 'portrait' ? height : width
  }
})

// 水印
const watermarkOptions = $ref({
  x: 0,
  height: 0
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
  { deep: true, immediate: true }
)
</script>

<style lang="less" scoped>
.page-node-view {
  box-sizing: border-box;

  &.no-shadow {
    border: solid 1px var(--umo-border-color);
    box-shadow: unset;
  }

  &:not(.no-shadow) {
    box-shadow: rgba(0, 0, 0, 0.06) 0px 0px 10px 0px,
    rgba(0, 0, 0, 0.04) 0px 0px 0px 1px;
  }

  &:not(:first-child) {
    margin-top: 15px;
  }

  &:not(:last-child) {
    margin-bottom: 15px;
  }

  .page-node-content {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  }

  .page-corner {
    position: absolute;
    height: 1cm;
    width: 1cm;
    border: solid 1px var(--umo-border-color);

    &.corner-tl {
      border-top: none;
      border-left: none;
    }

    &.corner-tr {
      border-top: none;
      border-right: none;
    }

    &.corner-bl {
      border-bottom: none;
      border-left: none;
    }

    &.corner-br {
      border-bottom: none;
      border-right: none;
    }
  }
}
</style>
