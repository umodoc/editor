<template>
  <node-view-wrapper class="node-view toc-node-view" :id="node.attrs.id">
    <div class="node-container hover-shadow select-outline toc">
      <p class="toc-head" v-text="t('toc.title')"></p>
      <ul v-if="tableOfContents && tableOfContents.length > 0" class="toc-body">
        <li
          class="toc-item"
          :class="`level-${heading.level}`"
          v-for="heading in tableOfContents"
          :key="heading.id"
        >
          <a @click="headingClick(heading.id)">{{ heading.textContent }}</a>
        </li>
      </ul>
      <div v-else class="toc-empty" v-text="t('toc.empty')"></div>
    </div>
  </node-view-wrapper>
</template>

<script setup>
import { TextSelection } from '@tiptap/pm/state'
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'

const {node} = defineProps(nodeViewProps)

const { editor, tableOfContents } = useStore()

const headingClick = (id) => {
  const element = editor.value.view.dom.querySelector(`[data-toc-id="${id}"`)
  element.scrollIntoView()
  const pos = editor.value.view.posAtDOM(element, 0)
  const tr = editor.value.view.state.tr
  tr.setSelection(new TextSelection(tr.doc.resolve(pos)))
  editor.value.view.dispatch(tr)
  editor.value.view.focus()
}
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
      font-size: 14px;
      &.level-1 {
      }
      &.level-2 {
        text-indent: 20px;
      }
      &.level-3 {
        text-indent: 40px;
      }
      &.level-4 {
        text-indent: 60px;
      }
      &.level-5 {
        text-indent: 80px;
      }
      &.level-6 {
        text-indent: 100px;
      }
    }
  }
}
</style>
