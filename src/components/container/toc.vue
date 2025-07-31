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
        @active="headingActive"
      />
    </div>
    <div class="umo-toc-resize-handle" @mousedown="startResize"></div>
  </div>
</template>

<script setup lang="ts">
import { TextSelection } from '@tiptap/pm/state'

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
  if (!tocArray || tocArray.length === 0) {
    return root
  }
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

const throttleTocTreeData = (toc: any) =>
  useThrottleFn(() => {
    // 每次都监听 但不是每次发生变化，重复赋值导致toc数据双击生效
    const curTocTreeData = buildTocTree(toc)
    if (JSON.stringify(watchTreeData) !== JSON.stringify(curTocTreeData)) {
      watchTreeData = curTocTreeData
      tocTreeData = JSON.parse(JSON.stringify(curTocTreeData))
    }
  }, 200)()

watch(
  () => editor.value?.storage.tableOfContents.content,
  (toc: any[]) => {
    void throttleTocTreeData(toc)
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
  if (!nodeElement || !pageContainer || !pageHeader) {
    return
  }
  pageContainer.scrollTo({
    top: nodeElement.offsetTop + pageHeader.offsetHeight,
  })
  const pos = editor.value.view.posAtDOM(nodeElement as Node, 0)
  const { tr } = editor.value.view.state
  tr.setSelection(new TextSelection(tr.doc.resolve(pos)))
  editor.value.view.dispatch(tr)
  editor.value.view.focus()
}

const umoPageContainer = document.querySelector(
  `${container} .umo-main-container`,
) as HTMLElement
const baseTocWidth = 320
const isResizing = ref(false)
const startX = ref(0)
const initialWidth = ref(baseTocWidth)
const startResize = (e: MouseEvent) => {
  if (!umoPageContainer) {
    return
  }
  isResizing.value = true
  startX.value = e.clientX
  initialWidth.value = parseInt(
    getComputedStyle(
      umoPageContainer?.querySelector('.umo-toc-container') as HTMLElement,
    ).width,
    10,
  )
  umoPageContainer.addEventListener('mousemove', resize)
  umoPageContainer.addEventListener('mouseup', stopResize)
}

const resize = (e: MouseEvent) => {
  if (isResizing.value) {
    const offsetX = e.clientX - startX.value
    const newWidth = initialWidth.value + offsetX
    const minWidth = baseTocWidth / 1.5
    const maxWidth = baseTocWidth * 2
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      const tocContainer = umoPageContainer.querySelector(
        '.umo-toc-container',
      ) as HTMLElement
      tocContainer.style.width = `${newWidth}px`
    }
  }
}

const stopResize = () => {
  isResizing.value = false
  umoPageContainer.removeEventListener('mousemove', resize)
  umoPageContainer.removeEventListener('mouseup', stopResize)
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
  position: relative;
  .umo-toc-resize-handle {
    position: absolute;
    top: 0;
    right: -2px;
    width: 3px;
    height: 100%;
    opacity: 0.5;
    background-color: transparent;
    &:hover {
      background-color: var(--umo-primary-color);
      cursor: col-resize;
    }
  }
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
