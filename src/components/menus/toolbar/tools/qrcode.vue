<template>
  <menus-button
    :ico="isEditMode ? 'edit' : 'qrcode'"
    :text="isEditMode ? t('tools.qrcode.edit') : t('tools.qrcode.text')"
    huge
    @menu-click="dialogVisible = true"
  />
  <dialog-qrcode
    v-model:visible="dialogVisible"
    :content="content"
    :value="value"
    @confirm="setQrcode"
  />
</template>

<script setup>
import { shortId } from '@/utils/short-id'

const props = defineProps({
  content: {
    type: String,
    default: '',
  },
  replace: {
    type: Boolean,
    default: false,
  },
  value: {
    type: Object,
    default: null,
  },
})

const editor = inject('editor')
const { t } = useI18n()

let dialogVisible = $ref(false)
const isEditMode = computed(() => props.replace || !!props.content)

const setQrcode = (imageValue) => {
  if (!imageValue?.url) {
    return
  }
  editor.value
    ?.chain()
    .focus()
    .setImage(
      {
        id: props.replace ? props.value?.id || shortId(10) : shortId(10),
        type: 'qrcode',
        src: imageValue.url,
        content: imageValue.content || null,
        alt: t('tools.qrcode.text'),
        width: imageValue.width || props.value?.width || 256,
        height: imageValue.height || props.value?.height || 256,
      },
      isEditMode.value,
    )
    .run()
}
</script>
