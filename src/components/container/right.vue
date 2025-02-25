<template>
  <div class="umo-right-container">
    <div class="umo-right-title">
      <!-- 不用图标了 -->
      {{ pageOptions?.right?.pageTitle }}
      <div class="umo-dialog__close" @click="pageOptions.right.show = false">
        <icon name="close" />
      </div>
    </div>
    <div class="umo-right-content umo-scrollbar">
      <div
        v-for="item in pageOptions.right?.extensions"
        :key="`page_right_div_${item.pageKey}`"
      >
        <template v-if="pageOptions?.right?.pageKey === item.pageKey">
          <slot :name="`page_right_${item.pageKey}`" :item="item" />
        </template>
      </div>
    </div>
    <div class="umo-right-resize-handle" @mousedown="startResize"></div>
  </div>
</template>
<script setup lang="ts">
const pageOptions = inject('page')

//拖拽效果
let umoPageContainer: HTMLElement
const baseRightWidth = 320
const isResizing = ref(false)
const startX = ref(0)
const initialWidth = ref(baseRightWidth)
const initContainer = () => {
  if (!umoPageContainer) {
    umoPageContainer = document.querySelector(
      '.umo-page-container',
    ) as HTMLElement
  }
}
const startResize = (e: MouseEvent) => {
  initContainer()
  if (!umoPageContainer) {
    return
  }
  isResizing.value = true
  startX.value = e.clientX
  initialWidth.value = parseInt(
    getComputedStyle(
      umoPageContainer?.querySelector('.umo-right-container') as HTMLElement,
    ).width,
    10,
  )
  umoPageContainer.addEventListener('mousemove', resize)
  umoPageContainer.addEventListener('mouseup', stopResize)
}

const resize = (e: MouseEvent) => {
  if (isResizing.value) {
    const offsetX = e.clientX - startX.value
    const newWidth = initialWidth.value - offsetX
    const minWidth = baseRightWidth / 1.5
    const maxWidth = baseRightWidth * 1.5
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      const tocContainer = umoPageContainer.querySelector(
        '.umo-right-container',
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
.umo-right-container {
  background-color: var(--umo-color-white);
  border-right: solid 1px var(--umo-border-color);
  width: 320px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;

  .umo-right-resize-handle {
    position: absolute;
    top: 0;
    left: -1px;
    width: 2px;
    height: 100%;
    background-color: transparent;

    &:hover {
      background-color: var(--umo-primary-color);
      cursor: col-resize;
    }
  }

  .umo-right-title {
    border-bottom: solid 1px var(--umo-border-color-light);
    display: flex;
    align-items: center;
    position: relative;
    padding: 10px 15px;

    .icon-right {
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

  .umo-right-content {
    flex: 1;
    display: flex;
    padding: 10px;
    flex-direction: column;
  }
}
</style>
