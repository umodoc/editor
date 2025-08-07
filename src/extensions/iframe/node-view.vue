<template>
  <node-view-wrapper
    :id="node.attrs.id"
    ref="containerRef"
    class="umo-node-view"
    :style="nodeStyle"
  >
    <div
      class="umo-node-container umo-select-outline umo-node-iframe"
      :class="{
        'umo-hover-shadow': !options.document?.readOnly,
      }"
    >
      <drager
        :selected="selected"
        :rotatable="false"
        :width="node.attrs.width"
        :height="node.attrs.height"
        :min-width="400"
        :min-height="200"
        :max-width="maxWidth"
        :disabled="options.document?.readOnly"
        @resize="onResize"
        @focus="selected = true"
      >
        <iframe
          :src="node.attrs.src"
          :style="{ pointerEvents: node.attrs.clickable ? 'auto' : 'none' }"
        ></iframe>
      </drager>
    </div>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import Drager from 'es-drager'

const { node, updateAttributes } = defineProps(nodeViewProps)
const containerRef = ref(null)
let selected = $ref(false)
let maxWidth = $ref(0)

const nodeStyle = $computed(() => {
  const { nodeAlign, margin } = node.attrs
  const marginTop =
    margin?.top && margin?.top !== '' ? `${margin.top}px` : undefined
  const marginBottom =
    margin?.bottom && margin?.bottom !== '' ? `${margin.bottom}px` : undefined
  return {
    'justify-content': nodeAlign,
    marginTop,
    marginBottom,
  }
})

onMounted(async () => {
  await nextTick()
  if (containerRef.value) {
    const { offsetWidth } = containerRef.value.$el

    maxWidth = offsetWidth
    if (node.attrs.width === null) {
      updateAttributes({ width: offsetWidth })
    }
  }
})
const onResize = ({ width, height }: { width: number; height: number }) => {
  updateAttributes({ width, height })
}
onClickOutside(containerRef, () => {
  selected = false
  updateAttributes({ clickable: false })
})
</script>

<style lang="less">
.umo-node-view {
  .umo-node-iframe {
    max-width: 100%;
    .es-drager {
      &:not(.selected) {
        outline: solid 1px var(--umo-content-node-border);
      }
    }
    iframe {
      display: block;
      min-width: 200px;
      min-height: 200px;
      width: 100%;
      height: 100%;
      border: none;
      background-color: var(--umo-color-white);
    }
  }
}
</style>
