<template>
  <editor-menus-button
    :tooltip="converting ? '正在去除图片背景...' : '去除图片背景'"
    :disabled="converting"
    @button-click="removeBackground"
  >
    <icon v-if="!converting" name="image-remove-background" />
    <icon v-else class="loading" name="loading" />
  </editor-menus-button>
</template>

<script setup>
import imglyRemoveBackground from '@imgly/background-removal'
import generateId from '@/utils/generate-id'

const { options, editor } = useStore()

let converting = $ref(false)
const removeBackground = async () => {
  const image = editor.value.commands.getSelectionNode()
  const { src } = editor.value?.getAttributes('image')
  converting = true
  const blob = await imglyRemoveBackground(src, {
    publicPath: `${options.value.cdnUrl}/libs/imgly/background-removal-data/`,
  })
  const file = new File([blob], `${generateId(10)}.png`, { type: 'image/png' })
  image.props.updateAttributes({
    src: URL.createObjectURL(blob),
    uploaded: false,
    file,
  })
  converting = false
}
</script>

<style lang="less" scoped>
.loading {
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
