<template>
  <node-view-wrapper
    :id="node.attrs.id"
    ref="containerRef"
    class="umo-node-view umo-floating-node"
    :style="{
      zIndex: 90,
      '--umo-textbox-border-color': node.attrs.borderColor,
      '--umo-textbox-border-width': node.attrs.borderWidth + 'px',
      '--umo-textbox-border-style': node.attrs.borderStyle,
      '--umo-textbox-background-color': node.attrs.backgroundColor,
    }"
  >
    <div class="umo-node-container umo-node-text-box">
      <drager
        :style="{
          cursor: !options.document?.readOnly
            ? 'inherit'
            : 'default !important',
        }"
        :selected="selected"
        :disabled="disabled || options?.document?.readOnly"
        :rotatable="true"
        :boundary="false"
        :angle="node.attrs.angle"
        :width="node.attrs.width"
        :height="node.attrs.height"
        :left="node.attrs.left"
        :top="node.attrs.top"
        :min-width="14"
        :min-height="14"
        :title="t('node.textBox.tip')"
        :draggable="true"
        @rotate="onRotate"
        @resize="onResize"
        @drag="onDrag"
        @blur="disabled = false"
        @click="selected = true"
        @dblclick="editTextBox"
      >
        <node-view-content ref="contentRef" class="umo-node-text-box-content" />
      </drager>
    </div>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import Drager from 'es-drager'

const { node, updateAttributes } = defineProps(nodeViewProps)

const options = inject('options')

const containerRef = ref(null)
const contentRef = $ref(null)
let selected = $ref(false)
let disabled = $ref(false)

const onRotate = ({ angle }: { angle: number }) => {
  updateAttributes({ angle })
}
const onResize = ({ width, height }: { width: number; height: number }) => {
  updateAttributes({ width, height })
}
const onDrag = ({ left, top }: { left: number; top: number }) => {
  updateAttributes({ left, top })
}

onClickOutside(containerRef, () => {
  selected = false
  disabled = false
})

const editTextBox = () => {
  disabled = true
  const range = document.createRange()
  range.selectNodeContents(contentRef.$el)
  const sel = window.getSelection()
  sel?.removeAllRanges()
  sel?.addRange(range)
  contentRef.$el.focus()
}
</script>

<style lang="less">
.umo-node-view {
  .umo-node-text-box {
    position: relative;
    .es-drager {
      user-select: text !important;
      cursor: default !important;
      z-index: 90 !important;
      background-color: var(--umo-textbox-background-color);
      &.dragging {
        caret-color: transparent;
      }
      &.disabled {
        outline: none;
        &:after {
          display: none !important;
        }
      }
      &.selected {
        .umo-node-text-box-content {
          outline: none;
        }
      }
      &.disabled.selected {
        .umo-node-text-box-content {
          outline: var(--umo-textbox-border-style)
            var(--umo-textbox-border-width) var(--umo-textbox-border-color);
        }
      }
    }
    .umo-node-text-box-content {
      outline: var(--umo-textbox-border-style) var(--umo-textbox-border-width)
        var(--umo-textbox-border-color);
      height: 100%;
      padding: 5px;
      box-sizing: border-box;
      overflow: hidden;
    }
  }
}
</style>
