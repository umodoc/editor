<template>
  <modal
    :visible="visible"
    width="640px"
    @confirm="submitSignature"
    @close="emit('update:visible', false)"
  >
    <template #header>
      <icon name="signature" />
      {{ t('tools.signature.title') }}
    </template>
    <div class="umo-signature-dialog">
      <t-radio-group
        v-model="activeTab"
        variant="default-filled"
        @change="(value) => (activeTab = value)"
      >
        <t-radio-button value="online">
          {{ t('tools.signature.tabs.online') }}
        </t-radio-button>
        <t-radio-button value="select">
          {{ t('tools.signature.tabs.select') }}
        </t-radio-button>
      </t-radio-group>
      <template v-if="activeTab === 'online'">
        <div class="umo-signature-dialog__toolbar">
          <menus-button
            ico="undo"
            :text="t('base.undo')"
            hide-text
            @menu-click="signature?.undo?.()"
          />
          <menus-button
            ico="clear-format"
            :text="t('tools.signature.clear')"
            hide-text
            @menu-click="clearSignature"
          />
          <t-divider layout="vertical" />
          <menus-button
            :text="t('tools.signature.lineWidth')"
            menu-type="dropdown"
            hide-text
            :select-options="lineWidthOptions"
            @click="changeLineWidth"
          >
            <icon name="highlight" />
          </menus-button>
          <menus-toolbar-base-color
            :text="t('tools.signature.lineColor')"
            modeless
            :default-color="signatureOptions.color"
            @change="changeLineColor"
          />
          <menus-button
            :text="t('tools.signature.smooth')"
            :menu-active="openSmooth"
            hide-text
            @menu-click="changeSmooth"
          >
            <icon name="highlight" />
          </menus-button>
          <t-divider layout="vertical" />
          <menus-button
            ico="image-reset"
            :text="t('tools.signature.reset')"
            hide-text
            @menu-click="resetSignatureOptions"
          />
        </div>
        <div
          class="umo-signature-dialog__canvas"
          :data-tip="t('tools.signature.tip')"
        >
          <canvas ref="signatureRef" />
        </div>
      </template>
      <template v-else>
        <div class="umo-signature-dialog__select">
          <div
            v-if="selectedImage?.url"
            class="umo-signature-dialog__select-workspace"
          >
            <div class="umo-signature-dialog__select-stage">
              <div class="umo-signature-dialog__select-stage-header">
                <div class="umo-signature-dialog__select-stage-title">
                  {{ t('tools.signature.cropTitle') }}
                </div>
                <div class="umo-signature-dialog__select-stage-tip">
                  {{ t('tools.signature.cropTip') }}
                </div>
              </div>
              <div
                ref="cropperHostRef"
                class="umo-signature-dialog__select-cropper umo-cropper-surface"
              >
                <img
                  ref="cropperImageRef"
                  :key="selectedImage.url"
                  class="umo-signature-dialog__select-cropper-source"
                  :src="selectedImage.url"
                  :alt="selectedImage.name || t('tools.signature.text')"
                />
              </div>
            </div>
            <div class="umo-signature-dialog__select-sidebar">
              <div class="umo-signature-dialog__select-name">
                {{ selectedImage.name || t('tools.signature.text') }}
              </div>
              <div class="umo-signature-dialog__select-source">
                <div>
                  {{ t('tools.signature.fileSize') }}：{{
                    selectedImageSizeText
                  }}
                </div>
                <div>
                  {{ t('tools.signature.imageSize') }}：{{
                    selectedImageDimensionText
                  }}
                </div>
              </div>
              <t-button
                variant="outline"
                class="umo-signature-dialog__select-reselect"
                @click="restoreSelectPlaceholder"
              >
                {{ t('tools.signature.reselect') }}
              </t-button>
            </div>
          </div>
          <div v-else class="umo-signature-dialog__select-empty">
            <div class="umo-signature-dialog__select-empty-content">
              <div class="umo-signature-dialog__select-empty-text">
                {{ t('tools.signature.selectEmpty') }}
              </div>
              <div class="umo-signature-dialog__select-empty-actions">
                <t-button theme="default" @click="selectLocalImage">
                  <icon name="image" />
                  {{ t('tools.signature.selectLocal') }}
                </t-button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </modal>
</template>

<script setup>
import prettyBytes from 'pretty-bytes'
import SmoothSignature from 'smooth-signature'
import {
  buildCroppedImageFileName,
  formatImageDimensionText,
  getImageDimensionsFromUrl,
  resolveFileAssetUrl,
} from '@/utils/file'
import { ImageCropper } from '@/utils/image-cropper'
import {
  createImageFileFromDataUrl,
  getImageAccept,
  getImageMaxSize,
  validateImageFileSize,
} from '@/utils/upload'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  value: {
    type: Object,
    default: null,
  },
  mode: {
    type: String,
    default: 'editor',
  },
})

