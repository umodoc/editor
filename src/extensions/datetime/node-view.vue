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
        <span>{{ attrs.text }}</span>
      </span>
      <template #content>
        <t-date-picker-panel
          :value="attrs.date"
          :format="
            attrs.format || `YYYY-MM-DD${attrs.withTime ? ' HH:mm:ss' : ''}`
          "
          :enable-time-picker="attrs.withTime"
          :mode="'date'"
          need-confirm
          @change="datetimeChange"
        />
      </template>
    </t-popup>
  </node-view-wrapper>
</template>

<script setup>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
const props = defineProps(nodeViewProps)
const attrs = $computed(() => props.node.attrs)
const { updateAttributes } = props
const container = inject('container')
const options = inject('options')
const page = inject('page')
let popupVisible = $ref(false)

const datetimeChange = (value) => {
  updateAttributes({ date: value, text: value })
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
    color: #ccc;
    margin-right: 0.3em;
  }
  &:hover {
    color: var(--umo-primary-color);
  }
}
</style>
