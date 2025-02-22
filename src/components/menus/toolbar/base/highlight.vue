<template>
  <menus-button
    :text="t('base.highlight.text')"
    shortcut="Ctrl+Shift+H"
    menu-type="dropdown"
    popup-handle="arrow"
    hide-text
    overlay-class-name="umo-highlight-dropdown"
    @menu-click="highlightChange(highlight as HighlightOption)"
  >
    <icon
      name="highlight"
      class="umo-icon-highlight"
      :style="{ backgroundColor: highlight?.bgcolor, color: highlight?.color }"
    />
    <template #dropmenu>
      <t-dropdown-menu>
        <t-dropdown-item
          v-for="item in options"
          :key="item.value"
          class="umo-text-highlight-menu"
          :value="item.value"
          :style="{ backgroundColor: item.bgcolor, color: item.color }"
          :divider="item.divider"
          @click="highlightChange(item as HighlightOption)"
        >
          <icon name="highlight" />
          <span>{{ item.label }}</span>
        </t-dropdown-item>
        <t-dropdown-item
          class="umo-text-highlight-menu umo-clear-format-menu"
          @click="clearFormat()"
        >
          <icon name="clear-format" />
          <span v-text="t('base.highlight.clear')"></span>
        </t-dropdown-item>
      </t-dropdown-menu>
    </template>
  </menus-button>
</template>

<script setup lang="ts">
const editor = inject('editor')

interface HighlightOption {
  label: string
  value: number
  bgcolor?: string
  color?: string
  divider?: boolean
}

const options: HighlightOption[] = [
  { label: t('base.highlight.yellowBg'), value: 1, bgcolor: '#ffff8a' },
  { label: t('base.highlight.greenBg'), value: 2, bgcolor: '#a7ffa7' },
  { label: t('base.highlight.purpleBg'), value: 3, bgcolor: '#e6afff' },
  {
    label: t('base.highlight.blueBg'),
    value: 4,
    bgcolor: '#83d3ff',
    divider: true,
  },
  { label: t('base.highlight.red'), value: 5, color: '#e71313' },
  {
    label: t('base.highlight.green'),
    value: 6,
    color: '#128a00',
    divider: true,
  },
]

let highlight = $ref<HighlightOption | undefined>()
const highlightChange = (item: HighlightOption) => {
  if (item.bgcolor) {
    editor.value?.chain().focus().setHighlight({ color: item.bgcolor }).run()
  }
  if (item.color) {
    editor.value?.chain().focus().setColor(item.color).run()
  }
  highlight = item
}
const clearFormat = () => {
  editor.value?.chain().focus().unsetHighlight().run()
  editor.value?.chain().focus().unsetColor().run()
  highlight = undefined
}
</script>

<style lang="less" scoped>
.umo-icon-highlight {
  border-radius: 2px;
}
</style>

<style lang="less">
.umo-text-highlight-dropdown {
  .umo-popup__content {
    .umo-divider {
      margin-top: 8px;
      margin-bottom: 8px;
    }
  }
}
.umo-text-highlight-menu {
  width: 140px;
  margin-bottom: 6px;
  border: solid 1px transparent;
  &.umo-clear-format-menu {
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
    .umo-icon {
      font-size: 16px;
      margin-right: 5px;
    }
  }
}
</style>
