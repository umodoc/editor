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
    @dragstart.prevent="onNativeDragstart"
  >
    <div
      ref="imageContainerRef"
      class="umo-node-container umo-node-image"
      :class="imageClass"
      :style="imageContainerStyle"
    >
      <div
        v-if="attrs.src && error"
        class="umo-node-image-error"
        :style="{ width: `${attrs.width}px`, height: `${attrs.height}px` }"
      >
        <icon name="image-failed" class="error-icon" />
        {{ t('node.image.error') }}
      </div>
      <div
        v-else
        class="umo-node-image-frame"
        :style="imageFrameStyle"
        @mousedown.capture="onDragPointerDown"
      >
        <drager
          class="umo-select-outline"
          :class="dragerClass"
          :style="dragerStyle"
          :selected="selected"
          :rotatable="!isCropping"
          :boundary="false"
          :disabled="
            isCropping || isReadonlyNode || !editor?.isEditable || isLockedNode
          "
          :angle="attrs.angle"
          :width="Number(attrs.width)"
          :height="Number(attrs.height)"
          :left="0"
          :top="0"
          :min-width="14"
          :min-height="14"
          :max-width="maxWidth"
          :max-height="maxHeight"
          :z-index="10"
          :equal-proportion="attrs.equalProportion"
          @rotate="onRotate"
          @resize="onResize"
          @focus="selected = true"
        >
          <div v-if="isImageLoading" class="umo-node-image-loading">
            <icon name="loading" class="loading-icon" />
            {{ t('node.image.loading') }}
          </div>
          <template v-if="isCropping">
            <div
              ref="cropperHostRef"
              class="umo-node-image-cropper umo-cropper-surface"
              :style="cropperStyle"
              @mousedown.capture="handleCropperMousedown"
              @dblclick.stop="handleCropperDblclick"
            >
              <img
                ref="cropperImageRef"
                class="umo-node-image-cropper-source"
                :src="attrs.src"
                :alt="attrs.alt || attrs.title || attrs.name || 'image'"
                draggable="false"
                crossorigin="anonymous"
              />
            </div>
          </template>
          <img
            v-else
            ref="imageRef"
            :src="attrs.src"
            draggable="false"
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
      </div>
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
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import Drager from 'es-drager'

import { safeNodePos, selectNodePos } from '@/utils/position'
import { ImageCropper } from '@/utils/image-cropper'
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

const DIAGRAM_TYPES = new Set(['mermaid', 'plantuml', 'flowchart'])

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
const imageContainerRef = ref(null)
const cropperHostRef = ref(null)
const imageRef = $ref(null)
const cropperImageRef = $ref(null)

let selected = $ref(false)
let maxWidth = $ref(0)
let maxHeight = $ref(0)
let nodeViewReady = $ref(false)
let isCropping = $ref(false)
let isLoading = $ref(false)
let error = $ref(false)
let diagramRenderSeq = 0
const cropper = new ImageCropper()
let cropInitialSelection = null
let stopClickOutside = null
let isCropTransactionListening = false
let isCropPointerActive = false
let imageLayoutFrameId = 0
let imageLayoutCommitFrameId = 0
let dragPreviewFrameId = 0

const isDataImageSrc = (src) => String(src || '').startsWith('data:image')
const isNodeSelected = $computed(() => !!props.selected)

