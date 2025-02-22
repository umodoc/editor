<template>
  <menus-button
    ico="ordered-list"
    :text="t('list.ordered.text')"
    shortcut="Ctrl+Shift+7"
    menu-type="popup"
    popup-handle="arrow"
    hide-text
    :popup-visible="popupVisible"
    :menu-active="editor?.isActive('orderedList')"
    @toggle-popup="togglePopup"
    @menu-click="toggleOrderedList(options[0].value)"
  >
    <template #content>
      <div class="umo-ordered-list-group">
        <tooltip
          v-for="item in options"
          :key="item.value"
          :content="item.label"
        >
          <div
            class="umo-ordered-list-item"
            :class="{ active: listStyleType === item.value }"
            @click="toggleOrderedList(item.value)"
          >
            <icon
              class="umo-icon-ordered-list"
              :name="`ordered-list-${item.value}`"
            />
          </div>
        </tooltip>
      </div>
      <div class="umo-ordered-list-divider"></div>
      <div
        class="umo-ordered-list-title"
        v-text="t('list.ordered.property')"
      ></div>
      <div class="umo-ordered-list-properties">
        <t-input-number
          v-model="startAt"
          :min="1"
          align="left"
          theme="column"
          @change="changeOrderedListStart"
        >
          <template #label
            ><span v-text="t('list.ordered.startAt')"></span
          ></template>
        </t-input-number>
      </div>
    </template>
  </menus-button>
</template>

<script setup lang="ts">
const { popupVisible, togglePopup } = usePopup()
const editor = inject('editor')

const options = [
  { label: t('list.ordered.decimal'), value: 'decimal' },
  {
    label: t('list.ordered.decimalLeadingZero'),
    value: 'decimal-leading-zero',
  },
  { label: t('list.ordered.lowerRoman'), value: 'lower-roman' },
  { label: t('list.ordered.upperRoman'), value: 'upper-roman' },
  { label: t('list.ordered.lowerLatin'), value: 'lower-latin' },
  { label: t('list.ordered.upperLatin'), value: 'upper-latin' },
  {
    label: t('list.ordered.tradChineseInformal'),
    value: 'trad-chinese-informal',
  },
  {
    label: t('list.ordered.simpChineseFormal'),
    value: 'simp-chinese-formal',
  },
]

// 列表类型
let listStyleType = $ref('left')
watch(
  () => popupVisible.value,
  (val: boolean) => {
    if (val && editor.value) {
      const { listType } = editor.value.getAttributes('orderedList')
      listStyleType = listType
    }
  },
)
const toggleOrderedList = (listType: string) => {
  const chain = editor.value?.chain().focus()
  if (editor.value?.isActive('orderedList')) {
    if (editor.value.getAttributes('orderedList').listType === listType) {
      chain?.toggleOrderedList().run()
    } else {
      chain?.updateAttributes('orderedList', { listType }).run()
    }
  } else {
    chain
      ?.toggleOrderedList()
      .updateAttributes('orderedList', { listType })
      .run()
  }
  listStyleType = listType
  popupVisible.value = false
}

// 起始编号
let startAt = $ref(1)
const changeOrderedListStart = () => {
  if (editor.value) {
    editor.value
      .chain()
      .focus()
      .updateAttributes('orderedList', { start: startAt })
      .run()
  }
}
watch(
  () => popupVisible.value,
  (val: boolean) => {
    if (val && editor.value) {
      startAt = editor.value.getAttributes('orderedList').start
    } else {
      startAt = 1
    }
  },
)
</script>

<style lang="less" scoped>
.umo-ordered-list-group {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 8px;
  width: 248px;
  margin-bottom: 10px;
  .umo-ordered-list-item {
    cursor: pointer;
    padding: 5px;
    border: solid 1px var(--umo-border-color);
    box-sizing: border-box;
    &:nth-child(4n) {
      margin-right: 0;
    }
    &:hover {
      background-color: var(--umo-button-hover-background);
    }
    &.active {
      border-color: var(--umo-primary-color);
    }
  }
  .umo-icon-ordered-list {
    font-size: 44px;
  }
}
.umo-ordered-list-title {
  color: var(--umo-text-color-light);
  font-size: 12px;
  margin: 7px 0 4px;
}
.umo-ordered-list-divider {
  height: 1px;
  background-color: var(--umo-border-color-light);
  margin: 5px 0 0;
}
.umo-ordered-list-properties {
  display: flex;
  flex-direction: column;
  :deep(.umo-input-number) {
    width: 248px;
  }
}
</style>
