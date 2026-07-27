<template>
  <modal
    :visible="visible"
    width="560px"
    @confirm="submitStamp"
    @close="emit('update:visible', false)"
  >
    <template #header>
      <icon name="stamp" />
      {{ t('tools.stamp.title') }}
    </template>
    <div class="umo-stamp-dialog">
      <div class="umo-stamp-dialog__select">
        <div
          v-if="selectedImage?.url"
          class="umo-stamp-dialog__select-workspace"
        >
          <div class="umo-stamp-dialog__select-stage">
            <div class="umo-stamp-dialog__select-stage-header">
              <div class="umo-stamp-dialog__select-stage-title">
                {{ t('tools.stamp.previewTitle') }}
              </div>
              <div class="umo-stamp-dialog__select-stage-tip">
                {{ t('tools.stamp.previewTip') }}
              </div>
            </div>
            <div
              ref="cropperHostRef"
              class="umo-stamp-dialog__select-preview umo-cropper-surface"
            >
              <img
                ref="cropperImageRef"
                :key="selectedImage.url"
                class="umo-stamp-dialog__select-image"
                :src="selectedImage.url"
                :alt="selectedImage.name || t('tools.stamp.text')"
              />
            </div>
          </div>
          <div class="umo-stamp-dialog__select-sidebar">
            <div class="umo-stamp-dialog__select-name">
              {{ selectedImage.name || t('tools.stamp.text') }}
            </div>
            <div class="umo-stamp-dialog__select-source">
              <div>
                {{ t('tools.stamp.fileSize') }}：{{ selectedImageSizeText }}
              </div>
              <div>
                {{ t('tools.stamp.imageSize') }}：{{
                  selectedImageDimensionText
                }}
              </div>
            </div>
            <div class="umo-stamp-dialog__select-field">
              <div class="umo-stamp-dialog__select-field-label">
                {{ t('tools.stamp.presetTitle') }}
              </div>
              <t-select
                :value="selectedPreset"
                class="umo-stamp-dialog__select-preset"
                :popup-props="{
                  destroyOnClose: true,
                  attach: container,
                }"
                :options="stampPresetSelectOptions"
                @change="(value) => (selectedPreset = value)"
              />
            </div>
            <t-button
              variant="outline"
              class="umo-stamp-dialog__select-reselect"
              @click="restoreSelectPlaceholder"
            >
              {{ t('tools.stamp.reselect') }}
            </t-button>
          </div>
        </div>
        <div v-else class="umo-stamp-dialog__select-empty">
          <div class="umo-stamp-dialog__select-empty-content">
            <div class="umo-stamp-dialog__select-empty-text">
              {{ t('tools.stamp.selectEmpty') }}
            </div>
            <div class="umo-stamp-dialog__select-empty-actions">
              <t-button theme="default" @click="selectLocalImage">
                <icon name="image" />
                {{ t('tools.stamp.selectLocal') }}
              </t-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </modal>
</template>

<script setup>
import prettyBytes from 'pretty-bytes'
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
  validateImageFileSize,
} from '@/utils/upload'
import { getStampPresetOptions, getStampPresetValueBySize } from '@/utils/stamp'

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

const selectedImage = ref(null)
const selectedLocalFile = ref(null)
const cropperHostRef = ref(null)
const cropperImageRef = ref(null)

const cropper = new ImageCropper()
let selectedPreset = $ref('company')
let cropInitialSelection = null
let pickerSelectionPending = $ref(false)
let restoreFilePickerHandler = $ref(null)

const uploadAccept = computed(() => getImageAccept(options.value))
const uploadMaxSize = computed(() => {
  const maxSize = Number(options.value?.file?.maxSize)
  return Number.isFinite(maxSize) && maxSize > 0 ? maxSize : 0
})

const stampPresetOptions = computed(() => getStampPresetOptions(t))
const stampPresetSelectOptions = computed(() =>
  stampPresetOptions.value.map((option) => ({
    label:
      option.isCustom === true
        ? option.label
        : `${option.label} ${option.width} x ${option.height}`,
    value: option.value,
  })),
)

const currentPreset = computed(
  () =>
    stampPresetOptions.value.find(
      (option) => option.value === selectedPreset,
    ) || stampPresetOptions.value[0],
)
const selectedImageSizeText = computed(() =>
  selectedImage.value?.size
    ? prettyBytes(selectedImage.value.size)
    : t('file.unknownSize'),
)
const selectedImageDimensionText = computed(() =>
  formatImageDimensionText(
    selectedImage.value?.width,
    selectedImage.value?.height,
    t('tools.stamp.unknownDimensions'),
  ),
)
const submitPresetSize = computed(() =>
  currentPreset.value?.isCustom === true
    ? { width: 160, height: null }
    : {
        width: currentPreset.value?.width || 160,
        height: currentPreset.value?.height || null,
      },
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
    name: props.value.alt || props.value.name || t('tools.stamp.text'),
    size: null,
    type: props.value.type || 'image/*',
    width: props.value.width || null,
    height: props.value.height || null,
    source: 'existing',
  }
}

const syncPresetFromValue = (value) => {
  selectedPreset = getStampPresetValueBySize(value?.width, value?.height)
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
      'stamp',
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
    name: item?.name || t('tools.stamp.text'),
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
        name: file.name || t('tools.stamp.text'),
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

const submitStamp = async () => {
  if (!selectedImage.value?.url && !selectedLocalFile.value) {
    useMessage('error', {
      attach: container,
      content: t('tools.stamp.notEmpty'),
    })
    return
  }
  const croppedImage = await exportCroppedSelection()
  const { width, height } = submitPresetSize.value
  if (croppedImage?.file) {
    emit('confirm', {
      file: croppedImage.file,
      width,
      height,
    })
    emit('update:visible', false)
    return
  }
  if (selectedLocalFile.value) {
    emit('confirm', {
      file: selectedLocalFile.value,
      width,
      height,
    })
    emit('update:visible', false)
    return
  }
  emit('confirm', {
    ...selectedImage.value,
    width,
    height,
  })
  emit('update:visible', false)
}

watch(
  () => props.visible,
  (value) => {
    if (value) {
      const currentValue = getExistingImageValue()
      setSelectedImage(currentValue)
      syncPresetFromValue(currentValue)
      return
    }
    restorePickerHandler()
    destroyCropper()
    resetSelectedImage()
  },
  { immediate: true },
)

watch(
  [() => props.visible, () => selectedImage.value?.url],
  async ([visible, imageUrl]) => {
    if (!visible || !imageUrl) {
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
.umo-stamp-dialog {
  &__select-workspace {
    display: flex;
    gap: 16px;
  }

  &__select-stage,
  &__select-sidebar,
  &__select-empty {
    background: var(--td-bg-color-container);
    border: 1px solid var(--umo-border-color);
    border-radius: var(--umo-radius);
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

  &__select-preview {
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
    aspect-ratio: 1 / 1;
    justify-content: center;
    overflow: hidden;
    width: min(100%, 360px);
  }

  &__select-image {
    display: block;
    height: 100%;
    max-width: 100%;
    object-fit: contain;
  }

  &__select-sidebar {
    display: flex;
    flex: 0 0 160px;
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
    flex-direction: column;
    font-size: 12px;
    gap: 4px;
    line-height: 20px;
  }

  &__select-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__select-field-label {
    color: var(--td-text-color-secondary);
    font-size: 12px;
    line-height: 20px;
  }

  &__select-preset {
    width: 100%;
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
