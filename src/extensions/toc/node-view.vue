<template>
  <node-view-wrapper
    :id="node.attrs.id"
    class="umo-node-view"
    :style="nodeStyle"
  >
    <div
      class="umo-node-container umo-hover-shadow umo-select-outline umo-node-toc"
    >
      <p class="umo-node-toc-head" v-text="t('toc.title')"></p>
      <ul
        v-if="tableOfContents && tableOfContents.length > 0"
        class="umo-node-toc-body"
      >
        <li
          v-for="heading in tableOfContents"
          :key="heading.id"
          class="umo-node-toc-item"
          :class="`level-${heading.level}`"
        >
          <a @click="headingClick(heading.id)">{{ heading.textContent }}</a>
        </li>
      </ul>
      <div v-else class="umo-node-toc-empty" v-text="t('toc.empty')"></div>
    </div>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { TextSelection } from '@tiptap/pm/state'
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'

const { node } = defineProps(nodeViewProps)

const { editor, tableOfContents } = useStore()

const nodeStyle = $computed(() => {
  const { margin } = node.attrs
  const marginTop =
    margin?.top && margin?.top !== '' ? `${margin.top}px` : undefined
  const marginBottom =
    margin?.bottom && margin?.bottom !== '' ? `${margin.bottom}px` : undefined
  return {
    marginTop,
    marginBottom,
  }
})

const headingClick = (id: string) => {
  const element = editor.value?.view.dom.querySelector(`[data-toc-id="${id}"`)
  if (element) {
    element.scrollIntoView()
    const pos = editor.value?.view.posAtDOM(element, 0)
    const { tr } = editor.value?.view.state ?? {}
    tr?.setSelection(new TextSelection(tr.doc.resolve(pos ?? 0)))
    if (tr) {
      editor.value?.view.dispatch(tr)
      editor.value?.view.focus()
    }
  }
}
</script>

<style lang="less">
.umo-node-view {
  .umo-node-toc {
    padding: 35px 20px 20px;
    position: relative;
    outline: solid 1px var(--umo-content-node-border);
    border-radius: var(--umo-content-node-radius);
    width: 100%;
    &-head {
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
