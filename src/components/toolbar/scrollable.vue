<template>
  <div ref="wraperRef" class="umo-scrollable-container">
    <div
      v-if="!hidePrev"
      class="umo-scrollable-control scrollable-left"
      @click="scrollLeft"
    >
      <icon name="arrow-down" />
    </div>
    <div
      ref="contentRef"
      class="umo-scrollable-content"
      @scroll.passive="checkScrollPosition"
      @wheel.passive="wheelScroll"
    >
      <slot />
    </div>
    <div
      v-if="!hideNext"
      class="umo-scrollable-control scrollable-right"
      @click="scrollRight"
    >
      <icon name="arrow-down" />
    </div>
  </div>
</template>

<script setup>
const wraperRef = ref(null)
const contentRef = $ref(null)
let hidePrev = $ref(true)
let hideNext = $ref(true)

const checkScrollPosition = () => {
  const { scrollLeft = 0, scrollWidth = 0, clientWidth = 0 } = contentRef || {}
  hidePrev = scrollLeft === 0
  hideNext = scrollLeft + clientWidth + 20 >= scrollWidth
}

const scrollLeft = () => {
  contentRef.scrollLeft -= contentRef.offsetWidth - 10 || 100
}

const scrollRight = () => {
  contentRef.scrollLeft += contentRef.offsetWidth - 10 || 100
}

// 监听父元素大小变化
useResizeObserver(wraperRef, () => {
  checkScrollPosition()
})

// 支持鼠标滚轮滚动
const wheelScroll = (e) => {
  e.deltaY < 0 ? scrollLeft() : scrollRight()
}

// 更新
const update = () => {
  if (contentRef) {
    contentRef.scrollLeft = 0
  }
  hideNext = true
  checkScrollPosition()
}

defineExpose({
  update,
})
</script>

<style lang="less" scoped>
.umo-scrollable-container {
  width: 100%;
  overflow: hidden;
  position: relative;
  .umo-scrollable-control {
    display: flex;
    align-items: center;
    justify-content: center;
    border: solid 1px var(--umo-border-color);
    border-radius: var(--umo-radius);
    cursor: pointer;
    color: var(--umo-text-color-light);
    overflow: visible;
    background-color: var(--umo-button-hover-background);
    z-index: 10;
    font-size: 20px;
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    height: calc(100% - 20px);
    outline: solid 10px var(--umo-color-white);
    &:hover {
      border-color: var(--umo-primary-color);
      background-color: var(--umo-primary-color);
      color: var(--umo-color-white);
    }
    &.scrollable-left {
      left: 10px;
      :deep(.umo-icon) {
        transform: rotate(90deg);
      }
      &::before {
        display: block;
        content: '';
        background: linear-gradient(
          to left,
          transparent,
          var(--umo-color-white)
        );
        position: absolute;
        left: 30px;
        top: 0;
        bottom: 0;
        width: 30px;
        pointer-events: none;
      }
    }
    &.scrollable-right {
      right: 10px;
      :deep(.umo-icon) {
        transform: rotate(-90deg);
      }
      &::before {
        display: block;
        content: '';
        background: linear-gradient(
          to right,
          transparent,
          var(--umo-color-white)
        );
        position: absolute;
        right: 30px;
        top: 0;
        bottom: 0;
        width: 30px;
        pointer-events: none;
      }
    }
  }
  .umo-scrollable-content {
    overflow-x: auto;
    overflow-y: hidden;
    scroll-behavior: smooth;
    flex: 1;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>

<style lang="less">
.umo-skin-modern {
  &.toolbar-ribbon {
    .umo-scrollable-container {
      padding: 10px 15px 2px 15px !important;
    }
    .umo-scrollable-control {
      height: calc(100% - 32px) !important;
      margin-top: 4px;
    }
  }
  &.toolbar-classic {
    .umo-scrollable-container {
      padding: 15px 15px 2px 15px !important;
    }
    .umo-scrollable-control {
      height: calc(100% - 38px) !important;
      margin-top: 6px;
    }
  }
  .umo-scrollable-content {
    border-radius: 6px;
    background-color: var(--umo-color-white);
    padding: 10px 0 10px 10px;
    box-shadow:
      0 0 0 1px hsla(0, 0%, 5%, 0.04),
      0 2px 5px hsla(0, 0%, 5%, 0.06);
    &:hover {
      box-shadow:
        0 0 0 1px hsla(0, 0%, 5%, 0.06),
        0 2px 5px hsla(0, 0%, 5%, 0.1);
    }
  }
  .umo-scrollable-control {
    border-radius: 5px !important;
    &.scrollable-left {
      left: 25px !important;
    }
    &.scrollable-right {
      right: 25px !important;
    }
  }
}
[theme-mode='dark'] .umo-skin-modern .umo-scrollable-content {
  outline: solid 1px var(--umo-border-color-light);
}
</style>
