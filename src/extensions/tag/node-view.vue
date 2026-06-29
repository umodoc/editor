<template>
  <node-view-wrapper
    as="span"
    class="umo-node-tag"
    @click.capture="editor?.commands.setNodeSelection(getPos())"
  >
    <span
      class="umo-node-tag-text"
      :style="{
        color: attrs.color,
        backgroundColor: attrs.backgroundColor,
        cursor:
          !options.document?.readOnly || editor.isEditable
            ? 'pointer'
            : 'default',
      }"
      v-text="attrs.text"
    ></span>
  </node-view-wrapper>
</template>

<script setup>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'

const props = defineProps(nodeViewProps)
const { getPos } = props
const attrs = $computed(() => props.node.attrs)
const options = inject('options')
const editor = inject('editor')
</script>

<style lang="less">
.umo-node-tag {
  margin: 0;
  padding: 0 0.2em;
  box-sizing: border-box;
  background-color: transparent !important;
  vertical-align: middle;
  display: inline-flex;
  transform: translateY(-0.05em);
  &-text {
    border-radius: 0.2em;
    padding: 0.1em 0.4em;
    font-size: 0.9em;
    margin: 0;
    display: inline-block;
    white-space: nowrap;
    border: 1px solid rgba(0, 0, 0, 0.05);
    box-sizing: border-box;
  }
}
</style>
