<template>
  <node-view-wrapper
    ref="containerRef"
    class="umo-node-view"
    :class="wrapperClass"
    :style="nodeStyle"
    @dblclick="openImageViewer"
    @click.capture="handleWrapperClick"
  >
    <div class="umo-node-container umo-node-image" :class="imageClass">
      <div
        v-if="attrs.src && isLoading"
        class="umo-node-image-loading"
        :style="{ height: `${attrs.height}px` }"
      >
        <icon name="loading" class="loading-icon" />
        {{ t('node.image.loading') }}
      </div>
      <div
        v-else-if="attrs.src && error"
        class="umo-node-image-error"
        :style="{ width: `${attrs.width}px`, height: `${attrs.height}px` }"
      >
        <icon name="image-failed" class="error-icon" />
        {{ t('node.image.error') }}
      </div>
      <drager
        v-else
        ref="dragRef"
        :class="dragerClass"
        :style="dragerStyle"
        :selected="selected"
        :rotatable="true"
        :boundary="false"
        :disabled="!editor?.isEditable || isLockedNode"
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
        <div
          v-if="!attrs.uploaded && attrs.file !== null"
          class="umo-node-image-uploading"
        >
          <span></span>
        </div>
      </drager>
      <div
        v-if="showAlt"
        class="umo-node-image-alt"
        :class="altContainerClass"
        @mousedown="focusAltContent"
        @click.stop
        @dblclick.stop
      >
        <node-view-content
          v-if="useRichAltContent"
          class="umo-node-image-alt-content"
          :class="{ 'is-empty': !hasRichAltContent }"
          :data-placeholder="t('node.image.altPlaceholder')"
          @focusin="selected = true"
        />
        <div v-else class="umo-node-image-alt-fallback">
          {{ defaultAltText }}
        </div>
      </div>
    </div>
  </node-view-wrapper>
</template>

<script setup>
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import Drager from 'es-drager'

import { loadResource } from '@/utils/load-resource'
import { shortId } from '@/utils/short-id'
import { dataURLToFile, svgToDataURL } from '@/utils/file'

import { updateAttributesWithoutHistory } from '../file'

const DIAGRAM_TYPES = new Set(['mermaid'])

const container = inject('container')
const page = inject('page')
const editor = inject('editor')
const uploadFileMap = inject('uploadFileMap')
const imageViewer = inject('imageViewer')
const options = inject('options')

const props = defineProps(nodeViewProps)
const { updateAttributes, getPos } = props

const attrs = $computed(() => props.node.attrs)
const isLockedNode = $computed(() => !!attrs.lockedNode)
const { isLoading, error } = useImage({ src: attrs.src })

const containerRef = ref(null)
const imageRef = $ref(null)
const dragRef = $ref(null)

let selected = $ref(false)
let maxWidth = $ref(0)
let maxHeight = $ref(0)
let nodeViewReady = $ref(false)
let diagramRenderSeq = 0

const defaultAltText = $computed(() => {
  const sources = [attrs.alt, attrs.title, attrs.name]
  const fallback = sources.find((item) => String(item ?? '').trim() !== '')
  return String(fallback ?? '').trim()
})
const hasRichAltContent = $computed(() => props.node.content.size > 0)
const isPreviewMode = $computed(() => !!page.value.preview?.enabled)
const isReadonlyAlt = $computed(
  () => !!options.value.document?.readOnly || isPreviewMode,
)
const canEditAlt = $computed(() => !isReadonlyAlt && !isLockedNode)
const useRichAltContent = $computed(() => !isReadonlyAlt || hasRichAltContent)
const showAlt = $computed(
  () =>
    !attrs.inline &&
    attrs.showTitle !== false &&
    (!isReadonlyAlt || hasRichAltContent || defaultAltText !== ''),
)

const wrapperClass = $computed(() => ({
  'umo-floating-node': attrs.draggable,
  'is-inline-image': attrs.inline,
}))
const imageClass = $computed(() => ({
  'is-loading': attrs.src && isLoading,
  'is-error': attrs.src && error,
}))
const dragerClass = $computed(() => ({
  'is-draggable': attrs.draggable,
  'umo-hover-shadow': !options.value.document?.readOnly,
  'umo-select-outline': !attrs.draggable && attrs.src && !error,
  'is-alt-selected': selected && !attrs.draggable && attrs.src && !error,
}))
const dragerStyle = $computed(() => ({
  cursor:
    attrs.draggable && !options.value.document?.readOnly && !isLockedNode
      ? 'move'
      : 'default !important',
}))
const altContainerClass = $computed(() => ({
  'is-readonly': !canEditAlt,
  'has-fallback': !useRichAltContent,
}))
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

