<template>
  <menus-button
    ico="border"
    :text="t('bubbleMenu.textBox.border')"
    menu-type="popup"
    huge
    :popup-visible="popupVisible"
    @toggle-popup="togglePopup"
  >
    <template #content>
      <div class="umo-textbox-border-dropdown">
        <t-popup
          v-model="colorPickerVisible"
          :attach="container"
          placement="right-bottom"
          trigger="click"
        >
          <div
            class="umo-textbox-border-dropdown-item"
            :class="{ active: colorPickerVisible }"
          >
            <span>
              <icon name="palette-color" />
              {{ t('bubbleMenu.textBox.borderColor') }}
            </span>
            <div class="arrow">
              <icon name="arrow-down" />
            </div>
          </div>
          <template #content>
            <div class="umo-textbox-border-color-picker">
              <color-picker default-color="#000" @change="colorChange" />
            </div>
          </template>
        </t-popup>
        <t-dropdown
          trigger="click"
          placement="right-top"
          style="width: 120px"
          @click="styleChange"
        >
          <div class="umo-textbox-border-dropdown-item">
            <span>
              <icon name="border" size="16" />
              {{ t('bubbleMenu.textBox.borderStyle') }}
            </span>
            <div class="arrow">
              <icon name="arrow-down" />
            </div>
          </div>
          <t-dropdown-menu>
            <t-dropdown-item
              v-for="(item, index) in styles"
              :key="index"
              :value="item"
            >
              <div
                class="umo-textbox-border-style-item"
                :style="{
                  'border-top': `${item.style} ${item.width}px currentColor`,
                }"
              ></div>
            </t-dropdown-item>
          </t-dropdown-menu>
        </t-dropdown>
        <div class="umo-textbox-border-dropdown-item" @click="noBorder">
          <span>
            <icon name="border-none" size="16" />
            {{ t('bubbleMenu.textBox.noBorder') }}
          </span>
        </div>
      </div>
    </template>
  </menus-button>
</template>

<script setup lang="ts">
import { getSelectionNode } from '@/extensions/selection'

const { popupVisible, togglePopup } = usePopup()
const container = inject('container')
const editor = inject('editor')

const styles = [
  { style: 'solid', width: 1 },
  { style: 'dotted', width: 1 },
  { style: 'dashed', width: 1 },
  { style: 'solid', width: 2 },
  { style: 'dotted', width: 2 },
  { style: 'dashed', width: 2 },
  { style: 'double', width: 2 },
  { style: 'solid', width: 3 },
  { style: 'dotted', width: 3 },
  { style: 'dashed', width: 3 },
  { style: 'double', width: 3 },
]

const borderColor = $ref('#000')
let colorPickerVisible = $ref(false)

const colorChange = (color: any) => {
  const textBox = editor.value ? getSelectionNode(editor.value) : null
  if (textBox) {
    editor.value?.commands.updateAttributes(textBox.type, {
      borderColor: color,
    })
    colorPickerVisible = false
    popupVisible.value = false
  }
}
const styleChange = ({ value }: any) => {
  const textBox = editor.value ? getSelectionNode(editor.value) : null
  if (textBox) {
    editor.value?.commands.updateAttributes(textBox.type, {
      borderStyle: value.style,
      borderWidth: value.width,
      borderColor,
    })
    popupVisible.value = false
  }
}

const noBorder = () => {
  const textBox = editor.value ? getSelectionNode(editor.value) : null
  if (textBox) {
    editor.value?.commands.updateAttributes(textBox.type, {
      borderStyle: 'none',
      borderWidth: 0,
      borderColor: 'transparent',
    })
    popupVisible.value = false
  }
}
</script>

<style lang="less">
.umo-textbox-border {
  &-dropdown {
    &-item {
      cursor: pointer;
      border-radius: var(--umo-radius);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px 6px 5px 8px;
      cursor: pointer;
      user-select: none;
      width: 110px;
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
      > span {
        display: flex;
        gap: 5px;
        align-items: center;
      }
      &:hover {
        background-color: var(--td-bg-color-container-hover);
      }
      &-title {
        color: var(--umo-text-color-light);
        padding: 5px 6px;
      }
    }
  }
  &-style-item {
    margin: 10px 0;
    width: 160px;
  }
}
.umo-textbox-border-color-picker {
  padding: 12px;
}
</style>
