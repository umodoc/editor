<template>
  <node-view-wrapper
    ref="containerRef"
    class="page page-node-view"
    :class="{ 'no-shadow': exportImage }"
    :style="{
      padding: `${page.margin.top + 'cm'} ${page.margin.right + 'cm'} ${page.margin.bottom + 'cm'} ${page.margin.left + 'cm'}`,
      background: page.background,
    }"
  >
    <div
      class="corner-top-left"
      :style="{
        left: page.margin.left - 1 + 'cm',
        top: page.margin.top - 1 + 'cm',
      }"
    ></div>
    <div
      class="corner-top-right"
      :style="{
        right: page.margin.right - 1 + 'cm',
        top: page.margin.top - 1 + 'cm',
      }"
    ></div>
    <div
      class="corner-bottom-left"
      :style="{
        left: page.margin.left - 1 + 'cm',
        bottom: page.margin.bottom - 1 + 'cm',
      }"
    ></div>
    <div
      class="corner-bottom-right"
      :style="{
        right: page.margin.right - 1 + 'cm',
        bottom: page.margin.bottom - 1 + 'cm',
      }"
    ></div>
    <node-view-content
      class="PageContent"
      :style="{
        width: pageSize.width - page.margin.right - page.margin.left + 'cm',
        minHeight:
          pageSize.height - page.margin.top - page.margin.bottom + 'cm',
      }"
    />
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
  .corner-top-left {
    position: absolute;
    height: 1cm;
    width: 1cm;
    border-top-width: 0px;
    border-left-width: 0px;
    border-right-width: 1px;
    border-bottom-width: 1px;
    border-style: solid;
    box-sizing: border-box;
    border-color: #e5e7eb;
  }
  .corner-top-right {
    position: absolute;
    height: 1cm;
    width: 1cm;
    border-top-width: 0px;
    border-left-width: 1px;
    border-right-width: 0px;
    border-bottom-width: 1px;
    border-style: solid;
    box-sizing: border-box;
    border-color: #e5e7eb;
  }

  .corner-bottom-left {
    position: absolute;
    height: 1cm;
    width: 1cm;
    border-top-width: 1px;
    border-left-width: 0px;
    border-right-width: 1px;
    border-bottom-width: 0px;
    border-style: solid;
    box-sizing: border-box;
    border-color: #e5e7eb;
  }
  .corner-bottom-right {
    position: absolute;
    height: 1cm;
    width: 1cm;
    border-top-width: 1px;
    border-left-width: 1px;
    border-right-width: 0px;
    border-bottom-width: 0px;
    border-style: solid;
    box-sizing: border-box;
    border-color: #e5e7eb;
  }
}
</style>