const getHostElement = () => containerRef.value?.$el
const getDragElement = () => dragRef?.$el
const getNodePos = () => getPos?.()
const getEditorState = () => editor.value?.state
const getEditorView = () => editor.value?.view

const updateNodeAttrsWithoutHistory = (nextAttrs) => {
  updateAttributesWithoutHistory(editor.value, nextAttrs, getNodePos())
}

const getContainerMaxWidth = () => {
  const hostEl = getHostElement()
  return Math.max(
    14,
    hostEl?.clientWidth || hostEl?.getBoundingClientRect().width || 0,
  )
}

const getImageRatio = () => {
  const attrWidth = Number(attrs.width)
  const attrHeight = Number(attrs.height)
  if (attrWidth > 0 && attrHeight > 0) {
    return attrWidth / attrHeight
  }
  const imageWidth = Number(
    imageRef?.naturalWidth || imageRef?.clientWidth || 0,
  )
  const imageHeight = Number(
    imageRef?.naturalHeight || imageRef?.clientHeight || 0,
  )
  if (imageWidth > 0 && imageHeight > 0) {
    return imageWidth / imageHeight
  }
  return 1
}

const syncContainerBounds = () => {
  const nextMaxWidth = getContainerMaxWidth()
  const ratio = getImageRatio()
  maxWidth = nextMaxWidth
  maxHeight = nextMaxWidth > 0 && ratio > 0 ? nextMaxWidth / ratio : 0
  return { nextMaxWidth, ratio }
}

const syncRenderedImageHeight = async () => {
  await nextTick()
  const renderedHeight = Number(
    imageRef?.getBoundingClientRect?.().height?.toFixed?.(2),
  )
  if (!Number.isFinite(renderedHeight) || renderedHeight <= 0) {
    return
  }
  const currentHeight = Number(attrs.height) || 0
  if (Math.abs(currentHeight - renderedHeight) < 0.5) {
    return
  }
  updateAttributes({ height: renderedHeight })
}

const clampImageToContainer = () => {
  const { nextMaxWidth, ratio } = syncContainerBounds()
  if (nextMaxWidth <= 0) {
    return
  }
  const currentWidth = Number(attrs.width)
  if (currentWidth > 0 && currentWidth <= nextMaxWidth) {
    return
  }
  const nextWidth =
    currentWidth > 0 ? Math.min(currentWidth, nextMaxWidth) : nextMaxWidth
  const nextHeight =
    ratio > 0 ? Number((nextWidth / ratio).toFixed(2)) : Number(attrs.height)
  updateAttributes({
    width: Number(nextWidth.toFixed(2)),
    ...(Number.isFinite(nextHeight) && nextHeight > 0
      ? { height: nextHeight }
      : {}),
  })
}

const isDiagramPlaceholderSrc = (src) =>
  typeof src === 'string' && src.startsWith('data:image/svg+xml;charset=utf-8,')

const parseSvgNumber = (value) => {
  if (value === undefined || value === null) return undefined
  const raw = String(value).trim()
  if (!raw) return undefined
  const num = Number.parseFloat(raw.replace(/px$/i, ''))
  return Number.isFinite(num) ? num : undefined
}

const getSvgIntrinsicSize = (svgText) => {
  if (!svgText) return null
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(String(svgText), 'image/svg+xml')
    const svg = doc.documentElement
    if (!svg || svg.nodeName.toLowerCase() !== 'svg') return null
    const widthAttr = parseSvgNumber(svg.getAttribute('width'))
    const heightAttr = parseSvgNumber(svg.getAttribute('height'))
    if (widthAttr && heightAttr) return { width: widthAttr, height: heightAttr }
    const viewBox = svg.getAttribute('viewBox')
    if (viewBox) {
      const parts = viewBox
        .trim()
        .split(/[\s,]+/)
        .map((item) => Number.parseFloat(item))
      if (parts.length === 4 && parts.every((item) => Number.isFinite(item))) {
        const [, , width, height] = parts
        if (width > 0 && height > 0) {
          return { width, height }
        }
      }
    }
  } catch {}
  return null
}

const applyRenderedDiagram = (svg, seq) => {
  if (!svg || seq !== diagramRenderSeq) {
    return
  }
  const size = getSvgIntrinsicSize(svg)
  updateNodeAttrsWithoutHistory({
    id: shortId(10),
    src: svgToDataURL(svg),
    width: size?.width ? Number(size.width.toFixed(2)) : null,
    height: size?.height ? Number(size.height.toFixed(2)) : null,
    equalProportion: true,
  })
}

