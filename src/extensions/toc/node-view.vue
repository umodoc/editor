<template>
  <node-view-wrapper :id="node.attrs.id" class="umo-node-view">
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

<script setup lang="ts">
import { TextSelection } from '@tiptap/pm/state'
import { NodeViewWrapper } from '@tiptap/vue-3'

const container = inject('container')
const editor = inject('editor')

defineEmits(['close'])

interface TocItem {
  [key: string]: any
  children?: TocItem[]
}
// 最终可视化数据
let tocTreeData = $ref([])
let watchTreeData: TocItem[] = [] // 可视化监听数据
const buildTocTree = (tocArray: Record<string, any>[]): TocItem[] => {
  const root: TocItem[] = []
  const stack: TocItem[] = []
  for (const item of tocArray) {
    const node: TocItem = {
      textContent: item.textContent,
      level: item.originalLevel,
      id: item.id,
      actived: false, // item.isActive,
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
      stack[stack.length - 1].children!.push(node)
    }
    stack.push(node)
  }
  return root
}

watch(
  () => editor.value?.storage.tableOfContents.content,
  (toc: any[]) => {
    // 每次都监听 但不是每次发生变化，重复赋值导致toc数据双击生效
    const curTocTreeData = buildTocTree(toc)
    if (JSON.stringify(watchTreeData) !== JSON.stringify(curTocTreeData)) {
      watchTreeData = curTocTreeData
      tocTreeData = JSON.parse(JSON.stringify(curTocTreeData))
    }
  },
  { immediate: true },
)

const headingActive = (value: any) => {
  if (!editor.value) {
    return
  }
  const nodeElement = editor.value.view.dom.querySelector(
    `[data-toc-id="${value[0]}"]`,
  )
  const pageContainer = document.querySelector(
    `${container} .umo-zoomable-container`,
  ) as HTMLElement
  const pageHeader = pageContainer?.querySelector(
    '.umo-page-node-header',
  ) as HTMLElement
  pageContainer.scrollTo({
    top: nodeElement.offsetTop + pageHeader.offsetHeight,
  })
  const pos = editor.value.view.posAtDOM(nodeElement as Node, 0)
  const { tr } = editor.value.view.state
  tr.setSelection(new TextSelection(tr.doc.resolve(pos)))
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
      font-weight: 600;
      margin: 0;
      position: absolute;
      top: 0;
      left: 24px;
      padding: 0.25em 0.5em;
      border-bottom-left-radius: 3px;
      border-bottom-right-radius: 3px;
      font-size: 16px;
      background: rgba(black, 0.05);
      color: var(--umo-primary-color);
    }

    &-body {
      .umo-tree__label {
        margin-left: 0 !important;
        font-weight: 600;
        font-size: 16px;
        padding: 5px;
        &:hover {
          color: var(--umo-primary-color);
        }
      }
    }
  }
}
</style>
