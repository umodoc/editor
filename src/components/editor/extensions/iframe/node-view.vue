<template>
  <node-view-wrapper
    ref="containerRef"
    class="node-view iframe-node-view"
    :id="node.attrs.id"
    :style="{ 'justify-content': node.attrs.nodeAlign }"
  >
    <div class="node-container hover-shadow select-outline iframe">
      <drager
        :selected="selected"
        :rotatable="false"
        :width="node.attrs.width"
        :height="node.attrs.height"
        :min-width="400"
        :min-height="100"
        :max-width="maxWidth"
        @resize="onResize"
        @click="selected = true"
      >
        <iframe :src="node.attrs.src"></iframe>
      </drager>
    </div>
  </node-view-wrapper>
</template>

<script setup>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import Drager from 'es-drager'

const { node, updateAttributes } = defineProps(nodeViewProps)

const containerRef = ref(null)
let selected = $ref(false)
let maxWidth = $ref(0)
onMounted(() => {
  const width = containerRef.value.$el.offsetWidth
  maxWidth = width
  if (node.attrs.width === null) updateAttributes({ width })
})
const onResize = ({ width, height }) => {
  updateAttributes({ width, height })
}

onClickOutside(containerRef, () => (selected = false))
</script>

<style lang="less">
.node-view {
  .iframe {
    max-width: 100%;
    .es-drager {
      &:not(.selected) {
        outline: solid 1px var(--umo-content-node-border);
      }
    }
    iframe {
      display: block;
      width: 100%;
      height: 100%;
      border: none;
      pointer-events: none;
      background-color: var(--umo-color-white);
    }
  }
}
</style>
