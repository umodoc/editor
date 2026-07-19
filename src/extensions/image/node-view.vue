<template>
  <node-view-wrapper
    ref="containerRef"
    as="figure"
    class="umo-node-view"
    :class="wrapperClass"
    :style="nodeStyle"
    data-type="image"
    @dblclick="openImageViewer"
    @click.capture="wrapperClick"
  >
    <div class="umo-node-container umo-node-image" :class="imageClass">
      <div
        v-if="attrs.src && error"
        class="umo-node-image-error"
        :style="{ width: `${attrs.width}px`, height: `${attrs.height}px` }"
      >
        <icon name="image-failed" class="error-icon" />
        {{ t('node.image.error') }}
      </div>
      <drager
        v-else
        ref="dragRef"
        class="umo-select-outline"
        :class="dragerClass"
        :style="dragerStyle"
        :selected="selected"
        :rotatable="!isCropping"
        :boundary="false"
        :disabled="isCropping || !editor?.isEditable || isLockedNode"
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
        <div v-if="isImageLoading" class="umo-node-image-loading">
          <icon name="loading" class="loading-icon" />
          {{ t('node.image.loading') }}
        </div>
        <template v-if="isCropping">
          <div
            ref="cropperHostRef"
            class="umo-node-image-cropper"
            :style="cropperStyle"
            @mousedown.capture="handleCropperMousedown"
            @dblclick.stop="handleCropperDblclick"
          >
            <img
              ref="cropperImageRef"
              class="umo-node-image-cropper-source"
              :src="attrs.src"
              :alt="attrs.alt || attrs.title || attrs.name || 'image'"
              crossorigin="anonymous"
            />
          </div>
        </template>
        <img
          v-else
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
          crossorigin="anonymous"
          loading="lazy"
          @load="onLoad"
          @error="onError"
        />
        <div
          v-if="!attrs.uploaded && attrs.file !== null"
          class="umo-node-image-uploading"
        >
          <span></span>
        </div>
      </drager>
      <node-view-content
        v-show="showAlt"
        as="figcaption"
        class="umo-node-image-alt umo-node-image-alt-content"
        :class="[altContainerClass, { 'is-empty': isAltEmpty }]"
        :data-placeholder="altPlaceholder"
        :data-empty="isAltEmpty ? '' : null"
        @focusin="altFocusIn"
        @focusout="altFocusOut"
      />
    </div>
  </node-view-wrapper>
</template>

<script setup>
import Cropper from 'cropperjs'
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import Drager from 'es-drager'

import { loadResource } from '@/utils/load-resource'
import { shortId } from '@/utils/short-id'
import {
  dataURLToFile,
  imageNodeTypes,
  scheduleFileDelete,
  srcAttrs,
  svgToDataURL,
} from '@/utils/file'

import { updateAttributesWithoutHistory } from '../file'

const DIAGRAM_TYPES = new Set(['mermaid'])
const CROPPER_TEMPLATE = `
  <cropper-canvas>
    <cropper-image></cropper-image>
    <cropper-shade hidden></cropper-shade>
    <cropper-handle action="select" plain></cropper-handle>
    <cropper-selection initial-coverage="1" movable resizable outlined>
      <cropper-handle action="move" theme-color="rgba(255, 255, 255, 0.35)"></cropper-handle>
      <cropper-handle action="n-resize"></cropper-handle>
      <cropper-handle action="e-resize"></cropper-handle>
      <cropper-handle action="s-resize"></cropper-handle>
      <cropper-handle action="w-resize"></cropper-handle>
      <cropper-handle action="ne-resize"></cropper-handle>
      <cropper-handle action="nw-resize"></cropper-handle>
      <cropper-handle action="se-resize"></cropper-handle>
      <cropper-handle action="sw-resize"></cropper-handle>
    </cropper-selection>
  </cropper-canvas>
`

const uploadingImageIds = new Set()

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

const containerRef = ref(null)
const cropperHostRef = ref(null)
const imageRef = $ref(null)
const cropperImageRef = $ref(null)
const dragRef = $ref(null)

let selected = $ref(false)
let maxWidth = $ref(0)
let maxHeight = $ref(0)
let nodeViewReady = $ref(false)
let isCropping = $ref(false)
let isLoading = $ref(false)
let error = $ref(false)
let diagramRenderSeq = 0
let cropper = null
let cropInitialSelection = null
let stopClickOutside = null
let isCropTransactionListening = false
let isCropPointerActive = false

