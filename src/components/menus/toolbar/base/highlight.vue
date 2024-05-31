<template>
  <menus-button
    text="高亮显示"
    shortcut="Ctrl+Shift+H"
    menu-type="dropdown"
    popup-handle="arrow"
    hide-text
    overlay-class-name="hightlight-dropdown"
    @menu-click="highlightChange(hightlight)"
  >
    <icon
      name="highlight"
      class="icon-highlight"
      :style="{ backgroundColor: hightlight.bgcolor, color: hightlight.color }"
    />
    <template #dropmenu>
      <t-dropdown-menu>
        <t-dropdown-item
          class="text-highlight-menu"
          v-for="item in options"
          :key="item.value"
          :value="item.value"
          :style="{ backgroundColor: item.bgcolor, color: item.color }"
          :divider="item.divider"
          @click="highlightChange(item)"
        >
          <icon name="highlight" />
          <span>{{ item.label }}</span>
        </t-dropdown-item>
        <t-dropdown-item
          class="text-highlight-menu clear-format-menu"
          @click="clearFormat()"
        >
          <icon name="clear-format" />
          <span>清除高亮</span>
        </t-dropdown-item>
      </t-dropdown-menu>
    </template>
  </menus-button>
</template>

<script setup>
const { editor } = useStore()

const options = [
  { label: '黄色背景', value: 1, bgcolor: '#ffff8a' },
  { label: '绿色背景', value: 2, bgcolor: '#a7ffa7' },
  { label: '紫色背景', value: 3, bgcolor: '#e6afff' },
  { label: '蓝色背景', value: 4, bgcolor: '#83d3ff', divider: true },
  { label: '红色字体', value: 5, color: '#e71313' },
  { label: '绿色字体', value: 6, color: '#128a00', divider: true },
]
let hightlight = $ref({})
const highlightChange = (item) => {
  if (item.bgcolor) {
    editor.value?.chain().focus().setHighlight({ color: item.bgcolor }).run()
  }
  if (item.color) {
    editor.value?.chain().focus().setColor(item.color).run()
  }
  hightlight = item
}
const clearFormat = () => {
  editor.value?.chain().focus().unsetHighlight().run()
  editor.value?.chain().focus().unsetColor().run()
  hightlight = {}
}
</script>

<style lang="less" scoped>
.icon-highlight {
  border-radius: 2px;
}
</style>

<style lang="less">
.text-hightlight-dropdown {
  .umo-popup__content {
    .umo-divider {
      margin-top: 8px;
      margin-bottom: 8px;
    }
  }
}
.text-highlight-menu {
  width: 140px;
  margin-bottom: 6px;
  border: solid 1px transparent;
  &.clear-format-menu {
    margin-bottom: 0;
  }
  &:hover {
    border-color: var(--umo-primary-color);
    background-color: inherit;
  }
  .umo-dropdown__item-text {
    display: flex;
    align-items: center;
    padding: 2px;
    .icon {
      font-size: 16px;
      margin-right: 5px;
    }
  }
}
</style>
