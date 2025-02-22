<template>
  <menus-button
    ico="hr"
    :text="t('insert.hr.text')"
    menu-type="popup"
    huge
    :popup-visible="popupVisible"
    @toggle-popup="togglePopup"
  >
    <template #content>
      <div class="umo-page-divider-dropdown">
        <div class="umo-page-divider-item-title">
          <span v-text="t('insert.hr.title')"></span>
        </div>
        <div
          v-for="item in options"
          :key="item.value"
          class="umo-page-divider-item"
          :value="item.value"
          :title="item.label"
          @click="setHr(item)"
        >
          <hr
            class="umo-page-divider"
            :data-type="item.value"
            :style="{ color: currentColor }"
          />
        </div>
        <t-popup
          v-model="colorPickerVisible"
          :attach="container"
          placement="right-bottom"
          trigger="click"
        >
          <div
            class="umo-page-divider-item umo-open-color-picker"
            :class="{ active: colorPickerVisible }"
          >
            <span v-text="t('insert.hr.color')"></span>
            <div class="arrow">
              <icon name="arrow-down" />
            </div>
          </div>
          <template #content>
            <div class="umo-page-divider-color-picker">
              <color-picker default-color="#000" @change="colorChange" />
            </div>
          </template>
        </t-popup>
      </div>
    </template>
  </menus-button>
</template>

<script setup lang="ts">
const { popupVisible, togglePopup } = usePopup()
const container = inject('container')
const editor = inject('editor')

const options = [
  { label: t('insert.hr.signle'), value: 'signle' },
  { label: t('insert.hr.double'), value: 'double' },
  { label: t('insert.hr.dotted'), value: 'dotted' },
  { label: t('insert.hr.dashed'), value: 'dashed' },
  { label: t('insert.hr.dashedDouble'), value: 'dashed-double' },
  { label: t('insert.hr.signleBold'), value: 'signle-bold' },
  { label: t('insert.hr.doubleBoldTop'), value: 'double-bold-top' },
  { label: t('insert.hr.doubleBoldBottom'), value: 'double-bold-bottom' },
  { label: t('insert.hr.wavy'), value: 'wavy' },
]

let currentColor = $ref('#000')
let colorPickerVisible = $ref(false)
const colorChange = (color: string) => {
  currentColor = color
  colorPickerVisible = false
}

const setHr = ({ value }: { value: string }) => {
  if (!value || !editor.value) {
    return
  }
  editor.value.chain().focus().setHr({ type: value, color: currentColor }).run()
  popupVisible.value = false
}
</script>

<style lang="less" scoped>
@import '@/assets/styles/_mixins.less';

.umo-page-divider-dropdown {
  width: 200px;
  .umo-page-divider-item {
    padding: 2px 5px;
    cursor: pointer;
    border-radius: var(--umo-radius);
    &:hover {
      background-color: var(--td-bg-color-container-hover);
    }
    &.umo-open-color-picker {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px 6px;
      cursor: pointer;
      color: var(--umo-text-color-light);
      &:hover,
      &.active {
        background-color: var(--td-bg-color-container-hover);
        border-radius: var(--umo-radius);
      }
      .arrow {
        .umo-icon {
          transform: rotate(-90deg);
        }
      }
    }
    &-title {
      color: var(--umo-text-color-light);
      padding: 5px 6px;
    }
  }
  .umo-page-divider {
    .umo-page-divider();
    margin: 3px;
    width: auto;
  }
}
:global(.umo-page-divider-color-picker) {
  padding: 12px;
}
</style>