const isDataImageSrc = (src) => String(src || '').startsWith('data:image')
const isNodeSelected = $computed(() => !!props.selected)

const hasRichAltContent = $computed(() => props.node.content.size > 0)
const isPreviewMode = $computed(() => !!page.value.preview?.enabled)
const isReadonlyAlt = $computed(
  () => !!options.value.document?.readOnly || isPreviewMode,
)
const canEditAlt = $computed(() => !isReadonlyAlt && !isLockedNode)
const isAltEmpty = $computed(
  () =>
    String(props.node.textContent || '')
      .replaceAll('\u200b', '')
      .trim() === '',
)
const canCropImage = $computed(
  () =>
    !attrs.inline &&
    attrs.type?.startsWith?.('image') &&
    !!attrs.src &&
    !isLockedNode &&
    editor.value?.isEditable !== false &&
    !error,
)
const altPlaceholder = $computed(() => t('node.image.altPlaceholder'))
const showAlt = $computed(
  () =>
    !attrs.inline &&
    attrs.showTitle !== false &&
    (!isReadonlyAlt || hasRichAltContent),
)
const isImageLoading = $computed(() => !!attrs.src && isLoading)
const shouldHandleOutside = $computed(
  () => isNodeSelected || selected || isCropping,
)
const shouldListenCropTransactions = $computed(
  () => isNodeSelected || isCropping,
)

