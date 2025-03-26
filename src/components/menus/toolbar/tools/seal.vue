<template>
  <menus-button
    v-if="hasRemoveBackgroundFunction"
    ico="seal"
    :text="t('tools.seal.text')"
    huge
    @menu-click="dialogVisible = true"
  >
    <modal
      :visible="dialogVisible"
      icon="seal"
      :header="t('tools.seal.title')"
      width="480px"
      :confirm-btn="t('tools.seal.insert')"
      @confirm="setSeal"
      @close="dialogVisible = false"
    >
      <div class="umo-seal-container" @click="selectImage">
        <div class="umo-seal-tip" v-text="t('tools.seal.tip')"></div>
        <div class="umo-seal-uploader">
          <span v-if="!sealImg">{{
            converting ? converting : t('tools.seal.insertTip')
          }}</span>
          <img v-else class="umo-seal-img" :src="sealImg" />
        </div>
      </div>
    </modal>
  </menus-button>
</template>

<script setup lang="ts">
import { removeBackground } from '@imgly/background-removal'

import { shortId } from '@/utils/short-id'

const hasRemoveBackgroundFunction = typeof removeBackground === 'function'

let dialogVisible = $ref(false)
const editor = inject('editor')
const options = inject('options')
const container = inject('container')
const uploadFileMap = inject('uploadFileMap')

let sealImg = $ref<string | null>(null)
let converting = $ref<string | null>(null)
let file = $ref<File | null>(null)

const selectImage = () => {
  const { open, onChange } = useFileDialog({
    accept: 'image/png,image/jpeg',
    multiple: false,
    reset: true,
  })
  // 打开文件对话框
  open()
  // 选择图片
  onChange(async (files) => {
    if (!files) {
      return
    }
    ;[file] = files
    if (!file) {
      return
    }
    try {
      sealImg = null
      converting = t('tools.seal.converting1')
      const img = await removeBackground(file, {
        publicPath: `${options.value.cdnUrl}/libs/imgly/background-removal-data/`,
        progress: (key, current, total) => {
          if (key.startsWith('fetch')) {
            converting = t('tools.seal.converting2', {
              ppercentage: ((current / total) * 100).toFixed(1),
            })
          } else {
            converting = t('tools.seal.converting3')
          }
        },
      })
      sealImg = URL.createObjectURL(img)
    } catch {
      useMessage('error', {
        attach: container,
        content: t('tools.seal.convertError'),
      })
      sealImg = null
    } finally {
      converting = null
    }
  })
}

const setSeal = async () => {
  if (!sealImg) {
    useMessage('error', {
      attach: container,
      content: t('tools.seal.notEmpty'),
    })
    return
  }
  const id = shortId(10)
  const name = `seal-${id}.png`
  const file = await fetch(sealImg)
    .then((res) => res.blob())
    .then((blob) => new File([blob], name, { type: blob.type }))
  uploadFileMap.value.set(id, file)

  editor.value
    ?.chain()
    .focus()
    .setImage({
      id,
      type: 'seal',
      name,
      size: file.size,
      src: sealImg,
      width: 150,
      height: 'auto',
      draggable: true,
      rotatable: true,
      previewType: null,
    })
    .run()
  dialogVisible = false
  sealImg = null
  converting = null
}
</script>

<style lang="less" scoped>
.umo-seal-container {
  .umo-seal-tip {
    font-size: 12px;
    color: var(--umo-text-color-light);
    margin-bottom: 6px;
    line-height: 1.4;
  }
  .umo-seal-uploader {
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
    cursor: pointer;
    .umo-seal-img {
      max-height: 100%;
      max-width: 100%;
      background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBvcGFjaXR5PSIwLjEiPgo8cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9ImJsYWNrIi8+CjxyZWN0IHg9IjgiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9ImJsYWNrIi8+CjxyZWN0IHg9IjQiIHk9IjQiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9ImJsYWNrIi8+CjxyZWN0IHg9IjEyIiB5PSI0IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJibGFjayIvPgo8cmVjdCB5PSI4IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJibGFjayIvPgo8cmVjdCB4PSI4IiB5PSI4IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJibGFjayIvPgo8cmVjdCB4PSI0IiB5PSIxMiIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iYmxhY2siLz4KPHJlY3QgeD0iMTIiIHk9IjEyIiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K);
      background-size: 24px;
    }
  }
}
</style>
