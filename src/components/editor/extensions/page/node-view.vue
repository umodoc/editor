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
      class="page-watermark"
      :alpha="page.watermark.alpha"
      v-bind="watermarkOptions"
      :watermark-content="page.watermark"
      :style="{
        width: pageSize.width + 'cm',
        height: pageSize.height + 'cm',
      }"
    >
      <div
        class="page-node-header"
        :style="{
          height: page.margin.top + 'cm',
        }"
      >
        <div
          class="page-corner corner-tl"
          :style="{
            width: page.margin.left + 'cm',
          }"
        ></div>

        <div class="page-node-header-content"></div>
      </div>
      <node-view-content
        class="page-node-content"
        :style="{
          padding: `0 ${page.margin.right + 'cm'} 0 ${page.margin.left + 'cm'}`,
          height: pageSize.height - page.margin.top - page.margin.bottom + 'cm',
        }"
      />
      <div
        class="page-node-footer"
        :style="{
          height: page.margin.bottom + 'cm',
        }"
      >
        <div
          class="page-corner corner-bl"
          :style="{
            width: page.margin.left + 'cm',
          }"
        ></div>
        <div class="page-node-footer-content"></div>
        <div
          class="page-corner corner-br"
          :style="{
            width: page.margin.right + 'cm',
          }"
        ></div>
      </div>
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
    height: page.value.orientation === 'portrait' ? height : width,
  }
})

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
</script>

<style lang="less" scoped>
.page-node-view {
  box-sizing: border-box;

  &.no-shadow {
    border: solid 1px var(--umo-border-color);
    box-shadow: unset;
  }

  &:not(.no-shadow) {
    box-shadow:
      rgba(0, 0, 0, 0.06) 0px 0px 10px 0px,
      rgba(0, 0, 0, 0.04) 0px 0px 0px 1px;
  }

  &:not(:first-child) {
    margin-top: 15px;
  }

  &:not(:last-child) {
    margin-bottom: 15px;
  }

  .page-watermark {
    position: unset !important;
    display: flex;
    flex-direction: column;
  }

  .page-node-header,
  .page-node-footer {
    display: flex;
    justify-content: space-between;
  }

  .page-corner {
    box-sizing: border-box;
    position: relative;
    z-index: 10;

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

  .page-node-header-content,
  .page-node-footer-content {
    flex: 1;
    padding: 10px 0;
  }

  .page-node-content {
    box-sizing: border-box;
    width: 100%;
    flex: 1;
  }
}
</style>
