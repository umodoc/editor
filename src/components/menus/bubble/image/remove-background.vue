<template>
  <menus-button
    :text="
      converting
        ? t('bubbleMenu.image.removingBg')
        : t('bubbleMenu.image.removeBg')
    "
    :disabled="converting"
    @menu-click="removeBg"
  >
    <icon v-if="!converting" name="image-remove-background" />
    <icon v-else class="umo-image-loading" name="loading" />
  </menus-button>
</template>

<script setup lang="ts">
import { removeBackground } from '@imgly/background-removal'

import { updateAttributesWithoutHistory } from '@/extensions/file'
import { getSelectionNode } from '@/extensions/selection'

const editor = inject('editor')
const options = inject('options')
const uploadFileMap = inject('uploadFileMap')

let converting = $ref(false)
const removeBg = async () => {
  const image = editor.value ? getSelectionNode(editor.value) : null
  const { src, id } = image?.attrs ?? {}
  converting = true
  const blob = await removeBackground(src, {
    publicPath: `${options.value.cdnUrl}/libs/imgly/background-removal-data/`,
  })
  const file = new File([blob], `image-${id}.png`, { type: 'image/png' })
  if (image) {
    const { $from } = editor.value?.state.selection ?? {}
    const pos = $from.start()
    updateAttributesWithoutHistory(
      editor.value,
      { src: URL.createObjectURL(blob), uploaded: false },
      pos,
    )
    // eslint-disable-next-line no-unsafe-optional-chaining
    const { id, url } = await options.value?.onFileUpload?.(file)
    updateAttributesWithoutHistory(
      editor.value,
      { id, src: url, uploaded: true },
      pos,
    )
  }
  converting = false
}
</script>

<style lang="less" scoped>
.umo-image-loading {
  animation: turn 1s linear infinite;
}
@keyframes turn {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
