<template>
  <node-view-wrapper
    :id="node.attrs.id"
    class="umo-node-view"
    @click.capture="editor?.commands.setNodeSelection(getPos())"
  >
    <div
      class="umo-node-container umo-hover-shadow umo-select-outline umo-node-toc"
    >
      <p class="umo-node-toc-head" v-text="t('toc.title')"></p>
      <div class="umo-node-toc-body">
        <t-tree
          class="umo-toc-tree"
          :data="tocTreeData"
          :keys="{
            label: 'textContent',
            value: 'id',
          }"
          :empty="t('toc.empty')"
          :transition="false"
          activable
          hover
          expand-all
          line
          @active="headingActive"
        />
      </div>
    </div>
  </node-view-wrapper>
</template>

<script setup>
import { TextSelection } from '@tiptap/pm/state'
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'

const { getPos } = defineProps(nodeViewProps)

const container = inject('container')
const editor = inject('editor')

defineEmits(['close'])

// 最终可视化数据
let tocTreeData = $ref([])
let watchTreeData = [] // 可视化监听数据
const buildTocTree = (tocArray) => {
  const root = []
  const stack = []
  for (const item of tocArray) {
    const node = {
      textContent: item.textContent,
      level: item.originalLevel,
      id: item.id,
      actived: false,
      children: [],
    }
    while (
      stack.length > 0 &&
      stack[stack.length - 1].level >= item.originalLevel
    ) {
      stack.pop()
    }
    if (stack.length === 0) {
      root.push(node)
    } else {
      stack[stack.length - 1].children.push(node)
    }
    stack.push(node)
  }
  return root
}

watch(
  () => editor.value?.storage.tableOfContents.content,
  (toc) => {
    // 每次都监听 但不是每次发生变化，重复赋值导致toc数据双击生效
    const curTocTreeData = buildTocTree(toc)
    if (JSON.stringify(watchTreeData) !== JSON.stringify(curTocTreeData)) {
      watchTreeData = curTocTreeData
      tocTreeData = JSON.parse(JSON.stringify(curTocTreeData))
    }
  },
  { immediate: true },
)

const headingActive = (value) => {
  if (!editor.value) {
    return
  }
  const nodeElement = editor.value.view.dom.querySelector(
    `[data-toc-id="${value[0]}"]`,
  )
  const pageContainer = document.querySelector(
    `${container} .umo-zoomable-container`,
  )
  const pageHeader = pageContainer?.querySelector('.umo-page-node-header')
  pageContainer.scrollTo({
    top: nodeElement.offsetTop + (pageHeader?.offsetHeight || 0),
  })
  const pos = editor.value.view.posAtDOM(nodeElement, 0)
  const { tr } = editor.value.view.state
  tr.setSelection(new TextSelection.create(tr.doc, pos))
  editor.value.view.dispatch(tr)
  editor.value.view.focus()
}
</script>

<style lang="less">
.umo-node-view {
  .umo-node-toc {
    padding: 44px 24px 24px 10px;
    position: relative;
    outline: solid 1px var(--umo-content-node-border);
    border-radius: var(--umo-content-node-radius);
    background-color: #fff;
    width: 100%;
    &-head {
      font-weight: 500;
      margin: 0;
      position: absolute;
      top: 0;
      left: 24px;
      padding: 0.25em 0.5em;
      border-bottom-left-radius: 3px;
      border-bottom-right-radius: 3px;
      background: rgba(black, 0.05);
      color: var(--umo-primary-color);
    }

    &-body {
      --td-bg-color-container-hover: rgba(0, 0, 0, 0.05);
      --td-text-color-primary: #222;
      --td-border-level-1-color: #ddd;
      --td-brand-color-light: rgba(0, 0, 0, 0.05);
      .umo-tree__label {
        margin-left: 0 !important;
        padding: 5px;
        &:hover {
          color: var(--umo-primary-color);
        }
      }
      .umo-tree__empty {
        height: 40px;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #999;
        margin-bottom: 15px;
      }
    }
  }
}
</style>
