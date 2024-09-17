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

import { getSelectionNode } from '@/extensions/selection'
import { shortId } from '@/utils/short-id'

const { options, editor } = useStore()

let converting = $ref(false)
const removeBg = async () => {
  const image = editor.value ? getSelectionNode(editor.value) : null
  const { src } = image?.attrs ?? {}
  converting = true
  const blob = await removeBackground(src, {
    publicPath: `${options.value.cdnUrl}/libs/imgly/background-removal-data/`,
  })
  const file = new File([blob], `${shortId(10)}.png`, { type: 'image/png' })
  if (image) {
    editor.value?.commands.updateAttributes(image.type, {
      src: URL.createObjectURL(blob),
      uploaded: false,
      file,
    })
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
