<template>
  <node-view-wrapper
    :id="attrs.id"
    ref="containerRef"
    class="umo-node-view"
    :style="nodeStyle"
    @click.capture="editor?.commands.setNodeSelection(getPos())"
  >
    <div
      class="umo-node-container umo-node-video"
      :class="{
        'umo-hover-shadow': !options.document?.readOnly,
      }"
    >
      <drager
        :selected="selected"
        :rotatable="false"
        :boundary="false"
        :width="Number(attrs.width)"
        :height="Number(attrs.height)"
        :min-width="300"
        :min-height="200"
        :max-width="maxWidth"
        :max-height="maxHeight"
        :equal-proportion="true"
        :disabled="!editor?.isEditable"
        @resize="onResize"
        @focus="selected = true"
      >
        <video
          v-show="playerShow"
          ref="videoRef"
          :src="attrs.src"
          preload="metadata"
          controls
          crossorigin="anonymous"
          @canplay="onLoad"
        ></video>
        <div
          v-if="!attrs.uploaded && attrs.id !== null"
          class="uploading"
        ></div>
      </drager>
    </div>
  </node-view-wrapper>
</template>

<script setup>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import Drager from 'es-drager'

import { player } from '@/utils/player'

import { updateAttributesWithoutHistory } from '../file'

const props = defineProps(nodeViewProps)
const attrs = $computed(() => props.node.attrs)
const { updateAttributes, getPos } = props
const options = inject('options')
const editor = inject('editor')
const container = inject('container')
const uploadFileMap = inject('uploadFileMap')

const containerRef = ref(null)
let selected = $ref(false)
const videoRef = $ref(null)
let playerInstance = $ref(null)
let playerShow = $ref(false)
let maxWidth = $ref(0)
let maxHeight = $ref(0)

const nodeStyle = $computed(() => {
  const { nodeAlign, margin } = attrs
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
  playerInstance = await player(videoRef, options.value.cdnUrl)
  playerInstance.on('ready', () => (playerShow = true))
  if (attrs.uploaded || !attrs.id) {
    return
  }
  if (uploadFileMap.value.has(attrs.id)) {
    try {
      const file = uploadFileMap.value.get(attrs.id)
      const result = await options.value?.onFileUpload?.(file)
      const { id, url } = result
      if (containerRef.value) {
        updateAttributesWithoutHistory(
          editor.value,
          { id, src: url, uploaded: true },
          getPos(),
        )
      }
      uploadFileMap.value.delete(attrs.id)
    } catch (e) {
      useMessage('error', { attach: container, content: e.message })
    }
  }
})
const onLoad = () => {
  if (attrs.width === null) {
    const { clientWidth = 0, clientHeight = 0 } = videoRef
    maxWidth = containerRef.value?.$el.clientWidth
    const ratio = clientWidth / clientHeight
    maxHeight = containerRef.value?.$el.clientWidth / ratio
    updateAttributes({
      width: (200 * ratio).toFixed(2),
    })
    setTimeout(() => {
      updateAttributes({
        height: containerRef.value?.$el.clientHeight,
      })
    }, 200)
  }
}
const onResize = ({ width, height }) => {
  updateAttributes({ width, height })
}

onBeforeUnmount(() => {
  playerInstance?.destroy?.()
  setTimeout(() => {
    if (editor.value.isDestroyed) return
    options.value.onFileDelete(attrs.id, attrs.src, `image:${attrs.type}`)
  }, 500)
})

onClickOutside(containerRef, () => {
  selected = false
})
</script>

<style lang="less">
.umo-node-view {
  .umo-node-video {
    max-width: 100%;
    pointer-events: none;
    border-radius: var(--umo-radius);

    .es-drager {
      max-width: 100%;
      max-height: 100%;
      .es-drager-dot {
        pointer-events: auto;
      }

      .plyr {
        height: 100%;
      }

      video {
        display: block;
        border-radius: var(--umo-radius);
        overflow: hidden;
        pointer-events: auto;
        outline: none;
        max-width: 100%;
        max-height: 100%;
        width: 100%;
        height: 100%;
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
      left: 0;
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
