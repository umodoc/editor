<template>
  <editor-menus-button
    button-type="popup"
    tooltip="插入新表格"
    huge-button
    :popup-visible="popupVisible"
    @toggle-popup="togglePopup"
  >
    <icon name="table" />
    <template #text>
      <p class="button-text">插入</p>
    </template>
    <template #content>
      <div class="table-grid" @mouseleave="resetTable">
        <div v-for="(row, rowIndex) in table" :key="rowIndex" class="row">
          <div
            v-for="(cell, colIndex) in row"
            :key="colIndex"
            class="cell"
            :class="{ selected: isSelected(rowIndex, colIndex) }"
            @mouseover="selectCell(rowIndex, colIndex)"
            @click="insertTable"
          ></div>
        </div>
      </div>
      <div class="table-custom">
        <div class="table-custom-title">表格属性</div>
        <t-input-number
          v-model="selected.rows"
          theme="column"
          :max="1000"
          :min="0"
          label="行数:"
        />
        <t-input-number
          v-model="selected.cols"
          theme="column"
          :max="30"
          :min="0"
          label="列数:"
        />
        <t-checkbox v-model="withHeaderRow">包含表头</t-checkbox>
        <t-button
          class="insert-button"
          block
          theme="primary"
          variant="base"
          @click="insertTable"
        >
          创建表格
        </t-button>
      </div>
    </template>
  </editor-menus-button>
</template>

<script setup>
let { popupVisible, togglePopup } = usePopup()
const { editor } = useStore()

const table = Array.from({ length: 8 }, () =>
  Array.from({ length: 10 }, () => ''),
)
let selected = $ref({ rows: 0, cols: 0 })
let withHeaderRow = $ref(true)

const isSelected = (rows, cols) => {
  return (
    selected.rows &&
    selected.rows > rows &&
    selected.cols &&
    selected.cols > cols
  )
}
const selectCell = (rows, cols) => {
  selected.rows = rows + 1
  selected.cols = cols + 1
}
const resetTable = () => {
  selected.rows = 0
  selected.cols = 0
}
const insertTable = () => {
  const { rows, cols } = selected
  if (rows === 0 || rows > 1000 || cols === 0 || cols > 30) {
    return
  }
  editor.value?.chain().focus().insertTable({ rows, cols, withHeaderRow }).run()
  popupVisible.value = false
}
</script>

<style lang="less" scoped>
.table-grid {
  .row {
    display: flex;
    gap: 4px;
  }
  .cell {
    width: 14px;
    height: 14px;
    border: 1px solid var(--umo-border-color);
    cursor: pointer;
    margin-bottom: 4px;
    &.selected {
      border-color: var(--umo-primary-color);
      background-color: rgba(0, 0, 0, 0.03);
    }
  }
}

.table-custom {
  :deep(.umo-input-number) {
    width: 196px;
    display: block;
    margin-bottom: 8px;
  }
  &-title {
    color: var(--umo-text-color-light);
    font-size: 12px;
    margin: 8px 0 2px;
  }
  .insert-button {
    margin-top: 5px;
  }
}
</style>
