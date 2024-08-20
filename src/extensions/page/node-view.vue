<template>
  <node-view-wrapper
    ref="containerRef"
    class="umo-page-node-view"
    :id="node.attrs.id"
    :class="{ 'no-shadow': exportImage }"
    :style="{
      '--umo-page-background': page.background,
      '--umo-page-margin-top': page.margin.top + 'cm',
      '--umo-page-margin-bottom': page.margin.bottom + 'cm',
      '--umo-page-margin-left': page.margin.left + 'cm',
      '--umo-page-margin-right': page.margin.right + 'cm',
      '--umo-page-width': pageSize.width + 'cm',
      '--umo-page-height': pageSize.height + 'cm',
    }"
  >
    <div
      v-if="node.attrs.pageNumber > 1"
      class="umo-page-node-view-handler"
      :title="t('pagination.toggle')"
      @dblclick="page.pagination = !page.pagination"
    ></div>
    <t-watermark
      class="umo-page-watermark"
      :alpha="page.watermark.alpha"
      v-bind="watermarkOptions"
      :watermark-content="page.watermark"
    >
      <div class="umo-page-node-header" contenteditable="false">
        <div
          class="umo-page-corner corner-tl"
          style="width: var(--umo-page-margin-left)"
        ></div>

        <div class="umo-page-node-header-content">
          <component
            v-if="page.header"
            :is="node.attrs.slots.page_header"
            :page-number="node.attrs.pageNumber"
            :total-pages="editor.$nodes('page').length"
          />
        </div>
        <div
          class="umo-page-corner corner-tr"
          style="width: var(--umo-page-margin-right)"
        ></div>
      </div>
      <node-view-content
        class="umo-page-node-content"
        :style="{
          height: pageSize.height - page.margin.top - page.margin.bottom + 'cm',
        }"
      />
      <div class="umo-page-node-footer" contenteditable="false">
        <div
          class="umo-page-corner corner-bl"
          style="width: var(--umo-page-margin-left)"
        ></div>
        <div class="umo-page-node-footer-content">
          <component
            v-if="page.footer"
            :is="node.attrs.slots.page_footer"
            :page-number="node.attrs.pageNumber"
            :total-pages="editor.$nodes('page').length"
          />
        </div>
        <div
          class="umo-page-corner corner-br"
          style="width: var(--umo-page-margin-right)"
        ></div>
      </div>
    </t-watermark>
  </node-view-wrapper>
</template>
<script setup>
import { nodeViewProps, NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'

const { page, exportImage } = useStore()
const { editor, node } = defineProps(nodeViewProps)
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
.umo-page-node-view {
  box-sizing: border-box;
  background-color: var(--umo-page-background);
  width: var(--umo-page-width);
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

  .umo-page-node-view-handler {
    position: absolute;
    width: 100%;
    height: 20px;
    cursor: row-resize;
    margin-top: -20px;
    z-index: 5;
  }

  .umo-page-watermark {
    position: unset !important;
    width: var(--umo-page-width);
    height: var(--umo-page-height);
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
    box-sizing: border-box;
    width: 100%;
    overflow: hidden;
    padding: 0 var(--umo-page-margin-right) 0 var(--umo-page-margin-right);
  }
}
</style>

<style lang="less">
.disable-page-break .umo-page-node-view {
  &:not(:first-child) {
    margin-top: 0 !important;

    .umo-page-node-header {
      display: none;
    }
  }

  &:not(:last-child) {
    margin-bottom: 0 !important;

    .umo-page-node-footer {
      display: none;
    }
  }

  .umo-page-node-view-handler {
    cursor: vertical-text;
    background-color: var(--umo-page-background);
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

  .umo-page-watermark {
    padding: 20px 0;
    height: calc(
      var(--umo-page-height) - var(--umo-page-margin-top) -
        var(--umo-page-margin-bottom)
    );
  }

  &:first-child {
    .umo-page-watermark {
      padding-top: 0;
      height: calc(var(--umo-page-height) - var(--umo-page-margin-top));
    }
  }

  &:last-child {
    .umo-page-watermark {
      padding-bottom: 0;
      height: calc(var(--umo-page-height) - var(--umo-page-margin-bottom));
    }
  }
}
</style>
