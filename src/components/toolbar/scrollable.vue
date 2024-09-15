<template>
  <div ref="wraperRef" class="umo-scrollable-container">
    <div
      v-if="!hidePrev"
      class="umo-scrollable-control scrollable-left"
      @click="scrollLeft"
    >
      <icon name="arrow-down" />
    </div>
    <div ref="contentRef" class="umo-scrollable-content">
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

<script setup lang="ts">
const wraperRef = ref<HTMLDivElement | null>(null)
const contentRef = $ref<HTMLDivElement | null>(null)
let hidePrev = $ref(true)
let hideNext = $ref(true)

const checkScrollPosition = () => {
  const { scrollLeft = 0, scrollWidth = 0, clientWidth = 0 } = contentRef ?? {}
  hidePrev = scrollLeft === 0
  hideNext = scrollLeft + clientWidth + 1 >= scrollWidth
}

const scrollLeft = () => {
  if (contentRef?.scrollLeft || contentRef.scrollLeft === 0) {
    contentRef.scrollLeft -= 100
  }
}

const scrollRight = () => {
  if (contentRef?.scrollLeft || contentRef.scrollLeft === 0) {
    contentRef.scrollLeft += 100
  }
}

// 监听父元素大小变化
useResizeObserver(wraperRef, () => {
  checkScrollPosition()
})

//
onMounted(() => {
  contentRef?.addEventListener('scroll', checkScrollPosition)
})

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
  display: flex;
  .umo-scrollable-control {
    display: flex;
    align-items: center;
    justify-content: center;
    border: solid 1px var(--umo-border-color);
    border-radius: var(--umo-radius);
    cursor: pointer;
    color: var(--umo-text-color-light);
    position: relative;
    overflow: visible;
    background-color: var(--umo-button-hover-background);
    z-index: 10;
    font-size: 20px;
    &:hover {
      border-color: var(--umo-primary-color);
      background-color: var(--umo-primary-color);
      color: var(--umo-color-white);
    }
    &.scrollable-left {
      margin-right: 5px;
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
        left: 22px;
        top: 0;
        bottom: 0;
        width: 40px;
        pointer-events: none;
      }
    }
    &.scrollable-right {
      margin-left: 5px;
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
        right: 22px;
        top: 0;
        bottom: 0;
        width: 40px;
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