const wrapperClass = $computed(() => ({
  'umo-floating-node': attrs.draggable,
  'is-inline-image': attrs.inline,
}))
const imageClass = $computed(() => ({
  'is-loading': isImageLoading,
  'is-error': attrs.src && error,
  'is-cropping': isCropping,
}))
const dragerClass = $computed(() => ({
  'is-draggable': attrs.draggable,
  'is-cropping': isCropping,
  'umo-hover-shadow': !options.value.document?.readOnly,
  'umo-select-outline': !attrs.draggable && attrs.src && !error,
  'is-alt-selected': selected && !attrs.draggable && attrs.src && !error,
}))
const dragerStyle = $computed(() => ({
  cursor: isCropping
    ? 'default !important'
    : attrs.draggable && !options.value.document?.readOnly && !isLockedNode
      ? 'move'
      : 'default !important',
}))
const cropperStyle = $computed(() => ({
  width: `${Math.max(Number(attrs.width) || 0, 14)}px`,
  height: `${Math.max(Number(attrs.height) || 0, 14)}px`,
}))
const altContainerClass = $computed(() => ({
  'is-readonly': !canEditAlt,
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
const getAltContentElement = () =>
  getHostElement()?.querySelector('.umo-node-image-alt-content')
const isAltContentFocused = () => {
  const altContentElement = getAltContentElement()
  const { activeElement } = document
  return !!(
    altContentElement &&
    activeElement &&
    (activeElement === altContentElement ||
      altContentElement.contains(activeElement))
  )
}

const updateNodeAttrsWithoutHistory = (nextAttrs) => {
  updateAttributesWithoutHistory(editor.value, nextAttrs, getNodePos())
}

const ensureInitialImageAttrs = () => {
  if (attrs.initialAttrs) {
    return
  }
  const snapshot = { ...attrs }
  delete snapshot.initialAttrs
  updateNodeAttrsWithoutHistory({
    initialAttrs: JSON.stringify(snapshot),
  })
}

const ensureInitialImageAttrsOnInteraction = () => {
  if (!attrs.initialAttrs) {
    ensureInitialImageAttrs()
  }
}

const setNodeErrorState = (nextError) => {
  const normalizedError = !!nextError
  error = normalizedError
  if (!!attrs.error !== normalizedError) {
    updateNodeAttrsWithoutHistory({ error: normalizedError })
  }
}

const syncImageStateFromSrc = (src) => {
  setNodeErrorState(false)
  isLoading = !!src && !isDataImageSrc(src)
}

const stopOutsideHandler = () => {
  stopClickOutside?.()
  stopClickOutside = null
}

const ensureOutsideHandler = () => {
  if (stopClickOutside) {
    return
  }
  stopClickOutside = onClickOutside(containerRef, async (event) => {
    if (event.target?.closest?.('.umo-editor-bubble-menu')) {
      return
    }
    if (isCropping) {
      if (isCropPointerActive) {
        return
      }
      exitCropping()
    }
    selected = false
  })
}

const setCropTransactionListening = (enabled) => {
  if (enabled === isCropTransactionListening) {
    return
  }
  editor.value?.[enabled ? 'on' : 'off']?.(
    'transaction',
    handleImageCropTransaction,
  )
  isCropTransactionListening = enabled
}

const getCropperSelection = () => cropper?.getCropperSelection?.() || null

const getCropExportSize = (selection) => {
  const renderedWidth =
    cropperImageRef?.getBoundingClientRect?.().width ||
    cropperImageRef?.clientWidth ||
    Number(attrs.width) ||
    0
  const renderedHeight =
    cropperImageRef?.getBoundingClientRect?.().height ||
    cropperImageRef?.clientHeight ||
    Number(attrs.height) ||
    0
  const naturalWidth = Number(
    cropperImageRef?.naturalWidth || imageRef?.naturalWidth || renderedWidth,
  )
  const naturalHeight = Number(
    cropperImageRef?.naturalHeight || imageRef?.naturalHeight || renderedHeight,
  )
  const scaleX =
    renderedWidth > 0 && naturalWidth > 0 ? naturalWidth / renderedWidth : 1
  const scaleY =
    renderedHeight > 0 && naturalHeight > 0 ? naturalHeight / renderedHeight : 1

  return {
    width: Math.max(1, Math.round(Number(selection.width || 0) * scaleX)),
    height: Math.max(1, Math.round(Number(selection.height || 0) * scaleY)),
  }
}

const getCropSelectionSnapshot = (selection) => {
  if (!selection) {
    return null
  }
  return {
    x: Number(selection.x || 0),
    y: Number(selection.y || 0),
    width: Number(selection.width || 0),
    height: Number(selection.height || 0),
  }
}

const syncCropperState = (activePos = null) => {
  if (!editor.value?.storage?.image?.cropper) {
    return
  }
  editor.value.storage.image.cropper.activePos = activePos
  editor.value.commands.setMeta('imageCropState', { activePos })
}

const isCropSelectionChanged = (selection) => {
  const current = getCropSelectionSnapshot(selection)
  if (!current || !cropInitialSelection) {
    return false
  }
  return (
    Math.abs(current.x - cropInitialSelection.x) > 0.5 ||
    Math.abs(current.y - cropInitialSelection.y) > 0.5 ||
    Math.abs(current.width - cropInitialSelection.width) > 0.5 ||
    Math.abs(current.height - cropInitialSelection.height) > 0.5
  )
}

const destroyCropper = () => {
  cropper?.destroy?.()
  cropper = null
  cropInitialSelection = null
}

const exitCropping = () => {
  isCropPointerActive = false
  destroyCropper()
  isCropping = false
  syncCropperState(null)
}

const startCropping = async () => {
  if (isCropping || !canCropImage) {
    return
  }
  selected = true
  isCropping = true
  await nextTick()
  if (!cropperImageRef || !cropperHostRef.value) {
    exitCropping()
    return
  }
  cropper = new Cropper(cropperImageRef, {
    container: cropperHostRef.value,
    template: CROPPER_TEMPLATE,
  })
  await nextTick()
  cropInitialSelection = getCropSelectionSnapshot(getCropperSelection())
  syncCropperState(getNodePos())
}

const applyCrop = async () => {
  if (!isCropping) {
    return
  }
  const selection = getCropperSelection()
  if (!selection || !isCropSelectionChanged(selection)) {
    exitCropping()
    return
  }
  try {
    const { width, height } = getCropExportSize(selection)
    const canvas = await selection.$toCanvas({ width, height })
    const dataUrl = canvas.toDataURL('image/png')
    updateAttributes({
      id: shortId(10),
      src: dataUrl,
      width: Number(selection.width.toFixed(2)),
      height: Number(selection.height.toFixed(2)),
      uploaded: false,
    })
  } catch (cropError) {
    useMessage('error', {
      attach: container,
      content: cropError?.message || t('bubbleMenu.image.cropFailed'),
    })
  } finally {
    exitCropping()
  }
}

const stopCropPointerTracking = () => {
  isCropPointerActive = false
  document.removeEventListener('mouseup', stopCropPointerTracking, true)
}

const handleCropperMousedown = () => {
  if (!isCropping) {
    return
  }
  selected = true
  isCropPointerActive = true
  setImageNodeSelection()
  document.removeEventListener('mouseup', stopCropPointerTracking, true)
  document.addEventListener('mouseup', stopCropPointerTracking, true)
}

const handleCropperDblclick = async () => {
  await applyCrop()
}

const isCurrentImageNodeSelected = () => {
  const pos = getNodePos()
  const selection = editor.value?.state?.selection
  return !!(
    typeof pos === 'number' &&
    selection?.node?.type?.name === 'image' &&
    selection.from === pos
  )
}

const handleImageCropTransaction = async ({ transaction }) => {
  const cropAction = transaction.getMeta('imageCrop')
  if (cropAction?.pos === getNodePos()) {
    if (cropAction.action === 'toggle') {
      if (isCropping) {
        exitCropping()
      } else {
        await startCropping()
      }
    }
    return
  }
  if (isCropping && transaction.selectionSet && !isCurrentImageNodeSelected()) {
    if (isCropPointerActive) {
      return
    }
    exitCropping()
  }
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

const syncRenderedImageHeight = () => {
  const renderedHeight = Number(
    (
      imageRef?.clientHeight ||
      imageRef?.getBoundingClientRect?.().height ||
      0
    )?.toFixed?.(2),
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
    return false
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
  return true
}

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
    !!attrs.src ||
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

const uploadImage = async () => {
  if (attrs.uploaded || !attrs.id || !uploadFileMap.value.has(attrs.id)) {
    updateNodeAttrsWithoutHistory({ uploaded: true })
    return
  }
  const currentUploadId = attrs.id
  if (uploadingImageIds.has(currentUploadId)) {
    return
  }
  uploadingImageIds.add(currentUploadId)
  try {
    const file = uploadFileMap.value.get(currentUploadId)
    const result = await options.value?.onFileUpload?.(file)
    const { id, url } = result
    if (containerRef.value) {
      updateNodeAttrsWithoutHistory({ id, src: url, uploaded: true })
    }
    uploadFileMap.value.delete(currentUploadId)
  } catch (uploadError) {
    useMessage('error', {
      attach: container,
      content: uploadError.message,
    })
  } finally {
    uploadingImageIds.delete(currentUploadId)
  }
}

const onLoad = async () => {
  if (!imageRef) {
    return
  }
  isLoading = false
  setNodeErrorState(false)
  await nextTick()
  const didClamp = clampImageToContainer()
  if (!didClamp) {
    syncRenderedImageHeight()
  }
}

const onError = () => {
  isLoading = false
  setNodeErrorState(true)
}

const syncLoadedImageLayout = async () => {
  if (!imageRef?.complete || Number(imageRef.naturalWidth || 0) <= 0) {
    return
  }
  await onLoad()
}

const isAltTarget = (target) =>
  target instanceof HTMLElement && !!target.closest('.umo-node-image-alt')

const setImageNodeSelection = () => {
  const pos = getNodePos()
  if (typeof pos !== 'number') {
    return
  }
  editor.value?.commands.setNodeSelection(pos)
}

const wrapperClick = (event) => {
  if (isCropping) {
    return
  }
  if (isAltTarget(event.target)) {
    return
  }
  ensureInitialImageAttrsOnInteraction()
  setImageNodeSelection()
}

const altFocusIn = () => {
  selected = true
  ensureInitialImageAttrsOnInteraction()
}

const altFocusOut = () => {
  if (!isCropping && !isNodeSelected) {
    selected = false
  }
}

const onRotate = ({ angle }) => {
  if (isLockedNode || isCropping) {
    return
  }
  updateAttributes({ angle })
}

const onResize = ({ width, height }) => {
  if (isLockedNode || isCropping) {
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
  if (isCropping || !attrs.draggable || isLockedNode) {
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

const openImageViewer = async (event) => {
  if (isCropping || isAltTarget(event?.target) || attrs.previewType === null) {
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
  () => isNodeSelected,
  (nodeSelected) => {
    if (nodeSelected) {
      selected = true
      ensureInitialImageAttrsOnInteraction()
      return
    }
    if (!selected && !isCropping) {
      return
    }
    if (!isAltContentFocused() && !isCropping) {
      selected = false
    }
  },
  { immediate: true },
)

watch(
  () => shouldHandleOutside,
  (enabled) => {
    if (enabled) {
      ensureOutsideHandler()
      return
    }
    stopOutsideHandler()
  },
  { immediate: true },
)

watch(
  () => shouldListenCropTransactions,
  (enabled) => {
    setCropTransactionListening(enabled)
  },
  { immediate: true },
)

watch(
  () => canCropImage,
  async (enabled) => {
    if (!enabled && isCropping) {
      exitCropping()
    }
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
    if (!imageRef) {
      return
    }
    await nextTick()
    syncContainerBounds()
    const width = imageRef?.offsetWidth
    const height = imageRef?.offsetHeight
    if (
      Math.abs((Number(attrs.width) || 0) - Number(width || 0)) > 0.5 ||
      Math.abs((Number(attrs.height) || 0) - Number(height || 0)) > 0.5
    ) {
      updateAttributes({ width, height })
    }
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

const syncUploadStateFromSrc = async (src) => {
  if (!nodeViewReady || attrs.uploaded !== false || error) {
    return
  }
  if (src?.startsWith('data:image')) {
    const id = attrs.id || shortId(10)
    if (uploadFileMap.value.has(id) || uploadingImageIds.has(id)) {
      return
    }
    const name = `${attrs.type}-${id}`
    const { file, filename } = dataURLToFile(src, name)
    uploadFileMap.value.set(id, file)
    updateNodeAttrsWithoutHistory({
      id,
      size: file.size,
      name: filename,
      uploaded: false,
    })
  }
  await nextTick()
  uploadImage()
}

watch(
  () => attrs.src,
  async (src) => {
    if (!nodeViewReady) {
      return
    }
    syncImageStateFromSrc(src)
    if (isCropping) {
      exitCropping()
    }
    await syncUploadStateFromSrc(src)
    await nextTick()
    await syncLoadedImageLayout()
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  setCropTransactionListening(false)
  stopOutsideHandler()
  stopCropPointerTracking()
  exitCropping()
  scheduleFileDelete({
    editor,
    options,
    fileNode: {
      id: attrs.id,
      src: attrs.src,
      type: attrs.type,
      position: getNodePos(),
    },
    nodeTypes: imageNodeTypes,
    matchSourceAttrs: srcAttrs,
  })
})

onMounted(async () => {
  await nextTick()
  nodeViewReady = true
  syncImageStateFromSrc(attrs.src)
  await syncUploadStateFromSrc(attrs.src)
  await syncLoadedImageLayout()
})
</script>

<style lang="less">
.umo-node-view {
  margin: 0;

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
    caret-color: transparent;
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
      &.is-cropping {
        outline: solid 1px var(--umo-primary-color);
      }
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

    .umo-node-image-cropper {
      @crop-mask-color: rgba(0, 0, 0, 0.5);
      @crop-handle-color: var(--umo-color-black);
      @crop-edge-thickness: 2px;
      @crop-edge-offset: 2px;
      @crop-corner-size: 18px;
      @crop-corner-line-length: 12px;
      @crop-corner-line-offset: 6px;
      @crop-corner-offset: 2px;

      display: block;
      position: relative;
      max-width: 100%;
      max-height: 100%;
      background: transparent;
      overflow: hidden;

      cropper-canvas {
        width: 100%;
        height: 100%;
        min-width: 0;
        min-height: 0;
        background: transparent;
        background-image: none !important;
      }

      cropper-shade {
        display: none;
      }

      cropper-grid,
      cropper-crosshair,
      cropper-handle[action='select'] {
        display: none;
      }

      cropper-selection {
        box-sizing: border-box;
        background: transparent;
        box-shadow: 0 0 0 999px @crop-mask-color;
        cursor: move;
      }

      cropper-handle[action='move'] {
        inset: 0;
        border: 0;
        background: transparent;
        z-index: 1;
      }

      cropper-handle[action='n-resize'],
      cropper-handle[action='s-resize'] {
        width: 18px;
        height: 12px;
        z-index: 2;

        &::after {
          width: 100%;
          height: @crop-edge-thickness;
          background: @crop-handle-color;
        }
      }

      cropper-handle[action='n-resize'] {
        margin-top: @crop-edge-offset + 1px;
      }

      cropper-handle[action='s-resize'] {
        margin-bottom: @crop-edge-offset + 1px;
      }

      cropper-handle[action='e-resize'],
      cropper-handle[action='w-resize'] {
        width: 12px;
        height: 18px;
        z-index: 2;

        &::after {
          height: 100%;
          width: @crop-edge-thickness;
          background: @crop-handle-color;
        }
      }

      cropper-handle[action='e-resize'] {
        margin-right: @crop-edge-offset + 1px;
      }

      cropper-handle[action='w-resize'] {
        margin-left: @crop-edge-offset + 1px;
      }

      cropper-handle[action='ne-resize'],
      cropper-handle[action='nw-resize'],
      cropper-handle[action='se-resize'],
      cropper-handle[action='sw-resize'] {
        width: @crop-corner-size;
        height: @crop-corner-size;
        z-index: 2;

        &::before,
        &::after {
          position: absolute;
          display: block;
          content: '';
          background: @crop-handle-color;
          transform: unset;
        }
      }

      cropper-handle[action='ne-resize']::before,
      cropper-handle[action='nw-resize']::before,
      cropper-handle[action='se-resize']::before,
      cropper-handle[action='sw-resize']::before {
        width: @crop-corner-line-length;
        height: @crop-edge-thickness;
      }

      cropper-handle[action='ne-resize']::after,
      cropper-handle[action='nw-resize']::after,
      cropper-handle[action='se-resize']::after,
      cropper-handle[action='sw-resize']::after {
        width: @crop-edge-thickness;
        height: @crop-corner-line-length;
      }

      cropper-handle[action='ne-resize'] {
        margin-top: @crop-corner-offset;
        margin-right: @crop-corner-offset;

        &::before {
          top: @crop-corner-line-offset;
          right: @crop-corner-line-offset;
        }

        &::after {
          top: @crop-corner-line-offset;
          right: @crop-corner-line-offset;
          left: unset;
        }
      }

      cropper-handle[action='nw-resize'] {
        margin-top: @crop-corner-offset;
        margin-left: @crop-corner-offset;

        &::before {
          top: @crop-corner-line-offset;
          left: @crop-corner-line-offset;
        }

        &::after {
          top: @crop-corner-line-offset;
          left: @crop-corner-line-offset;
        }
      }

      cropper-handle[action='se-resize'] {
        margin-bottom: @crop-corner-offset;
        margin-right: @crop-corner-offset;

        &::before {
          right: @crop-corner-line-offset;
          bottom: @crop-corner-line-offset;
        }

        &::after {
          right: @crop-corner-line-offset;
          bottom: @crop-corner-line-offset;
          top: unset;
          left: unset;
        }
      }

      cropper-handle[action='sw-resize'] {
        margin-bottom: @crop-corner-offset;
        margin-left: @crop-corner-offset;

        &::before {
          bottom: @crop-corner-line-offset;
          left: @crop-corner-line-offset;
        }

        &::after {
          bottom: @crop-corner-line-offset;
          left: @crop-corner-line-offset;
          top: unset;
        }
      }

      &-source {
        display: block;
        width: 100%;
        height: 100%;
        max-width: none;
        max-height: none;
        object-fit: fill;
      }
    }

    .umo-node-image-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      inset: 0;
      z-index: 3;
      color: #999;
      font-size: 12px;
      gap: 10px;
      background: rgba(255, 255, 255, 0.78);
      pointer-events: none;

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
    @alt-font-size: 13px;
    @alt-line-height: 1.6;
    @alt-min-height: 22px;

    width: 100%;
    max-width: 100%;
    margin-top: 8px;
    text-align: center;

    &-content {
      width: 100%;
      max-width: 100%;
      min-height: @alt-min-height;
      padding: 0;
      background: transparent;
      font-size: @alt-font-size;
      line-height: @alt-line-height;
      text-align: center;
      color: var(--umo-text-color);
      white-space: pre-wrap;
      word-break: break-word;
      caret-color: var(--umo-text-color);
      outline: none;
      cursor: text;

      &.is-empty {
        display: flex;
        align-items: center;
        justify-content: center;

        &::after {
          content: attr(data-placeholder);
          color: var(--umo-text-color-light);
          pointer-events: none;
        }
      }

      .tiptap-invisible-character {
        display: none;
      }
    }

    &.is-readonly {
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