const hasRichAltContent = $computed(() => props.node.content.size > 0)
const isPreviewMode = $computed(() => !!page.value.preview?.enabled)
const isReadonlyNode = $computed(
  () =>
    !!options.value.document?.readOnly ||
    isPreviewMode ||
    editor.value?.isEditable !== true,
)
const isReadonlyAlt = $computed(() => isReadonlyNode)
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
    !isReadonlyNode &&
    !error,
)
const canMoveImageNode = $computed(
  () => attrs.draggable && !isCropping && !isLockedNode && !isReadonlyNode,
)
const imageWrapperMargins = $computed(() => {
  if (attrs.inline || attrs.draggable) {
    return {}
  }
  if (attrs.nodeAlign === 'flex-end') {
    return {
      marginLeft: 'auto',
      marginRight: 0,
    }
  }
  if (attrs.nodeAlign === 'center') {
    return {
      marginLeft: 'auto',
      marginRight: 'auto',
    }
  }
  return {
    marginLeft: 0,
    marginRight: 'auto',
  }
})
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
  'is-draggable': attrs.draggable,
  'is-loading': isImageLoading,
  'is-error': attrs.src && error,
  'is-cropping': isCropping,
}))
const dragerClass = $computed(() => ({
  'is-draggable': attrs.draggable,
  'is-cropping': isCropping,
  'umo-hover-shadow': !isReadonlyNode,
  'umo-select-outline': !attrs.draggable && attrs.src && !error,
  'is-alt-selected': selected && !attrs.draggable && attrs.src && !error,
}))
const dragerStyle = $computed(() => ({
  cursor: isCropping
    ? 'default !important'
    : canMoveImageNode
      ? 'inherit'
      : 'default !important',
}))
const imageFrameStyle = $computed(() => ({
  cursor: canMoveImageNode ? 'move' : 'default',
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
    position: attrs.draggable ? 'relative' : undefined,
    width: attrs.draggable ? '100%' : undefined,
    zIndex: attrs.draggable ? (selected ? 100 : 95) : undefined,
    ...imageWrapperMargins,
    marginTop,
    marginBottom,
  }
})
const imageContainerStyle = $computed(() => ({
  width:
    attrs.draggable && !attrs.inline
      ? `${Math.max(Number(attrs.width) || 0, 14)}px`
      : undefined,
  maxWidth: attrs.draggable ? 'none' : '100%',
  position: attrs.draggable ? 'absolute' : 'relative',
  left: attrs.draggable ? `${Number(attrs.left) || 0}px` : undefined,
  top: attrs.draggable ? `${Number(attrs.top) || 0}px` : undefined,
}))

const getHostElement = () => containerRef.value?.$el
const getImageContainerElement = () => imageContainerRef.value
const getNodePos = () => safeNodePos(getPos, editor.value?.state)
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

const getCropperSelection = () => cropper.getSelection()

const getCropExportSize = (selection) => {
  return cropper.getExportSize(selection, {
    fallbackWidth: Number(attrs.width) || 0,
    fallbackHeight: Number(attrs.height) || 0,
    fallbackImage: imageRef,
  })
}

const getCropSelectionSnapshot = (selection) =>
  cropper.getSelectionSnapshot(selection)

const syncCropperState = (activePos = null) => {
  if (!editor.value?.storage?.image?.cropper) {
    return
  }
  editor.value.storage.image.cropper.activePos = activePos
  editor.value.commands.setMeta('imageCropState', { activePos })
}

const isCropSelectionChanged = (selection) => {
  return cropper.isSelectionChanged(cropInitialSelection, selection)
}

