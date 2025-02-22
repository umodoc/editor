<template>
  <menus-button
    ico="page-background"
    :text="t('page.bg.text')"
    huge
    menu-type="popup"
    :popup-visible="popupVisible"
    @toggle-popup="togglePopup"
  >
    <template #content>
      <div class="umo-background-container">
        <div
          v-for="(item, index) in backgrounds"
          :key="index"
          class="umo-background-item"
          :class="{ active: page.background === item.value }"
          :style="{ backgroundColor: item.value }"
          @click="backgroundChange(item.value ?? '')"
        >
          {{ item.label }}
        </div>
      </div>
      <t-popup
        :attach="container"
        trigger="click"
        placement="right-bottom"
        @visible-change="(visible: boolean) => (moreColorPicker = visible)"
      >
        <div class="umo-background-more" :class="{ active: moreColorPicker }">
          <div class="umo-background-more-menu">
            <icon name="palette-color" />
            <span v-text="t('page.bg.custom')"></span>
          </div>
          <div class="umo-background-more-arrow">
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
  </menus-button>
</template>

<script setup lang="ts">
const { popupVisible, togglePopup } = usePopup()
const container = inject('container')
const page = inject('page')
const options = inject('options')
const backgrounds = [
  { label: t('page.bg.default'), value: options.value.page.defaultBackground },
  { label: t('page.bg.color1'), value: 'rgb(233, 246, 227)' },
  { label: t('page.bg.color2'), value: 'rgb(252, 242, 224)' },
  { label: t('page.bg.color3'), value: 'rgb(237, 244, 255)' },
  { label: t('page.bg.color4'), value: 'rgb(153, 205, 250)' },
  { label: t('page.bg.color5'), value: 'rgb(145, 145, 145)' },
]

// 更多颜色
const moreColorPicker = $ref(false)
const backgroundChange = (color: string) => {
  page.value.background = color
}
</script>

<style lang="less" scoped>
.umo-background-container {
  display: flex;
  flex-wrap: wrap;
  width: 234px;
  justify-content: space-between;
  gap: 9px;
  user-select: none;
  .umo-background-item {
    width: 70px;
    height: 90px;
    border: solid 1px rgba(0, 0, 0, 0.1);
    border-radius: var(--umo-radius);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    color: var(--umo-text-color-light);
    text-align: center;
    cursor: pointer;
    white-space: pre;
    line-height: 1.5;
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
.umo-background-more {
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
    .umo-icon {
      margin-right: 5px;
      font-size: 16px;
    }
  }
  &-arrow {
    .umo-icon {
      transform: rotate(-90deg);
    }
  }
}
</style>
