<template>
  <node-view-wrapper as="span" class="umo-node-datetime">
    <t-popup
      v-model="popupVisible"
      :attach="`${container} .umo-zoomable-container`"
      trigger="click"
      placement="bottom-start"
      :disabled="
        page.preview?.enabled ||
        options.document?.readOnly ||
        !editor?.isEditable
      "
    >
      <span class="umo-node-datetime-text">
        <icon name="date" class="umo-node-datetime-icon" />
        <span>{{ node.attrs.text }}</span>
      </span>
      <template #content>
        <t-date-picker-panel
          :value="node.attrs.date"
          :format="
            node.attrs.format ||
            `YYYY-MM-DD${node.attrs.withTime ? ' HH:mm:ss' : ''}`
          "
          :enable-time-picker="node.attrs.withTime"
          :mode="node.attrs.format === 'YYYY年M月' ? 'month' : 'date'"
          @change="datetimeChange"
        />
      </template>
    </t-popup>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
const { node, updateAttributes } = defineProps(nodeViewProps)
const container = inject('container')
const options = inject('options')
const page = inject('page')
let popupVisible = $ref(false)

const formatDateToChinese = (dateStr: string) => {
  const replaceDigits = (num: string) => {
    const digits = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九']
    return num
      .toString()
      .split('')
      .map((n) => digits[Number(n)])
      .join('')
  }

  return dateStr.replace(/\d+/g, (match) => {
    if (match.length === 4) {
      // 年份
      return replaceDigits(match)
    }
    if (match.length === 1) {
      // 月份或日期
      return replaceDigits(match)
    }
    if (match.length === 2) {
      const num1 = match.charAt(0)
      const num2 = match.charAt(1)
      if (num1 === '0') {
        return `${replaceDigits(num1)}十`
      }
      if (num1 === '1') {
        return `十${replaceDigits(num2)}`
      }
      if (num2 === '0') {
        return `${replaceDigits(num1)}十`
      }
      return `${replaceDigits(num1)}十${replaceDigits(num2)}`
    }
    return match // 其他情况不处理
  })
}

const datetimeChange = (value: any) => {
  let selectDate = value
  if (selectDate && node?.attrs?.capitalize) {
    selectDate = formatDateToChinese(value)
  }
  updateAttributes({ date: selectDate, text: selectDate })
  popupVisible = false
}
</script>

<style lang="less">
.umo-node-datetime {
  margin: 0 0.2em;
  background-color: transparent !important;
  vertical-align: middle;
  &-text {
    box-decoration-break: clone;
    margin: 0 0.2em;
    border-radius: 0.2em;
    cursor: default;
    display: inline-flex;
    align-items: center;
    white-space: nowrap;
  }
  &-icon {
    color: var(--umo-text-color-light);
    margin-right: 0.3em;
  }
  &:hover {
    color: var(--umo-primary-color);
  }
}
</style>