const getDiagramConfig = () => {
  if (!attrs.config) {
    return {}
  }
  try {
    return JSON.parse(String(attrs.config))
  } catch {
    return {}
  }
}

const renderMermaidToImageSrc = async (seq) => {
  await loadResource(
    `${options.value.cdnUrl}/libs/mermaid/mermaid.min.js`,
    'script',
    'mermaid-script',
  )
  const { mermaid } = window
  if (!mermaid) {
    return
  }
  mermaid.initialize({
    darkMode: false,
    startOnLoad: false,
    fontSize: 12,
    securityLevel: 'loose',
    ...getDiagramConfig(),
  })
  const renderId = `umo-mermaid-${shortId(10)}`
  const result = await mermaid.render(renderId, String(attrs.content))
  applyRenderedDiagram(typeof result === 'string' ? result : result?.svg, seq)
}

const renderDiagramToImageSrc = async () => {
  const type = attrs.type ? String(attrs.type) : ''
  if (
    !DIAGRAM_TYPES.has(type) ||
    !attrs.content ||
    !(!attrs.src || isDiagramPlaceholderSrc(attrs.src)) ||
    !options?.value?.cdnUrl
  ) {
    return
  }
  const seq = ++diagramRenderSeq
  try {
    if (type === 'mermaid') {
      await renderMermaidToImageSrc(seq)
    }
  } catch {}
}

const hydrateDefaultAltContent = () => {
  if (
    !nodeViewReady ||
    !canEditAlt ||
    hasRichAltContent ||
    defaultAltText === ''
  ) {
    return
  }
  const pos = getNodePos()
  if (typeof pos !== 'number') {
    return
  }
  const view = getEditorView()
  const state = getEditorState()
  if (!view || !state) {
    return
  }
  const tr = state.tr.insert(pos + 1, state.schema.text(defaultAltText))
  view.dispatch(tr)
}

const scheduleHydrateDefaultAltContent = async () => {
  if (!nodeViewReady) {
    return
  }
  await nextTick()
  hydrateDefaultAltContent()
}

const uploadImage = async () => {
  if (attrs.uploaded || !attrs.id || !uploadFileMap.value.has(attrs.id)) {
    updateNodeAttrsWithoutHistory({ uploaded: true })
    return
  }
  try {
    const file = uploadFileMap.value.get(attrs.id)
    const result = await options.value?.onFileUpload?.(file)
    const { id, url } = result
    if (containerRef.value) {
      updateNodeAttrsWithoutHistory({ id, src: url, uploaded: true })
    }
    uploadFileMap.value.delete(attrs.id)
  } catch (uploadError) {
    useMessage('error', {
      attach: container,
      content: uploadError.message,
    })
  }
}

const onLoad = async () => {
  if (!imageRef) {
    return
  }
  clampImageToContainer()
  await syncRenderedImageHeight()
}

const isAltTarget = (target) =>
  target instanceof HTMLElement && !!target.closest('.umo-node-image-alt')

const handleWrapperClick = (event) => {
  if (isAltTarget(event.target)) {
    return
  }
  editor.value?.commands.setNodeSelection(getNodePos())
}

const focusAltContent = (event) => {
  if (!canEditAlt || event.button !== 0) {
    return
  }
  const { target } = event
  if (!(target instanceof HTMLElement)) {
    return
  }
  if (target.closest('.umo-node-image-alt-content')) {
    return
  }
  const pos = getNodePos()
  if (typeof pos !== 'number') {
    return
  }
  props.editor
    .chain()
    .focus()
    .setTextSelection(pos + 1)
    .run()
}

const onRotate = ({ angle }) => {
  if (isLockedNode) {
    return
  }
  updateAttributes({ angle })
}

const onResize = ({ width, height }) => {
  if (isLockedNode) {
    return
  }
  const { nextMaxWidth } = syncContainerBounds()
  const currentWidth = Number(width)
  const currentHeight = Number(height)
  const nextWidth =
    nextMaxWidth > 0 ? Math.min(currentWidth, nextMaxWidth) : currentWidth
  const ratio =
    currentWidth > 0 && currentHeight > 0 ? currentWidth / currentHeight : 1
  const nextHeight =
    nextWidth !== currentWidth && ratio > 0 ? nextWidth / ratio : currentHeight
  updateAttributes({
    width: nextWidth.toFixed(2),
    height: nextHeight.toFixed(2),
  })
}

