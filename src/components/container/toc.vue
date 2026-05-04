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
        :data="tocData"
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

<script setup>
import { TextSelection } from '@tiptap/pm/state'

const container = inject('container')
const editor = inject('editor')
const page = inject('page')

defineEmits(['close'])

let tocData = $ref([])
const buildTocTree = (tocArray) => {
  const root = []
  const stack = []
  if (!tocArray || tocArray.length === 0) {
    return root
  }
  for (const item of tocArray) {
    const node = {
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
      if (!stack[stack.length - 1].children) {
        stack[stack.length - 1].children = []
      }
      stack[stack.length - 1].children.push(node)
    }
    stack.push(node)
  }
  return root
}

const tocDebounceFn = useDebounceFn((toc) => {
  tocData = buildTocTree(toc)
}, 1000)

watch(
  () => editor.value?.storage.tableOfContents.content,
  (toc) => {
    tocDebounceFn(toc)
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
  if (!nodeElement || !pageContainer || !pageHeader) {
    return
  }
  const { zoomLevel } = page.value
  pageContainer.scrollTo({
    top: Math.round(
      ((nodeElement.offsetTop + pageHeader.offsetHeight) * zoomLevel) / 100,
    ),
  })
  const pos = editor.value.view.posAtDOM(nodeElement, 0)
  const { tr } = editor.value.view.state
  tr.setSelection(new TextSelection(tr.doc.resolve(pos)))
  editor.value.view.dispatch(tr)
  editor.value.view.focus()
}

const umoPageContainer = document.querySelector(
  `${container} .umo-main-container`,
)
const baseTocWidth = 320
const isResizing = ref(false)
const startX = ref(0)
const initialWidth = ref(baseTocWidth)
const startResize = (e) => {
  if (!umoPageContainer) {
    return
  }
  isResizing.value = true
  startX.value = e.clientX
  initialWidth.value = parseInt(
    getComputedStyle(umoPageContainer?.querySelector('.umo-toc-container'))
      .width,
    10,
  )
  umoPageContainer.addEventListener('mousemove', resize)
  umoPageContainer.addEventListener('mouseup', stopResize)
}

const resize = (e) => {
  if (isResizing.value) {
    const offsetX = e.clientX - startX.value
    const newWidth = initialWidth.value + offsetX
    const minWidth = baseTocWidth / 1.5
    const maxWidth = baseTocWidth * 2
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      const tocContainer = umoPageContainer.querySelector('.umo-toc-container')
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

<style lang="less">
.umo-toc-container {
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
  &:hover {
    .umo-dialog__close {
      display: flex !important;
    }
  }
  .umo-toc-title {
    display: flex;
    align-items: center;
    position: relative;
    padding: 20px 15px 10px;
    .icon-toc {
      margin-right: 5px;
      font-size: 20px;
    }
    .umo-dialog__close {
      position: absolute;
      right: -4px;
      display: flex;
      align-items: center;
      justify-content: center;
      display: none;
    }
  }
  .umo-toc-content {
    flex: 1;
    display: flex;
    padding: 10px 10px 10px 15px;
    flex-direction: column;
    .umo-toc-tree {
      user-select: none;
      --td-brand-color-light: rgba(0, 0, 0, 0.03);
      .umo-tree {
        &__item {
          height: 32px;
          &--open .t-icon {
            color: var(--umo-text-color-light);
          }
        }
        &__label {
          --td-comp-paddingLR-xs: 5px;
          --td-bg-color-container-hover: rgba(0, 0, 0, 0.03);
        }
        &__empty {
          height: 60px;
          font-size: 12px;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--umo-text-color-light);
        }
      }
      .umo-is-active {
        font-weight: 400;
        color: var(--umo-primary-color);
      }
    }
  }
}
.umo-editor-container.umo-skin-default {
  .umo-toc-container {
    background-color: var(--umo-color-white);
    border-right: solid 1px var(--umo-border-color);
    .umo-toc-title {
      border-bottom: solid 1px var(--umo-border-color-light);
      padding: 10px 15px;
      .umo-dialog__close {
        right: 15px;
      }
    }
    .umo-toc-content {
      .umo-toc-tree {
        --td-comp-size-m: 30px;
        --td-comp-paddingLR-xs: 8px;
        --td-comp-margin-xs: 0;
        --td-brand-color-light: var(--umo-button-hover-background);
      }
    }
  }
}
</style>
