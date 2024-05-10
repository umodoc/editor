<template>
  <node-view-wrapper class="node-view">
    <div class="node-container hover-shadow select-outline toc">
      <p class="toc-head">页面大纲</p>
      <ul class="toc-body">
        <li
          class="toc-item"
          :class="`level-${heading.originalLevel}`"
          v-for="heading in tableOfContents"
          :key="heading.id"
        >
          <a :href="`#${heading.id}`" target="_self">{{
            heading.textContent
          }}</a>
        </li>
      </ul>
    </div>
  </node-view-wrapper>
</template>

<script setup>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'

const props = defineProps(nodeViewProps)

const { tableOfContents } = useStore()
</script>

<style lang="less">
.toc {
  padding: 35px 20px 20px;
  position: relative;
  outline: solid 1px var(--umo-content-node-border);
  border-radius: var(--umo-content-node-radius);
  width: 100%;
  &-head {
    font-size: 0.875rem;
    font-weight: 500;
    margin: 0;
    position: absolute;
    top: 0;
    left: 1rem;
    padding: 0.25rem 0.5rem;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    font-size: 12px;
    background: rgba(black, 0.05);
  }

  &-body {
    list-style: none;
    padding: 0;
  }

  &-item {
    line-height: 1.8;
    &.level-1 {
      font-size: 20px;
    }

    &.level-2 {
      font-size: 18px;
    }

    &.level-3 {
      font-size: 16px;
    }

    &.level-4 {
      font-size: 14px;
    }

    &.level-5 {
      font-size: 12px;
    }

    &.level-6 {
      font-size: 10px;
    }
  }
}
</style>
