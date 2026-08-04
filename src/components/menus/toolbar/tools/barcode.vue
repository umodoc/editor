<template>
  <menus-button
    :ico="isEditMode ? 'edit' : 'barcode'"
    :text="isEditMode ? t('tools.barcode.edit') : t('tools.barcode.text')"
    huge
    @menu-click="dialogVisible = true"
  >
    <dialog-barcode
      v-model:visible="dialogVisible"
      :content="content"
      :value="value"
      @confirm="setBarcode"
    />
  </menus-button>
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

const setBarcode = (imageValue) => {
  if (!imageValue?.url) {
    return
  }
  editor.value
    ?.chain()
    .focus()
    .setImage(
      {
        id: props.replace ? props.value?.id || shortId(10) : shortId(10),
        type: 'barcode',
        src: imageValue.url,
        content: imageValue.content || null,
        alt: t('tools.barcode.text'),
        width: imageValue.width || props.value?.width || null,
        height: imageValue.height || props.value?.height || null,
      },
      isEditMode.value,
    )
    .run()
}
</script>
