<template>
  <node-view-wrapper
    ref="containerRef"
    class="node-view text-box-node-view"
    @dblclick.capture="disabled = true"
  >
    <div class="node-container text-box">
      <drager
        :selected="selected"
        :disabled="disabled"
        :draggable="!options.document.readOnly"
        :rotatable="true"
        :boundary="false"
        :angle="node.attrs.angle"
        :width="node.attrs.width"
        :height="node.attrs.height"
        :left="node.attrs.left"
        :top="node.attrs.top"
        :min-width="14"
        :min-height="14"
        title="双击进行编辑"
        @rotate="onRotate"
        @resize="onResize"
        @drag="onDrag"
        @blur="disabled = false"
        @click="selected = true"
      >
        <node-view-content class="content" />
      </drager>
    </div>
  </node-view-wrapper>
</template>

<script setup>
import { nodeViewProps, NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'
import Drager from 'es-drager'

const { node, updateAttributes } = defineProps(nodeViewProps)

const { options } = useStore()

const containerRef = ref(null)
let selected = $ref(false)
const disabled = $ref(false)

const onRotate = ({ angle }) => {
  updateAttributes({ angle })
}
const onResize = ({ width, height }) => {
  updateAttributes({ width, height })
}
const onDrag = ({ left, top }) => {
  updateAttributes({ left, top })
}

onClickOutside(containerRef, () => (selected = false))
</script>

<style lang="less">
.node-view {
  .text-box {
    position: relative;
    z-index: 90;
    .es-drager {
      user-select: text !important;
      cursor: default !important;
      &.disabled {
        outline: none;
        &:after {
          display: none !important;
        }
      }
      &.selected {
        .content {
          border: none;
        }
      }
      &.disabled.selected {
        .content {
          outline: solid 1px var(--umo-text-color);
        }
      }
    }
    .content {
      outline: solid 1px var(--umo-text-color);
      height: 100%;
      padding: 5px;
      box-sizing: border-box;
      overflow: hidden;
    }
  }
}
</style>