const emit = defineEmits(['update:visible', 'confirm'])

const container = inject('container')
const options = inject('options')
const openFilePicker = inject('openFilePicker', null)
const filePicker = inject('filePicker', null)
const { t } = useI18n()

const lineWidthOptions = [
  { content: '2', value: 2 },
  { content: '3', value: 3 },
  { content: '4', value: 4 },
  { content: '5', value: 5 },
  { content: '6', value: 6 },
  { content: '7', value: 7 },
  { content: '8', value: 8 },
]

const signatureRef = ref(null)
const cropperHostRef = ref(null)
const cropperImageRef = ref(null)
const selectedImage = ref(null)
const selectedLocalFile = ref(null)

let signature = $ref(null)
const cropper = new ImageCropper()
let cropInitialSelection = null
let openSmooth = $ref(false)
let activeTab = $ref('online')
let pickerSelectionPending = $ref(false)
let restoreFilePickerHandler = $ref(null)

const signatureOptions = reactive({
  width: 600,
  height: 234,
  minWidth: 4,
  maxWidth: 4,
  color: '#000',
  openSmooth: false,
  scale: 2,
})

const uploadAccept = computed(() => getImageAccept(options.value))
const uploadMaxSize = computed(() => getImageMaxSize(options.value))
const selectedImageSizeText = computed(() =>
  selectedImage.value?.size
    ? prettyBytes(selectedImage.value.size)
    : t('file.unknownSize'),
)
const selectedImageDimensionText = computed(() =>
  formatImageDimensionText(
    selectedImage.value?.width,
    selectedImage.value?.height,
    t('tools.signature.unknownDimensions'),
  ),
)

const getFileSizeLimitMessage = (file) =>
  t('file.limitSize', {
    filename: file?.name || t('file.unknownName'),
    size: Math.ceil(uploadMaxSize.value / 1024 / 1024),
  })

const getExistingImageValue = () => {
  const src = props.value?.src || props.value?.url || ''
  if (!src) {
    return null
  }
  return {
    id: props.value.id || null,
    url: src,
    name: props.value.alt || props.value.name || t('tools.signature.text'),
    size: null,
    type: props.value.type || 'image/*',
    width: props.value.width || null,
    height: props.value.height || null,
    source: 'existing',
  }
}

const revokeSelectedLocalPreview = () => {
  if (
    selectedImage.value?.source === 'local' &&
    selectedImage.value?.url?.startsWith('blob:')
  ) {
    URL.revokeObjectURL(selectedImage.value.url)
  }
}

const resetSelectedImage = () => {
  revokeSelectedLocalPreview()
  selectedImage.value = null
  selectedLocalFile.value = null
}

const setSelectedImage = (value, source = 'existing', file = null) => {
  resetSelectedImage()
  if (!value) {
    return
  }
  selectedImage.value = {
    ...value,
    source,
  }
  selectedLocalFile.value = file instanceof File ? file : null
}

const ensureSignature = async () => {
  if (signature) {
    return signature
  }
  await nextTick()
  signature = new SmoothSignature(signatureRef.value, signatureOptions)
  return signature
}

const destroySignature = () => {
  signature = null
}

const resetSignatureOptions = () => {
  if (!signature) {
    return
  }
  signatureOptions.width = 600
  signatureOptions.height = 234
  signatureOptions.minWidth = 4
  signatureOptions.maxWidth = 4
  signatureOptions.color = '#000'
  signatureOptions.openSmooth = false
  signature.width = 600
  signature.height = 234
  signature.minWidth = 4
  signature.maxWidth = 4
  signature.color = '#000'
  signature.openSmooth = false
  openSmooth = false
}

const clearSignature = () => {
  signature?.clear?.()
}

const changeLineColor = (color) => {
  if (!signature) {
    return
  }
  signatureOptions.color = color
  signature.color = color
}

const changeLineWidth = ({ value }) => {
  if (!signature) {
    return
  }
  signatureOptions.minWidth = value
  signatureOptions.maxWidth = value
  signature.minWidth = value
  signature.maxWidth = value
}

const changeSmooth = () => {
  if (!signature) {
    return
  }
  openSmooth = !openSmooth
  signatureOptions.openSmooth = openSmooth
  signature.openSmooth = openSmooth
  signatureOptions.maxWidth = openSmooth
    ? signature.minWidth * 2
    : signature.minWidth
  signature.maxWidth = openSmooth ? signature.minWidth * 2 : signature.minWidth
}

const destroyCropper = () => {
  cropper.destroy()
  cropInitialSelection = null
}

const restoreSelectPlaceholder = () => {
  destroyCropper()
  resetSelectedImage()
}

