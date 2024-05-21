<template>
  <node-view-wrapper
    ref="containerRef"
    class="node-view video-node-view"
    :style="{ 'justify-content': node.attrs.nodeAlign }"
  >
    <div class="node-container hover-shadow video">
      <drager
        :selected="selected"
        :rotatable="false"
        :boundary="false"
        :width="node.attrs.width"
        :height="node.attrs.height"
        :min-width="200"
        :min-height="200"
        :max-width="maxWidth"
        equal-proportion
        @resize="onResize"
        @click="selected = true"
      >
        <video
          ref="videoRef"
          :src="node.attrs.src"
          controls
          crossorigin
          @canplay="onLoad"
        ></video>
        <div
          v-if="!node.attrs.uploaded && node.attrs.file !== null"
          class="uploading"
        ></div>
      </drager>
    </div>
  </node-view-wrapper>
</template>

<script setup>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import Drager from 'es-drager'
import { mediaPlayer } from '@/utils/media-player'

const { node, updateAttributes } = defineProps(nodeViewProps)
const { options } = useStore()

const containerRef = ref(null)
let selected = $ref(false)
const videoRef = $ref(null)
let player = $ref(null)
let maxWidth = $ref(0)
onMounted(async () => {
  const width = containerRef.value.$el.clientWidth
  maxWidth = width
  if (node.attrs.width === null) {
    updateAttributes({ width })
  }
  player = mediaPlayer(videoRef)
  if (node.attrs.uploaded === false && node.attrs.file) {
    try {
      const { url } = await options.value.onFileUpload(node.attrs.file)
      if (containerRef.value) {
        updateAttributes({ src: url, file: null, uploaded: true })
      }
    } catch (error) {
      useMessage('error', error.message)
    }
  }
})
const onLoad = () => {
  const height = videoRef?.offsetHeight
  if (containerRef.value && height) {
    updateAttributes({ height })
  }
}
const onResize = ({ width, height }) => {
  updateAttributes({ width, height })
}

onBeforeUnmount(() => {
  if (player) player?.destroy()
})

onClickOutside(containerRef, () => (selected = false))
</script>

<style lang="less">
.node-view {
  .video {
    max-width: 100%;
    pointer-events: none;
    border-radius: var(--umo-radius);
    .es-drager {
      .es-drager-dot {
        pointer-events: auto;
      }
      .plyr {
        height: 100%;
      }
      video {
        display: block;
        width: 100%;
        height: auto;
        border-radius: var(--umo-radius);
        overflow: hidden;
        pointer-events: auto;
        outline: none;
      }
    }
    .plyr {
      pointer-events: auto;
    }
    .uploading {
      position: absolute;
      right: 0;
      top: 0;
      background: rgba(255, 255, 255, 0.7);
      height: 2px;
      top: 0;
      left: 0;
      right: 0;
      border-top-left-radius: var(--umo-radius);
      border-top-right-radius: var(--umo-radius);
      &:after {
        content: '';
        display: block;
        height: 100%;
        background-color: var(--umo-primary-color);
        animation: progress 1s linear infinite;
      }
    }
  }
}
@keyframes progress {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}
</style>
