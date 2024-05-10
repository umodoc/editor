<template>
  <editor-menus-button
    huge-button
    button-type="popup"
    :popup-visible="popupVisible"
    @toggle-popup="togglePopup"
  >
    <icon name="page-background" />
    <template #text>
      <p class="button-text">页面背景</p>
    </template>
    <template #content>
      <div class="background-container">
        <div
          class="background-item"
          :class="{ active: page.background === item.value }"
          :style="{ backgroundColor: item.value }"
          v-for="(item, index) in backgrounds"
          :key="index"
          @click="backgroundChange(item.value)"
        >
          {{ item.label }}
        </div>
      </div>
      <t-popup
        :attach="container"
        trigger="click"
        placement="right-bottom"
        @visible-change="(visible) => (moreColorPicker = visible)"
      >
        <div class="background-more" :class="{ active: moreColorPicker }">
          <div class="background-more-menu">
            <icon name="palette-color" />
            <span>自定义页面背景</span>
          </div>
          <div class="background-more-arrow">
            <icon name="arrow-down" />
          </div>
        </div>
        <template #content>
          <t-color-picker-panel
            size="small"
            :color-modes="['monochrome']"
            :swatch-colors="[]"
            enable-alpha
            @change="backgroundChange"
          />
        </template>
      </t-popup>
    </template>
  </editor-menus-button>
</template>

<script setup>
let { popupVisible, togglePopup } = usePopup()
const { container, page } = useStore()

const backgrounds = [
  { label: '默认', value: page.value.defaultBackground },
  { label: '护眼绿', value: 'rgb(233, 246, 227)' },
  { label: '淡雅黄', value: 'rgb(252, 242, 224)' },
  { label: '云水蓝', value: 'rgb(237, 244, 255)' },
  { label: '天空蓝', value: 'rgb(153, 205, 250)' },
  { label: '暗夜黑', value: 'rgb(145, 145, 145)' },
]

// 更多颜色
const moreColorPicker = $ref(false)
const backgroundChange = (color) => {
  page.value.background = color
}
</script>

<style lang="less" scoped>
.background-container {
  display: flex;
  flex-wrap: wrap;
  width: 234px;
  justify-content: space-between;
  gap: 9px;
  user-select: none;
  .background-item {
    width: 70px;
    height: 90px;
    border: solid 1px rgba(0, 0, 0, 0.1);
    border-radius: var(--umo-radius);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: var(--umo-text-color-light);
    cursor: pointer;
    &:hover {
      border-color: rgba(0, 0, 0, 0.2);
      transform: scale(1.02);
    }
    &.active {
      color: var(--umo-primary-color);
      border-color: var(--umo-primary-color);
    }
  }
}
.background-more {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  cursor: pointer;
  margin-top: 10px;
  &:hover,
  &.active {
    background-color: var(--td-bg-color-container-hover);
    border-radius: var(--umo-radius);
  }
  &-menu {
    display: flex;
    align-items: center;
    font-size: 12px;
    cursor: pointer;
    .icon {
      margin-right: 5px;
      font-size: 16px;
    }
  }
  &-arrow {
    .icon {
      transform: rotate(-90deg);
    }
  }
}
</style>