const destroyCropper = () => {
  cropper.destroy()
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
  cropper.start({
    image: cropperImageRef,
    container: cropperHostRef.value,
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
    const canvas = await cropper.exportSelection(selection, { width, height })
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

const getElementWidth = (element) =>
  Math.max(
    0,
    element?.clientWidth || element?.getBoundingClientRect?.().width || 0,
  )

const getContainerMaxWidth = () => {
  const hostEl = getHostElement()
  if (attrs.draggable && !attrs.inline) {
    const currentWidth = Math.max(Number(attrs.width) || 0, 14)
    const parentWidth = getElementWidth(hostEl?.parentElement)
    return Math.max(currentWidth, parentWidth, 14)
  }
  return Math.max(14, getElementWidth(hostEl))
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
  if (nextMaxWidth <= 14) {
    scheduleImageLayoutSync()
    return false
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

const stopScheduledImageLayoutSync = () => {
  if (imageLayoutFrameId) {
    window.cancelAnimationFrame(imageLayoutFrameId)
    imageLayoutFrameId = 0
  }
  if (imageLayoutCommitFrameId) {
    window.cancelAnimationFrame(imageLayoutCommitFrameId)
    imageLayoutCommitFrameId = 0
  }
}

const scheduleImageLayoutSync = () => {
  if (typeof window === 'undefined') {
    return
  }
  stopScheduledImageLayoutSync()
  imageLayoutFrameId = window.requestAnimationFrame(() => {
    imageLayoutFrameId = 0
    imageLayoutCommitFrameId = window.requestAnimationFrame(() => {
      imageLayoutCommitFrameId = 0
      void syncLoadedImageLayout()
    })
  })
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

const renderPlantumlToImageSrc = async (seq) => {
  const serverURL = options.value?.plantUml?.serverURL
  if (!serverURL) {
    return
  }
  await loadResource(
    `${options.value.cdnUrl}/libs/plantuml/plantuml-encoder.min.js`,
    'script',
    'plantuml-encoder-script',
  )
  const encoder = window.plantumlEncoder
  if (!encoder?.encode) {
    return
  }
  const encoded = encoder.encode(String(attrs.content))
  const response = await fetch(`${serverURL}/svg/${encoded}`)
  if (!response.ok) {
    return
  }
  applyRenderedDiagram(await response.text(), seq)
}

const getFlowchartNodeConfig = (value, fallback) => {
  try {
    return {
      ...fallback,
      ...JSON.parse(value ?? {}),
    }
  } catch {
    return fallback
  }
}

const renderFlowchartToImageSrc = async (seq) => {
  await loadResource(
    `${options.value.cdnUrl}/libs/flowchart/raphael.min.js`,
    'script',
    'flowchart-raphael-script',
  )
  await loadResource(
    `${options.value.cdnUrl}/libs/flowchart/flowchart.js`,
    'script',
    'flowchart-script',
  )
  const { flowchart } = window
  if (!flowchart?.parse) {
    return
  }
  const { data, config } = normalizeFlowchartContent(attrs.content)
  const flowchartConfig = initFlowchartBaseConfig(config)
  const startNode = getFlowchartNodeConfig(flowchartConfig.startNode, {
    'font-color': '#000000',
    fill: '#ADD8E6',
    stroke: '#ADD8E6',
  })
  const endNode = getFlowchartNodeConfig(
    flowchartConfig.endNode ?? flowchartConfig.end,
    {
      'font-color': '#000000',
      fill: '#ADD8E6',
      stroke: '#ADD8E6',
    },
  )

  const el = document.createElement('div')
  el.style.position = 'fixed'
  el.style.left = '-100000px'
  el.style.top = '0'
  el.style.width = '10000px'
  el.style.height = '10000px'
  el.style.overflow = 'hidden'
  el.style.pointerEvents = 'none'
  el.style.visibility = 'hidden'
  document.body.appendChild(el)

  try {
    const instance = flowchart.parse(String(data || ''))
    instance.drawSVG(el, {
      x: 10,
      y: 10,
      'line-width': flowchartConfig.lineWidth || 1,
      'line-length': flowchartConfig.lineLength || 60,
      'line-radius': 5,
      'text-margin': 10,
      'font-size': flowchartConfig.fontSize || 14,
      'font-color': flowchartConfig.fontColor || '#333333',
      font: 'Arial',
      'yes-text': flowchartConfig.yesText || 'Yes',
      'no-text': flowchartConfig.noText || 'No',
      'arrow-end': 'block',
      scale: 1,
      symbols: {
        start: startNode,
        end: endNode,
      },
      flowstate: {
        past: { fill: '#CCCCCC', 'font-color': '#666666' },
        current: { fill: '#FFFF99', 'font-color': '#000000' },
        future: { fill: '#ADD8E6' },
      },
    })
    const svgEl = el.querySelector('svg')
    applyRenderedDiagram(
      svgEl ? new XMLSerializer().serializeToString(svgEl) : null,
      seq,
    )
  } finally {
    document.body.removeChild(el)
  }
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
      return
    }
    if (type === 'plantuml') {
      await renderPlantumlToImageSrc(seq)
      return
    }
    if (type === 'flowchart') {
      await renderFlowchartToImageSrc(seq)
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
  editor.value?.commands.focus(undefined, { scrollIntoView: false })
  selectNodePos(editor.value, getPos)
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
  if (isLockedNode || isCropping || isReadonlyNode) {
    return
  }
  updateAttributes({ angle })
}

const onResize = ({ width, height }) => {
  if (isLockedNode || isCropping || isReadonlyNode) {
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

const onNativeDragstart = (event) => {
  if (isCropping) {
    return
  }
  event.preventDefault()
}

const isDragerHandleTarget = (target) =>
  target instanceof HTMLElement &&
  !!target.closest('.es-drager-dot, .es-drager-rotate')

const onDragPointerDown = (event) => {
  if (isDragerHandleTarget(event.target)) {
    return
  }
  ensureInitialImageAttrsOnInteraction()
  setImageNodeSelection()
  selected = true
  event.stopPropagation()
  if (!canMoveImageNode) {
    return
  }
  const downX = event.clientX
  const downY = event.clientY
  const startLeft = Number(attrs.left) || 0
  const startTop = Number(attrs.top) || 0
  let lastPosition = null
  let pendingPosition = null
  let dragging = false

  const onMousemove = (moveEvent) => {
    const deltaX = moveEvent.clientX - downX
    const deltaY = moveEvent.clientY - downY
    if (!dragging) {
      if (Math.abs(deltaX) < 3 && Math.abs(deltaY) < 3) {
        return
      }
      dragging = true
    }
    moveEvent.preventDefault()
    const left = startLeft + deltaX
    const top = startTop + deltaY
    lastPosition = {
      left: Number(left.toFixed(2)),
      top: Number(top.toFixed(2)),
    }
    pendingPosition = lastPosition
    if (dragPreviewFrameId) {
      return
    }
    dragPreviewFrameId = requestAnimationFrame(() => {
      dragPreviewFrameId = 0
      const imageContainerElement = getImageContainerElement()
      if (!imageContainerElement || !pendingPosition) {
        return
      }
      imageContainerElement.style.left = `${pendingPosition.left}px`
      imageContainerElement.style.top = `${pendingPosition.top}px`
    })
  }
  const onMouseup = () => {
    document.removeEventListener('mousemove', onMousemove)
    document.removeEventListener('mouseup', onMouseup)
    if (dragPreviewFrameId) {
      cancelAnimationFrame(dragPreviewFrameId)
      dragPreviewFrameId = 0
    }
    if (!dragging || !lastPosition) {
      return
    }
    updateAttributes(lastPosition)
  }
  document.addEventListener('mousemove', onMousemove)
  document.addEventListener('mouseup', onMouseup)
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
  if (dragPreviewFrameId) {
    cancelAnimationFrame(dragPreviewFrameId)
    dragPreviewFrameId = 0
  }
  setCropTransactionListening(false)
  stopOutsideHandler()
  stopCropPointerTracking()
  stopScheduledImageLayoutSync()
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
  scheduleImageLayoutSync()
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
    display: flex;
    flex-direction: column;
    align-items: center;
    caret-color: transparent;
    &.is-draggable {
      align-items: flex-start;
      max-width: none;
    }
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
      position: relative;
      max-width: 100%;
      max-height: 100%;
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
      display: block;
      position: relative;
      max-width: 100%;
      max-height: 100%;
      background: transparent;
      overflow: hidden;

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
