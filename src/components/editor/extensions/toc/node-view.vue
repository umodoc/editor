<template>
  <node-view-wrapper class="node-view toc-node-view">
    <div class="node-container hover-shadow select-outline toc">
      <p class="toc-head" v-text="t('toc.title')"></p>
      <ul v-if="tableOfContents && tableOfContents.length > 0" class="toc-body">
        <li
          class="toc-item"
          :class="`level-${heading.level}`"
          v-for="heading in tableOfContents"
          :key="heading.id"
        >
          <a :href="`#${heading.id}`" target="_self">{{
            heading.textContent
          }}</a>
        </li>
      </ul>
      <div v-else class="toc-empty" v-text="t('toc.empty')"></div>
    </div>
  </node-view-wrapper>
</template>

<script setup>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'

const props = defineProps(nodeViewProps)

const { tableOfContents } = useStore()
</script>

<style lang="less">
.node-view {
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

    &-empty {
      color: var(--umo-text-color-light);
      font-size: 12px;
      margin-top: 5px;
    }

    &-item {
      font-weight: bold;
      &.level-1 {
        font-size: 20px;
      }
      &.level-2 {
        font-size: 18px;
        text-indent: 20px;
      }
      &.level-3 {
        font-size: 16px;
        text-indent: 40px;
      }
      &.level-4 {
        font-size: 14px;
        text-indent: 60px;
      }
      &.level-5 {
        font-size: 12px;
        text-indent: 80px;
      }
      &.level-6 {
        font-size: 10px;
        text-indent: 100px;
      }
    }
  }
}
</style>
