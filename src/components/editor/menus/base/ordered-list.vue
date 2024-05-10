<template>
  <editor-menus-button
    :button-active="editor?.isActive('orderedList')"
    tooltip="数字编号"
    shortcut="Ctrl+Shift+7"
    button-type="popup"
    popup-handle="arrow"
    :popup-visible="popupVisible"
    @toggle-popup="togglePopup"
    @button-click="toggleOrderedList(options[0].value)"
  >
    <icon name="ordered-list" />
    <template #content>
      <div class="ordered-list-group">
        <tooltip
          v-for="item in options"
          :key="item.value"
          :content="item.label"
        >
          <div
            class="ordered-list-item"
            :class="{ active: listType == item.value }"
            @click="toggleOrderedList(item.value)"
          >
            <icon
              class="icon-ordered-list"
              :name="`ordered-list-${item.value}`"
            />
          </div>
        </tooltip>
      </div>
      <div class="ordered-list-divider"></div>
      <div class="ordered-list-title">列表属性</div>
      <div class="ordered-list-properties">
        <t-input-number
          v-model="startAt"
          :min="1"
          align="left"
          theme="column"
          @change="changeOrderedListStart"
        >
          <template #label><span>起始编号:</span></template>
        </t-input-number>
      </div>
    </template>
  </editor-menus-button>
</template>

<script setup>
let { popupVisible, togglePopup } = usePopup()
const { editor } = useStore()

const options = [
  { label: '数字', value: 'decimal' },
  { label: '以0的开头的数字', value: 'decimal-leading-zero' },
  { label: '小写罗马数字', value: 'lower-roman' },
  { label: '大写罗马数字', value: 'upper-roman' },
  { label: '小写英文编号', value: 'lower-latin' },
  { label: '大写英文编号', value: 'upper-latin' },
  { label: '中文编号', value: 'trad-chinese-informal' },
  { label: '大写中文编号', value: 'simp-chinese-formal' },
]

// 列表类型
let listType = $ref('left')
watch(
  () => popupVisible.value,
  (val) => {
    if (val && editor.value) {
      const { listStyleType } = editor.value.getAttributes('orderedList')
      listType = listStyleType?.listStyleType || listStyleType || ''
    }
  },
)
const toggleOrderedList = (listStyleType) => {
  const chain = editor.value?.chain().focus()
  if (!editor.value?.isActive('orderedList')) {
    chain
      .toggleOrderedList()
      .updateAttributes('orderedList', { listStyleType })
      .run()
  }
  // 切换列表类型
  else if (
    editor.value.getAttributes('orderedList').listStyleType !== listStyleType
  ) {
    chain.updateAttributes('orderedList', { listStyleType }).run()
  }
  // 关闭列表类型
  else {
    chain.toggleOrderedList().run()
  }
  listType = listStyleType
  popupVisible.value = false
}

// 起始编号
let startAt = $ref(1)
const changeOrderedListStart = () => {
  if (editor.value) {
    editor.value
      ?.chain()
      .focus()
      .updateAttributes('orderedList', { start: startAt })
      .run()
  }
}
watch(
  () => popupVisible.value,
  (val) => {
    if (val && editor.value) {
      startAt = editor.value.getAttributes('orderedList').start
    } else {
      startAt = 1
    }
  },
)
</script>

<style lang="less" scoped>
.ordered-list-group {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 8px;
  width: 248px;
  margin-bottom: 10px;
  .ordered-list-item {
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
  .icon-ordered-list {
    font-size: 44px;
  }
}
.ordered-list-title {
  color: var(--umo-text-color-light);
  font-size: 12px;
  margin: 7px 0 4px;
}
.ordered-list-divider {
  height: 1px;
  background-color: var(--umo-border-color-light);
  margin: 5px 0 0;
}
.ordered-list-properties {
  display: flex;
  flex-direction: column;
  :deep(.umo-input-number) {
    width: 248px;
  }
}
</style>
