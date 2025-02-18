<template>
  <div class="umo-toc-container">
    <div class="umo-toc-title">
      <icon class="icon-toc" name="toc" /> {{ t('toc.title') }}
      <div class="umo-dialog__close" @click="$emit('close')">
        <icon name="close" />
      </div>
    </div>
    <div class="umo-toc-content umo-scrollbar">
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
        @click="headingClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { TextSelection } from '@tiptap/pm/state'

import type { TableOfContentItem } from '@/composables/store'

const { container, editor, tableOfContents } = useStore()

defineEmits(['close'])

interface TocItem {
  [key: string]: any
  children?: TocItem[]
}

let tocTreeData = $ref([])
const buildTocTree = (tocArray: Record<string, any>[]): TocItem[] => {
  const root: TocItem[] = []
  const stack: TocItem[] = []
  for (const item of tocArray) {
    const node: TocItem = {
      textContent: item.textContent,
      level: item.level,
      id: item.id,
      actived: item.isActive,
      children: [],
    }
    while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
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
  () => tableOfContents.value,
  (toc: TableOfContentItem[]) => {
    tocTreeData = buildTocTree(toc)
  },
  { immediate: true },
)

const headingClick = ({ node }: any) => {
  if (!editor.value) {
    return
  }
  const nodeElement = editor.value.view.dom.querySelector(
    `[data-toc-id="${node.value}"]`,
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

<style lang="less" scoped>
.umo-toc-container {
  background-color: var(--umo-color-white);
  border-right: solid 1px var(--umo-border-color);
  width: 320px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .umo-toc-title {
    border-bottom: solid 1px var(--umo-border-color-light);
    display: flex;
    align-items: center;
    position: relative;
    padding: 10px 15px;
    .icon-toc {
      margin-right: 5px;
      font-size: 20px;
    }
    .umo-dialog__close {
      position: absolute;
      right: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .umo-toc-content {
    flex: 1;
    display: flex;
    padding: 10px;
    flex-direction: column;
    .umo-toc-tree {
      --td-comp-size-m: 28px;
      --td-comp-paddingLR-xs: 8px;
      --td-comp-margin-xs: 0;
      --td-brand-color-light: var(--umo-button-hover-background);
      user-select: none;
      :deep(.umo-tree__empty) {
        height: 60px;
        font-size: 12px;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--umo-text-color-light);
      }
      :deep(.umo-is-active) {
        font-weight: 400;
        color: var(--umo-primary-color);
      }
    }
  }
}
</style>
