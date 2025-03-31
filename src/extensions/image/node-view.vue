<template>
  <node-view-wrapper
    ref="containerRef"
    class="umo-node-view"
    :class="{ 'umo-floating-node': node.attrs.draggable }"
    :style="nodeStyle"
    @dblclick="openImageViewer"
  >
    <div
      class="umo-node-container umo-node-image"
      :class="{
        'is-loading': node.attrs.src && isLoading,
        'is-error': node.attrs.src && error,
        'is-draggable': node.attrs.draggable,
        'umo-hover-shadow': !options.document?.readOnly,
        'umo-select-outline': !node.attrs.draggable,
      }"
    >
      <div
        v-if="node.attrs.src && isLoading"
        class="loading"
        :style="{ height: `${node.attrs.height}px` }"
      >
        <icon name="loading" class="loading-icon" />
        {{ t('node.image.loading') }}
      </div>
      <div
        v-else-if="node.attrs.src && error"
        class="error"
        :style="{ height: `${node.attrs.height}px` }"
      >
        <icon name="image-failed" class="error-icon" />
        {{ t('node.image.error') }}
      </div>
      <drager
        v-else
        :selected="selected"
        :rotatable="true"
        :boundary="false"
        :draggable="
          Boolean(node.attrs.draggable) && !options.document?.readOnly
        "
        :disabled="options.document?.readOnly"
        :angle="node.attrs.angle"
        :width="Number(node.attrs.width)"
        :height="Number(node.attrs.height)"
        :left="Number(node.attrs.left)"
        :top="Number(node.attrs.top)"
        :min-width="14"
        :min-height="14"
        :max-width="maxWidth"
        :max-height="maxHeight"
        :z-index="10"
        :equal-proportion="node.attrs.equalProportion"
        @rotate="onRotate"
        @resize="onResize"
        @drag="onDrag"
        @focus="selected = true"
      >
        <img
          ref="imageRef"
          :src="node.attrs.src"
          :style="{
            transform:
              node.attrs.flipX || node.attrs.flipY
                ? `rotateX(${node.attrs.flipX ? '180' : '0'}deg) rotateY(${node.attrs.flipY ? '180' : '0'}deg)`
                : 'none',
          }"
          :data-id="node.attrs.id"
          loading="lazy"
          @load="onLoad"
        />
        <div
          v-if="!node.attrs.uploaded && node.attrs.file !== null"
          class="uploading"
        >
          <span></span>
        </div>
      </drager>
    </div>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import Drager from 'es-drager'
import { base64ToFile } from 'file64'

import { shortId } from '@/utils/short-id'

const container = inject('container')
const uploadFileMap = inject('uploadFileMap')
const imageViewer = inject('imageViewer')
const { node, updateAttributes } = defineProps(nodeViewProps)
const options = inject('options')
const { isLoading, error } = useImage({ src: node.attrs.src })

const containerRef = ref(null)
const imageRef = $ref<HTMLImageElement | null>(null)
let selected = $ref(false)
let maxWidth = $ref(0)
let maxHeight = $ref(0)

const nodeStyle = $computed(() => {
  const { nodeAlign, margin } = node.attrs
  const marginTop =
    margin?.top && margin?.top !== '' ? `${margin.top}px` : undefined
  const marginBottom =
    margin?.bottom && margin?.bottom !== '' ? `${margin.bottom}px` : undefined
  return {
    justifyContent: nodeAlign,
    marginTop,
    marginBottom,
    zIndex: selected ? 100 : node.attrs.draggable ? 95 : 0,
  }
})

