<template>
  <editor-menus-button
    button-type="popup"
    huge-button
    :popup-visible="popupVisible"
    @toggle-popup="togglePopup"
  >
    <icon name="horizontal-line" />
    <template #text>
      <p class="button-text">分割线</p>
    </template>
    <template #content>
      <div class="page-divider-dropdown">
        <div class="page-divider-item-title">
          <span>分割线类型</span>
        </div>
        <div
          class="page-divider-item"
          v-for="item in options"
          :key="item.value"
          :value="item.value"
          @click="setHorizontalLine(item)"
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
            class="page-divider-item open-color-picker"
            :class="{ active: colorPickerVisible }"
          >
            <span>分割线颜色</span>
            <div class="arrow">
              <icon name="arrow-down" />
            </div>
          </div>
          <template #content>
            <div class="page-divider-color-picker">
              <toolbar-color-picker
                default-color="#000"
                @change="colorChange"
              />
            </div>
          </template>
        </t-popup>
      </div>
    </template>
  </editor-menus-button>
</template>

<script setup>
let { popupVisible, togglePopup } = usePopup()
const { container, editor } = useStore()

const options = [
  { label: '细线', value: 'signle' },
  { label: '双细线', value: 'double' },
  { label: '点线', value: 'dotted' },
  { label: '虚线', value: 'dashed' },
  { label: '双虚线', value: 'dashed-double' },
  { label: '粗线', value: 'signle-bold' },
  { label: '粗细线', value: 'double-bold-top' },
  { label: '细粗线', value: 'double-bold-bottom' },
  { label: '波浪线', value: 'wavy' },
]

let currentColor = $ref('#000')
let colorPickerVisible = $ref(false)
const colorChange = (color) => {
  currentColor = color
  colorPickerVisible = false
}

const setHorizontalLine = ({ value }) => {
  if (!value || !editor.value) return
  editor.value
    .chain()
    .focus()
    .setHorizontalRule({ type: value, color: currentColor })
    .run()
  popupVisible.value = false
}
</script>

<style lang="less" scoped>
@import '@/assets/styles/_mixins.less';

.page-divider-dropdown {
  width: 200px;
  .page-divider-item {
    padding: 2px 5px;
    cursor: pointer;
    border-radius: var(--umo-radius);
    &:hover {
      background-color: var(--td-bg-color-container-hover);
    }
    &.open-color-picker {
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
        .icon {
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
    .page-divider();
    margin: 3px;
    width: auto;
  }
}
:global(.page-divider-color-picker) {
  padding: 12px;
}
</style>
