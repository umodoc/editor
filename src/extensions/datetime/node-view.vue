<template>
  <node-view-wrapper as="span" class="umo-node-datetime">
    <t-popup
      v-model="popupVisible"
      :attach="`${container} .umo-zoomable-container`"
      trigger="click"
      placement="bottom-start"
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
let popupVisible = $ref(false)

const datetimeChange = (value: any) => {
  updateAttributes({ date: value, text: value })
  popupVisible = false
}
</script>

<style lang="less" scoped>
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