const getCropperSelection = () => cropper.getSelection()

const initCropper = async () => {
  destroyCropper()
  if (!selectedImage.value?.url) {
    return
  }
  await nextTick()
  if (!cropperHostRef.value || !cropperImageRef.value) {
    return
  }
  cropper.start({
    image: cropperImageRef.value,
    container: cropperHostRef.value,
  })
  cropInitialSelection = cropper.getSelectionSnapshot()
}

const exportCroppedSelection = async () => {
  const selection = getCropperSelection()
  if (
    !selection ||
    !cropper.isSelectionChanged(cropInitialSelection, selection)
  ) {
    return null
  }
  const size = cropper.getExportSize(selection)
  const canvas = await cropper.exportSelection(selection, size)
  const file = await createImageFileFromDataUrl(
    canvas.toDataURL('image/png'),
    buildCroppedImageFileName(
      selectedLocalFile.value?.name || selectedImage.value?.name,
      'signature',
    ),
  )
  return {
    file,
    width: size.width,
    height: size.height,
  }
}

const buildImageValueFromLibrary = async (item) => {
  const url = resolveFileAssetUrl(
    item?.url || item?.thumbnail || '',
    options.value?.server || {},
  )
  if (!url) {
    throw new Error(t('node.image.error'))
  }
  const dimension = await getImageDimensionsFromUrl(url)
  return {
    id: item?.id || null,
    url,
    name: item?.name || t('tools.signature.text'),
    type: item?.mimeType || 'image/*',
    size: Number(item?.size) || null,
    width: dimension?.width || null,
    height: dimension?.height || null,
  }
}

const restorePickerHandler = () => {
  if (
    !pickerSelectionPending ||
    typeof restoreFilePickerHandler !== 'function'
  ) {
    return
  }
  restoreFilePickerHandler()
  restoreFilePickerHandler = null
  pickerSelectionPending = false
}

const selectLibraryImage = () => {
  if (typeof openFilePicker !== 'function') {
    return
  }
  const previousOnConfirm = options.value?.filePicker?.onConfirm
  restorePickerHandler()
  options.value.filePicker = {
    ...(options.value?.filePicker || {}),
    onConfirm: async (selection) => {
      try {
        const item = Array.isArray(selection) ? selection[0] : selection
        const nextValue = await buildImageValueFromLibrary(item)
        setSelectedImage(nextValue, 'library')
      } catch (error) {
        useMessage('error', {
          attach: container,
          content: error?.message || t('node.image.error'),
        })
      } finally {
        restorePickerHandler()
      }
      return { handled: true }
    },
  }
  restoreFilePickerHandler = () => {
    options.value.filePicker = {
      ...(options.value?.filePicker || {}),
      onConfirm: previousOnConfirm,
    }
  }
  pickerSelectionPending = true
  const opened = openFilePicker({ type: 'image', selected: [] })
  if (!opened) {
    restorePickerHandler()
  }
}

const selectLocalImage = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = uploadAccept.value || 'image/*'
  input.onchange = async (event) => {
    const file = event.target?.files?.[0]
    if (!file) {
      return
    }
    if (validateImageFileSize(file, uploadMaxSize.value)) {
      useMessage('error', {
        attach: container,
        content: getFileSizeLimitMessage(file),
      })
      return
    }
    const url = URL.createObjectURL(file)
    const dimension = await getImageDimensionsFromUrl(url)
    setSelectedImage(
      {
        url,
        name: file.name || t('tools.signature.text'),
        type: file.type || 'image/*',
        size: Number(file.size) || null,
        width: dimension?.width || null,
        height: dimension?.height || null,
      },
      'local',
      file,
    )
  }
  input.click()
}

const submitSignature = async () => {
  if (activeTab === 'select') {
    try {
      const croppedImage = await exportCroppedSelection()
      if (croppedImage?.file) {
        emit('confirm', croppedImage)
        emit('update:visible', false)
        return
      }
    } catch (error) {
      useMessage('error', {
        attach: container,
        content: error?.message || t('tools.signature.cropFailed'),
      })
      return
    }
    if (selectedLocalFile.value) {
      emit('confirm', {
        file: selectedLocalFile.value,
        width: selectedImage.value?.width || null,
        height: selectedImage.value?.height || null,
      })
      emit('update:visible', false)
      return
    }
    if (selectedImage.value?.url) {
      emit('confirm', {
        ...selectedImage.value,
      })
      emit('update:visible', false)
      return
    }
    useMessage('error', {
      attach: container,
      content: t('tools.signature.selectEmpty'),
    })
    return
  }
  try {
    await ensureSignature()
    const image = signature.getPNG()
    const file = await createImageFileFromDataUrl(image, 'signature.png')
    emit('confirm', {
      file,
      width: 120,
      height: 40,
    })
    emit('update:visible', false)
  } catch (error) {
    useMessage('error', {
      attach: container,
      content: error?.message || t('tools.signature.notEmpty'),
    })
  }
}