const onMousedown = (event) => {
  getHostElement()?.click()
  if (!attrs.draggable || isLockedNode) {
    return
  }
  const dragEl = getDragElement()
  const elRect = dragEl?.getBoundingClientRect()
  if (!elRect) {
    return
  }
  const downX = event.clientX
  const downY = event.clientY
  const mouseX = downX - elRect.left
  const mouseY = downY - elRect.top

  const onMousemove = (moveEvent) => {
    const left = moveEvent.clientX - mouseX
    const top = moveEvent.clientY - mouseY
    updateAttributes({ left, top })
  }
  const onMouseup = () => {
    document.removeEventListener('mousemove', onMousemove)
    document.removeEventListener('mouseup', onMouseup)
  }
  document.addEventListener('mousemove', onMousemove)
  document.addEventListener('mouseup', onMouseup)
}

const onDragEnd = () => {
  if (!attrs.draggable) {
    setTimeout(() => {
      const dragEl = getDragElement()
      if (!dragEl) {
        return
      }
      dragEl.style.left = 0
      dragEl.style.top = 0
    }, 100)
  }
}

onClickOutside(containerRef, () => {
  selected = false
})

const openImageViewer = async (event) => {
  if (isAltTarget(event?.target) || attrs.previewType === null) {
    return
  }
  if (attrs.id === null) {
    updateNodeAttrsWithoutHistory({ id: shortId(10) })
  }
  await nextTick()
  imageViewer.value.visible = true
  imageViewer.value.current = attrs.id
}

watch(
  () => [
    attrs.alt,
    attrs.title,
    attrs.name,
    attrs.showTitle,
    props.node.content.size,
    canEditAlt,
  ],
  () => {
    void scheduleHydrateDefaultAltContent()
  },
)

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
    syncContainerBounds()
    const width = imageRef?.offsetWidth
    const height = imageRef?.offsetHeight
    updateAttributes({ width, height })
    maxHeight = equalProportion ? maxWidth / (width / height) : 0
  },
)

watch(
  () => [attrs.type, attrs.content, attrs.config, attrs.src],
  () => {
    void renderDiagramToImageSrc()
  },
  { immediate: true },
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
    updateNodeAttrsWithoutHistory({
      error: err?.type ? err.type === 'error' : false,
    })
  },
)

onBeforeUnmount(() => {
  if (editor.value?.storage?.versionCompare?.isPreviewing) {
    return
  }
  setTimeout(() => {
    if (editor.value.isDestroyed) {
      return
    }
    options.value.onFileDelete(attrs.id, attrs.src, `image:${attrs.type}`)
  }, 500)
})

onMounted(async () => {
  await nextTick()
  nodeViewReady = true
  await scheduleHydrateDefaultAltContent()
  clampImageToContainer()
  await syncRenderedImageHeight()
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
  &.umo-node-focused,
  &.ProseMirror-selectednoderange {
    .umo-node-image-error:after {
      content: '';
      display: block !important;
      position: absolute;
      inset: 0;
      border-radius: var(--umo-radius);
      background: var(--umo-content-node-selected-background);
      pointer-events: none;
      z-index: -1;
    }
  }
  .umo-node-image {
    max-width: 100%;
    width: auto;
    position: relative;
    z-index: 20;
    display: flex;
    flex-direction: column;
    align-items: center;
    &.is-loading {
      outline: none !important;
      box-shadow: none !important;
    }
    &.is-error {
      width: 100%;
      box-shadow: none !important;
    }
    .es-drager {
      display: block;
      line-height: 0;
      &.is-alt-selected {
        outline: solid 1px var(--umo-primary-color);
      }
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
      max-height: 100%;
      width: 100%;
      &.not-equal-proportion {
        height: 100%;
      }
    }

    .umo-node-image-loading {
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

    .umo-node-image-error {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: #999;
      font-size: 12px;
      min-height: 120px;
      position: relative;

      .error-icon {
        font-size: 72px;
        margin: -8px 0 -2px;
      }
    }

    .umo-node-image-uploading {
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

  .umo-node-image-alt {
    width: 100%;
    max-width: 100%;
    margin-top: 8px;
    text-align: center;

    &-content,
    &-fallback {
      width: 100%;
      max-width: 100%;
      padding: 0;
      background: transparent;
      font-size: 13px;
      line-height: 1.6;
      text-align: center;
      color: var(--umo-text-color);
      white-space: pre-wrap;
      word-break: break-word;
    }

    &-content {
      min-height: 22px;
      outline: none;
      cursor: text;

      &.is-empty {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      &.is-empty::after {
        content: attr(data-placeholder);
        color: var(--umo-text-color-light);
        pointer-events: none;
      }

      .tiptap-invisible-character {
        display: none;
      }
    }

    &-fallback {
      color: var(--umo-text-color-light);
    }

    &.is-readonly &-content {
      cursor: default;
      pointer-events: none;
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
