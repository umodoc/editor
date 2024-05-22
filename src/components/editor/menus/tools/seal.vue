<template>
  <editor-menus-button
    v-if="imglyRemoveBackground"
    huge-button
    @button-click="dialogVisible = true"
  >
    <icon name="seal" />
    <template #text>
      <p class="button-text">电子签章</p>
    </template>
  </editor-menus-button>
  <modal
    :visible="dialogVisible"
    icon="seal"
    title="插入电子签章"
    width="480px"
    confirm-btn="插入"
    @confirm="setSeal"
    @close="dialogVisible = false"
  >
    <div class="seal-container" @click="selectImage">
      <div class="tip">
        选择纯色背景电子章的影印件或者照片，将自动扣取电子章，所有操作在本地完成，不会向服务器发送数据，请放心使用。
      </div>
      <div class="seal-uploader">
        <span v-if="!sealImg">{{
          converting ? converting : '点击此处选择电子章图片'
        }}</span>
        <img class="seal-img" v-else :src="sealImg" />
      </div>
    </div>
  </modal>
</template>

<script setup>
import imglyRemoveBackground from '@imgly/background-removal'

let dialogVisible = $ref(false)
const { options, editor } = useStore()

let sealImg = $ref(null)
let converting = $ref(null)
let file = $ref(null)

const selectImage = async () => {
  const { open, onChange } = useFileDialog({
    accept: 'image/png,image/jpeg',
    multiple: false,
    reset: true,
  })
  // 打开文件对话框
  open()
  // 选择图片
  onChange(async (files) => {
    if (!files) return
    file = files[0]
    if (!file) return
    try {
      sealImg = null
      converting = '正在加载组件...'
      const img = await imglyRemoveBackground(file, {
        publicPath: `${options.value.cdnUrl}/libs/imgly/background-removal-data/`,
        progress: (key, current, total) => {
          if (key.startsWith('fetch')) {
            converting = `正在加载组件: ${((current / total) * 100).toFixed(1)}%`
          } else {
            converting = '正在抠图中，请稍后...'
          }
        },
      })
      sealImg = URL.createObjectURL(img)
    } catch {
      useMessage('error', '电子章抠取失败，请重试')
      sealImg = null
    } finally {
      converting = null
    }
  })
}

const setSeal = () => {
  if (!sealImg) {
    useMessage('error', '请选择电子章')
    return
  }
  editor.value
    ?.chain()
    .focus()
    .setImage({
      type: 'seal',
      src: sealImg,
      width: 150,
      draggable: true,
      rotatable: true,
      file,
    })
    .run()
  dialogVisible = false
  sealImg = null
  converting = null
}
</script>

<style lang="less" scoped>
.seal-container {
  .seal-tip {
    font-size: 12px;
    color: var(--umo-text-color-light);
    margin-bottom: 6px;
    line-height: 1.4;
  }
  .seal-uploader {
    margin-top: 20px;
    height: 240px;
    border: solid 1px var(--umo-primary-color);
    border-radius: var(--umo-radius);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    color: var(--umo-text-color-light);
    .seal-img {
      max-height: 100%;
      max-width: 100%;
      background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBvcGFjaXR5PSIwLjEiPgo8cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9ImJsYWNrIi8+CjxyZWN0IHg9IjgiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9ImJsYWNrIi8+CjxyZWN0IHg9IjQiIHk9IjQiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9ImJsYWNrIi8+CjxyZWN0IHg9IjEyIiB5PSI0IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJibGFjayIvPgo8cmVjdCB5PSI4IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJibGFjayIvPgo8cmVjdCB4PSI4IiB5PSI4IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJibGFjayIvPgo8cmVjdCB4PSI0IiB5PSIxMiIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iYmxhY2siLz4KPHJlY3QgeD0iMTIiIHk9IjEyIiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K);
      background-size: 24px;
    }
  }
}
</style>
