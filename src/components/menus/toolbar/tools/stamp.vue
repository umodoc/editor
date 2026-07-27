<template>
  <menus-button
    ico="stamp"
    :text="t('tools.stamp.text')"
    huge
    @menu-click="dialogVisible = true"
  />
  <dialog-stamp
    v-model:visible="dialogVisible"
    :value="value"
    @confirm="setStamp"
  />
</template>

<script setup>
import { shortId } from '@/utils/short-id'

const props = defineProps({
  replace: {
    type: Boolean,
    default: false,
  },
  value: {
    type: Object,
    default: null,
  },
})

const uploadFileMap = inject('uploadFileMap')
const editor = inject('editor')
const { t } = useI18n()

let dialogVisible = $ref(false)

const setStamp = (imageValue) => {
  if (!imageValue?.url && !(imageValue?.file instanceof File)) {
    return
  }
  const id = props.replace ? props.value?.id || shortId(10) : shortId(10)
  const src =
    imageValue?.url ||
    (imageValue?.file instanceof File
      ? URL.createObjectURL(imageValue.file)
      : '')
  if (imageValue?.file instanceof File) {
    uploadFileMap.value.set(id, imageValue.file)
  }
  editor.value
    ?.chain()
    .focus()
    .setImage(
      {
        id,
        type: 'stamp',
        src,
        alt: t('tools.stamp.text'),
        name:
          imageValue?.file?.name || imageValue?.name || t('tools.stamp.text'),
        size: imageValue?.file?.size || imageValue?.size || null,
        width: imageValue.width || props.value?.width,
        height: imageValue.height || props.value?.height,
        draggable: true,
        equalProportion: false,
        nodeAlign: 'left',
        previewType: null,
        uploaded: !(imageValue?.file instanceof File),
      },
      props.replace,
    )
    .run()
}
</script>
