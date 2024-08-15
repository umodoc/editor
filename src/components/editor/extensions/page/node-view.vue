<template>
  <node-view-wrapper
    ref="containerRef"
    class="page-node-view"
    :class="{ 'no-shadow': exportImage }"
    :style="{
      '--page-background': page.background,
      '--page-margin-top': page.margin.top + 'cm',
      '--page-margin-bottom': page.margin.bottom + 'cm',
      '--page-margin-left': page.margin.left + 'cm',
      '--page-margin-right': page.margin.right + 'cm',
      '--page-width': pageSize.width + 'cm',
      '--page-height': pageSize.height + 'cm',
    }"
  >
    <div
      class="page-node-view-handler"
      :title="t('pagination.toggle')"
      @dblclick="page.pagination = !page.pagination"
    ></div>
    <t-watermark
      class="page-watermark"
      :alpha="page.watermark.alpha"
      v-bind="watermarkOptions"
      :watermark-content="page.watermark"
    >
      <div class="page-node-header">
        <div
          class="page-corner corner-tl"
          style="width: var(--page-margin-left)"
        ></div>

        <div class="page-node-header-content"></div>
        <div
          class="page-corner corner-tr"
          style="width: var(--page-margin-right)"
        ></div>
      </div>
      <node-view-content class="page-node-content" />
      <div class="page-node-footer">
        <div
          class="page-corner corner-bl"
          style="width: var(--page-margin-left)"
        ></div>
        <div class="page-node-footer-content"></div>
        <div
          class="page-corner corner-br"
          style="width: var(--page-margin-right)"
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
  background-color: var(--page-background);
  width: var(--page-width);
  height: var(--page-height);
  overflow: hidden;

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

  .page-node-view-handler {
    position: absolute;
    width: 100%;
    height: 20px;
    cursor: row-resize;
    margin-top: -20px;
    z-index: 5;
  }

  &:first-child {
    .page-node-view-handler {
      display: none;
      margin-top: 0;
    }
  }

  .page-watermark {
    position: unset !important;
    display: flex;
    flex-direction: column;
    width: var(--page-width);
    height: var(--page-height);
  }

  .page-node-header {
    height: var(--page-margin-top);
    min-height: var(--page-margin-top);
  }

  .page-node-footer {
    height: var(--page-margin-bottom);
    min-height: var(--page-margin-bottom);
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
    padding: 0 var(--page-margin-right) 0 var(--page-margin-right);
    height: calc(
      var(--page-size-height) - var(--page-margin-top) -
        var(--page-margin-bottom)
    );
    flex: 1;
  }
}
</style>

<style lang="less">
.disable-page-break .page-node-view {
  &:not(:first-child) {
    margin-top: 0 !important;

    .page-node-header {
      display: none;
    }
  }

  &:not(:last-child) {
    margin-bottom: 0 !important;

    .page-node-footer {
      display: none;
    }
  }

  .page-node-view-handler {
    cursor: vertical-text;
    background-color: var(--page-background);
    margin-top: -10px;

    &::after {
      content: '';
      display: block;
      width: 100%;
      height: 1px;
      position: absolute;
      border-bottom: dashed 1px var(--umo-border-color);
      top: 9px;
    }
  }

  .page-watermark {
    padding: 20px 0;
    height: calc(
      var(--page-height) - var(--page-margin-top) - var(--page-margin-bottom)
    );
  }

  &:first-child {
    .page-watermark {
      padding-top: 0;
      height: calc(var(--page-height) - var(--page-margin-top));
    }
  }

  &:last-child {
    .page-watermark {
      padding-bottom: 0;
      height: calc(var(--page-height) - var(--page-margin-bottom));
    }
  }
}
</style>