const uploadImage = async () => {
  if (
    node.attrs.uploaded ||
    !node.attrs.id ||
    !uploadFileMap.value.has(node.attrs.id)
  ) {
    updateAttributes({ uploaded: true })
    return
  }
  try {
    const file = uploadFileMap.value.get(node.attrs.id)
    const { id, url } = (await options.value?.onFileUpload?.(file)) ?? {}
    if (containerRef.value) {
      updateAttributes({ id, src: url, uploaded: true })
    }
    uploadFileMap.value.delete(node.attrs.id)
  } catch (error) {
    useMessage('error', {
      attach: container,
      content: (error as Error).message,
    })
  }
}
const onLoad = async () => {
  // updateAttributes({ error: false })
  if (node.attrs.width === null) {
    const { clientWidth = 1, clientHeight = 1 } = imageRef ?? {}
    const ratio = clientWidth / clientHeight
    maxWidth = containerRef.value?.$el.clientWidth
    maxHeight = maxWidth / ratio
    updateAttributes({ width: (200 * ratio).toFixed(2) })
  }
  if ([null, 'auto', 0].includes(node.attrs.height)) {
    await nextTick()
    const { height } = imageRef?.getBoundingClientRect() ?? {}
    updateAttributes({ height: height.toFixed(2) })
  }
}

const onRotate = ({ angle }: { angle: number }) => {
  updateAttributes({ angle })
}
const onResize = ({ width, height }: { width: number; height: number }) => {
  updateAttributes({
    width: width.toFixed(2),
    height: height.toFixed(2),
  })
}

const onDrag = ({ left, top }: { left: number; top: number }) => {
  updateAttributes({ left, top })
}

onClickOutside(containerRef, () => {
  selected = false
})

const openImageViewer = async () => {
  const id = shortId(10)
  if (node.attrs.id === null) {
    updateAttributes({ id })
  }
  await nextTick()
  imageViewer.value.visible = true
  imageViewer.value.current = node.attrs.id
}

watch(
  () => node.attrs.equalProportion,
  async (equalProportion: boolean) => {
    await nextTick()
    const width = imageRef?.offsetWidth ?? 1
    const height = imageRef?.offsetHeight ?? 1
    updateAttributes({ width, height })
    maxHeight = equalProportion ? maxWidth / (width / height) : 0
  },
)
watch(
  () => node.attrs.src,
  async (src: string) => {
    if (node.attrs.uploaded === false && !error.value) {
      if (src?.startsWith('data:image')) {
        const [data, type] = src.split(';')[0].split(':')
        let [_, ext] = type.split('/')
        if (ext === 'jpeg') {
          ext = 'jpg'
        }
        if (ext === 'svg+xml') {
          ext = 'svg'
        }
        const filename = shortId(10)
        const file = await base64ToFile(src, `${filename}.${ext}`, {
          type,
        })
        updateAttributes({ file })
      }
      await nextTick()
      void uploadImage()
    }
  },
  { immediate: true },
)
watch(
  () => error.value,
  (errorValue: any) => {
    if (errorValue?.type) {
      updateAttributes({ error: errorValue.type === 'error' })
    } else {
      updateAttributes({ error: false })
    }
  },
)
</script>

<style lang="less">
.umo-node-view {
  .umo-node-image {
    max-width: 100%;
    width: auto;
    position: relative;
    z-index: 20;
    &.is-loading,
    &.is-error {
      outline: none !important;
      box-shadow: none !important;
    }
    &:not(.is-draggable) .es-drager {
      max-width: 100%;
      max-height: 100%;
    }
    img {
      display: block;
      max-width: 100%;
      max-height: 100%;
      width: 100%;
      height: 100%;
    }

    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--umo-text-color-light);
      font-size: 12px;
      gap: 10px;

      .loading-icon {
        color: var(--umo-primary-color);
        font-size: 22px;
        animation: turn 1s linear infinite;
      }
    }

    .error {
      width: 200px;
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: var(--umo-text-color-light);
      font-size: 12px;

      .error-icon {
        font-size: 72px;
        margin: -8px 0 -2px;
      }
    }

    .uploading {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.1);

      span {
        display: block;
        position: absolute;
        background: rgba(0, 0, 0, 0.2);
        height: 4px;
        border-radius: 2px;
        top: 50%;
        left: 20%;
        right: 20%;
        transform: translateY(-50%);
        overflow: hidden;

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
}

@keyframes turn {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
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
