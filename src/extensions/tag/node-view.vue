<template>
  <node-view-wrapper as="span" class="umo-node-tag">
    <span
      class="umo-node-tag-text"
      :style="{
        color: node.attrs.color,
        backgroundColor: node.attrs.backgroundColor,
        cursor:
          !options.document?.readOnly || editor.isEditable
            ? 'pointer'
            : 'default',
      }"
      v-text="node.attrs.text"
    ></span>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'

const { node } = defineProps(nodeViewProps)
const options = inject('options')
const editor = inject('editor')
</script>

<style lang="less">
.umo-node-tag {
  margin: 0 0.2em;
  background-color: transparent !important;
  vertical-align: middle;
  display: inline-block;
  transform: translateY(-0.05em);
  &-text {
    border-radius: 0.2em;
    padding: 0.1em 0.4em;
    font-size: 0.9em;
    margin: 0 0.2em;
    white-space: nowrap;
    border: 1px solid rgba(0, 0, 0, 0.05);
    box-sizing: border-box;
  }
}
</style>
