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
    <div class="corner-top-left"
         :style="{left:page.margin.left-1 + 'cm',top:page.margin.top-1 + 'cm'}"
    ></div>
    <div class="corner-top-right" :style="{right:page.margin.right-1 + 'cm',top:page.margin.top-1 + 'cm'}"></div>
    <div class="corner-bottom-left" :style="{left:page.margin.left-1 + 'cm',bottom:page.margin.bottom-1 + 'cm'}" ></div>
    <div class="corner-bottom-right" :style="{right:page.margin.right-1 + 'cm',bottom:page.margin.bottom-1 + 'cm'}" ></div>
    <node-view-content class="PageContent" />
  </node-view-wrapper>
</template>
<script setup>
import { nodeViewProps, NodeViewWrapper,NodeViewContent } from '@tiptap/vue-3'
const {page,options,editorDestroyed} =useStore();
const {editor} = defineProps(nodeViewProps)
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
  margin-top:0.5rem;
  margin-bottom:0.5rem;
//下划线
  border-bottom: 1px solid #ccc;
  position: relative;
  .corner-top-left{
    position: absolute;
    height: 1cm;
    width: 1cm;
    border-top-width: 0px;
    border-left-width: 0px;
    border-right-width: 1px;
    border-bottom-width: 1px;
    border-style: solid;
    box-sizing:border-box;
    border-color:#e5e7eb;
  }
  .corner-top-right{
    position: absolute;
    height: 1cm;
    width: 1cm;
    border-top-width: 0px;
    border-left-width: 1px;
    border-right-width: 0px;
    border-bottom-width: 1px;
    border-style: solid;
    box-sizing:border-box;
    border-color:#e5e7eb;
  }

  .corner-bottom-left{
    position: absolute;
    height: 1cm;
    width: 1cm;
    border-top-width: 1px;
    border-left-width: 0px;
    border-right-width: 1px;
    border-bottom-width: 0px;
    border-style: solid;
    box-sizing:border-box;
    border-color:#e5e7eb;
  }
  .corner-bottom-right{
    position: absolute;
    height: 1cm;
    width: 1cm;
    border-top-width: 1px;
    border-left-width: 1px;
    border-right-width: 0px;
    border-bottom-width: 0px;
    border-style: solid;
    box-sizing:border-box;
    border-color:#e5e7eb;
  }
}
</style>