watch(
  () => props.visible,
  async (value) => {
    if (value) {
      setSelectedImage(getExistingImageValue())
      if (activeTab === 'online') {
        await ensureSignature()
      }
      return
    }
    restorePickerHandler()
    signature?.clear?.()
    destroySignature()
    destroyCropper()
    resetSelectedImage()
    openSmooth = false
  },
  { immediate: true },
)

watch(
  () => activeTab,
  async (value) => {
    if (value === 'online' && props.visible) {
      await ensureSignature()
      return
    }
    destroySignature()
  },
)

watch(
  [() => props.visible, () => activeTab, () => selectedImage.value?.url],
  async ([visible, tab, imageUrl]) => {
    if (!visible || tab !== 'select' || !imageUrl) {
      destroyCropper()
      return
    }
    await initCropper()
  },
)

watch(
  () => filePicker?.value?.visible,
  (visible) => {
    if (visible === false) {
      restorePickerHandler()
    }
  },
)

onBeforeUnmount(() => {
  restorePickerHandler()
  destroyCropper()
  resetSelectedImage()
})
</script>

<style lang="less" scoped>
.umo-signature-dialog {
  &__toolbar {
    display: flex;
    align-items: center;
    margin: 12px 0 10px;
  }

  &__canvas {
    border: solid 1px var(--umo-primary-color);
    border-radius: var(--umo-radius);
    box-sizing: border-box;
    display: flex;
    overflow: hidden;
    position: relative;

    &::before {
      align-items: center;
      bottom: 0;
      color: var(--umo-text-color-light);
      content: attr(data-tip);
      display: flex;
      justify-content: center;
      left: 0;
      opacity: 0.5;
      pointer-events: none;
      position: absolute;
      right: 0;
      top: 0;
      z-index: 1;
    }

    canvas {
      height: 234px;
      width: 600px;
    }
  }

  &__select {
    padding-top: 12px;
  }

  &__select-workspace {
    display: flex;
    gap: 16px;
  }

  &__select-stage,
  &__select-sidebar,
  &__select-empty {
    background: var(--td-bg-color-container);
    border: 1px solid var(--umo-border-color-light);
    border-radius: calc(var(--umo-radius) + 2px);
  }

  &__select-stage {
    flex: 1;
    min-width: 0;
    padding: 14px;
  }

  &__select-stage-header {
    margin-bottom: 12px;
  }

  &__select-stage-title {
    color: var(--td-text-color-primary);
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
  }

  &__select-stage-tip {
    color: var(--td-text-color-secondary);
    font-size: 12px;
    line-height: 20px;
  }

  &__select-cropper {
    align-items: center;
    background:
      linear-gradient(45deg, rgba(0, 0, 0, 0.03) 25%, transparent 25%) 0 0 /
        16px 16px,
      linear-gradient(-45deg, rgba(0, 0, 0, 0.03) 25%, transparent 25%) 0 8px /
        16px 16px,
      linear-gradient(45deg, transparent 75%, rgba(0, 0, 0, 0.03) 75%)
        8px -8px / 16px 16px,
      linear-gradient(-45deg, transparent 75%, rgba(0, 0, 0, 0.03) 75%) -8px 0 /
        16px 16px,
      #fff;
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: var(--umo-radius);
    display: flex;
    justify-content: center;
    height: 200px;
    overflow: hidden;
    position: relative;
    width: 100%;
  }

  &__select-cropper-source {
    display: block;
    height: 100%;
    object-fit: contain;
    width: 100%;
  }

  &__select-sidebar {
    display: flex;
    flex: 0 0 220px;
    flex-direction: column;
    gap: 12px;
    padding: 14px;
  }

  &__select-name {
    color: var(--td-text-color-primary);
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
    word-break: break-all;
  }

  &__select-source {
    color: var(--td-text-color-secondary);
    display: flex;
    font-size: 12px;
    flex-direction: column;
    gap: 4px;
    line-height: 20px;
  }

  &__select-reselect {
    width: 100%;
  }

  &__select-empty {
    align-items: center;
    color: var(--td-text-color-secondary);
    display: flex;
    font-size: 13px;
    justify-content: center;
    line-height: 22px;
    min-height: 220px;
    padding: 24px;
  }

  &__select-empty-content {
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: 14px;
    text-align: center;
  }

  &__select-empty-text {
    max-width: 320px;
  }

  &__select-empty-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
    :deep(.umo-button__text) {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      .umo-icon {
        font-size: 16px;
      }
    }
  }
}
</style>
