<template>
  <node-view-wrapper
    ref="containerRef"
    class="umo-node-view"
    :class="{
      'umo-floating-node': attrs.draggable,
      'is-inline-image': attrs.inline,
    }"
    :style="nodeStyle"
    @dblclick="openImageViewer"
    @click.capture="editor?.commands.setNodeSelection(getPos())"
  >
    <div
      class="umo-node-container umo-node-image"
      :class="{
        'is-loading': attrs.src && isLoading,
        'is-error': attrs.src && error,
        'umo-hover-shadow': !options.document?.readOnly,
        'umo-select-outline': !attrs.draggable,
      }"
    >
      <div
        v-if="attrs.src && isLoading"
        class="loading"
        :style="{ height: `${attrs.height}px` }"
      >
        <icon name="loading" class="loading-icon" />
        {{ t('node.image.loading') }}
      </div>
      <div
        v-else-if="attrs.src && error"
        class="error"
        :style="{ height: `${attrs.height}px` }"
      >
        <icon name="image-failed" class="error-icon" />
        {{ t('node.image.error') }}
      </div>
      <drager
        v-else
        ref="dragRef"
        :class="{ 'is-draggable': attrs.draggable }"
        :style="{
          cursor:
            attrs.draggable && !options.document?.readOnly
              ? 'move'
              : 'default !important',
        }"
        :selected="selected"
        :rotatable="true"
        :boundary="false"
        :disabled="options.document?.readOnly"
        :angle="attrs.angle"
        :width="Number(attrs.width)"
        :height="Number(attrs.height)"
        :left="Number(attrs.left)"
        :top="Number(attrs.top)"
        :min-width="14"
        :min-height="14"
        :max-width="maxWidth"
        :max-height="maxHeight"
        :z-index="10"
        :equal-proportion="attrs.equalProportion"
        @rotate="onRotate"
        @resize="onResize"
        @drag-end="onDragEnd"
        @mousedown="onMousedown"
        @focus="selected = true"
      >
        <img
          ref="imageRef"
          :src="attrs.src"
          :class="{ 'not-equal-proportion': !attrs.equalProportion }"
          :style="{
            transform:
              attrs.flipX || attrs.flipY
                ? `rotateX(${attrs.flipX ? '180' : '0'}deg) rotateY(${attrs.flipY ? '180' : '0'}deg)`
                : 'none',
          }"
          :data-id="attrs.id"
          :data-preview="attrs.previewType"
          loading="lazy"
          @load="onLoad"
        />
        <div v-if="!attrs.uploaded && attrs.file !== null" class="uploading">
          <span></span>
        </div>
      </drager>
    </div>
  </node-view-wrapper>
</template>

<script setup>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import Drager from 'es-drager'

import { shortId } from '@/utils/short-id'
import { dataURLToFile } from '@/utils/file'

import { updateAttributesWithoutHistory } from '../file'

const container = inject('container')
const editor = inject('editor')
const uploadFileMap = inject('uploadFileMap')
const imageViewer = inject('imageViewer')
const props = defineProps(nodeViewProps)
const attrs = $computed(() => props.node.attrs)
const { updateAttributes, getPos } = props
const options = inject('options')
const { isLoading, error } = useImage({ src: attrs.src })

const containerRef = ref(null)
const imageRef = $ref(null)
let selected = $ref(false)
let maxWidth = $ref(0)
let maxHeight = $ref(0)

const nodeStyle = $computed(() => {
  const { nodeAlign, margin } = attrs
  const marginTop =
    margin?.top && margin?.top !== '' ? `${margin.top}px` : undefined
  const marginBottom =
    margin?.bottom && margin?.bottom !== '' ? `${margin.bottom}px` : undefined
  return {
    justifyContent: nodeAlign,
    marginTop,
    marginBottom,
    zIndex: selected ? 100 : attrs.draggable ? 95 : 0,
  }
})

const uploadImage = async () => {
  if (attrs.uploaded || !attrs.id || !uploadFileMap.value.has(attrs.id)) {
    updateAttributesWithoutHistory(editor.value, { uploaded: true }, getPos())
    return
  }
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
  } catch (error) {
    useMessage('error', {
      attach: container,
      content: error.message,
    })
  }
}
const onLoad = async () => {
  // updateAttributes({ error: false })
  const { clientWidth = 1, clientHeight = 1 } = imageRef
  const ratio = clientWidth / clientHeight
  maxWidth = containerRef.value?.$el.clientWidth
  maxHeight = maxWidth / ratio
  if (attrs.width === null) {
    updateAttributes({ width: maxWidth })
  }
  if ([null, 'auto', 0].includes(attrs.height)) {
    await nextTick()
    const rect = imageRef?.getBoundingClientRect()
    updateAttributes({ height: Number(rect.height?.toFixed(2)) })
  }
}

