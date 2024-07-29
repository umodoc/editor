<template>
  <node-view-wrapper
    ref="containerRef"
    class="page page-node-view"
    :style="{
    width: pageSize.width-page.margin.right-page.margin.left + 'cm',
            minHeight: pageSize.height-page.margin.top-page.margin.bottom + 'cm',
    padding: `${page.margin.top + 'cm'} ${page.margin.right + 'cm'} ${page.margin.bottom + 'cm'} ${page.margin.left + 'cm'}`
    }"
  >
    <node-view-content class="PageContent" />
  </node-view-wrapper>
</template>

<script setup>
import { nodeViewProps, NodeViewWrapper,NodeViewContent } from '@tiptap/vue-3'
import { UnitConversion } from '@/components/editor/extensions/page/core'
const {page} =useStore();
const Props = defineProps(nodeViewProps)
const containerRef = ref(null)

const pageSize = $computed(() => {
  const { width, height } = page.value.size
  return {
    width: page.value.orientation === 'portrait' ? width : height,
    height: page.value.orientation === 'portrait' ? height : width,
  }
})
</script>

<style lang="less">
.page-node-view {
  //下划线
  border-bottom: 1px solid #ccc;
}
</style>