const onRotate = ({ angle }) => {
  updateAttributes({ angle })
}
const onResize = ({ width, height }) => {
  updateAttributes({
    width: width.toFixed(2),
    height: height.toFixed(2),
  })
}

const dragRef = $ref(null)
let isMousedown = $ref(false)
const onMousedown = (e) => {
  containerRef.value?.$el.click()
  if (!attrs.draggable) {
    return
  }
  isMousedown = true

  // 记录按下的位置
  const downX = e.clientX
  const downY = e.clientY

  // 鼠标在盒子里的位置
  const elRect = dragRef.$el.getBoundingClientRect()
  const mouseX = downX - elRect.left
  const mouseY = downY - elRect.top

  const onMousemove = (e) => {
    const left = e.clientX - mouseX
    const top = e.clientY - mouseY
    updateAttributes({ left, top })
  }
  const onMouseup = (_e) => {
    isMousedown = false
    // 移除document事件
    document.removeEventListener('mousemove', onMousemove)
    document.removeEventListener('mouseup', onMouseup)
  }
  //  注册鼠标移动事件
  document.addEventListener('mousemove', onMousemove)
  // 鼠标抬起事件
  document.addEventListener('mouseup', onMouseup)
}
const onDragEnd = () => {
  if (!attrs.draggable) {
    setTimeout(() => {
      dragRef.$el.style.left = 0
      dragRef.$el.style.top = 0
    }, 100)
  }
}

onClickOutside(containerRef, () => {
  selected = false
})

const openImageViewer = async () => {
  if (attrs.previewType === null) {
    return
  }
  const id = shortId(10)
  if (attrs.id === null) {
    updateAttributesWithoutHistory(editor.value, { id }, getPos())
  }
  await nextTick()
  imageViewer.value.visible = true
  imageViewer.value.current = attrs.id
}

watch(
  () => attrs.draggable,
  (draggable) => {
    if (!draggable) {
      updateAttributes({ left: null, top: null })
    }
  },
)

watch(
  () => attrs.equalProportion,
  async (equalProportion) => {
    await nextTick()
    const width = imageRef?.offsetWidth
    const height = imageRef?.offsetHeight
    updateAttributes({ width, height })
    maxHeight = equalProportion ? maxWidth / (width / height) : 0
  },
)
watch(
  () => attrs.src,
  async (src) => {
    if (attrs.uploaded === false && !error.value) {
      if (src?.startsWith('data:image')) {
        const id = attrs.id || shortId(10)
        const name = `${attrs.type}-${id}`
        const { file, filename } = dataURLToFile(src, name)
        updateAttributes({
          size: file.size,
          name: filename,
          uploaded: false,
        })
        uploadFileMap.value.set(id, file)
      }
      await nextTick()
      uploadImage()
    }
  },
  { immediate: true },
)
watch(
  () => error.value,
  (err) => {
    updateAttributesWithoutHistory(
      editor.value,
      { error: err?.type ? err.type === 'error' : false },
      getPos(),
    )
  },
)

onBeforeUnmount(() => {
  setTimeout(() => {
    if (editor.value.isDestroyed) return
    options.value.onFileDelete(attrs.id, attrs.src, `image:${attrs.type}`)
  }, 500)
})
</script>

<style lang="less">
.umo-node-view {
  &.is-inline-image {
    display: inline-block !important;
    padding: 2px 6px;
    img {
      max-width: 100% !important;
      max-height: 100% !important;
    }
  }
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
    .es-drager {
      &.is-draggable {
        position: absolute;
      }
      &:not(.is-draggable) {
        position: relative;
        max-width: 100%;
        max-height: 100%;
      }
    }
    img {
      display: block;
      max-width: 100%;
      width: 100%;
      &.not-equal-proportion {
        height: 100%;
      }
    }

    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
      font-size: 12px;
      gap: 10px;

      .loading-icon {
        color: var(--umo-primary-color);
        font-size: 22px;
        animation: turn 1s linear infinite;
      }
    }

    .error {
      width: 100%;
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: #999;
      font-size: 12px;
      min-height: 120px;

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
