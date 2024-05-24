<template>
  <editor-menus-button
    ico="image"
    text="图片"
    menu-type="dropdown"
    huge
    :select-options="formats"
    @click="saveImage"
  />
</template>

<script setup>
import { toBlob } from 'dom-to-image-more'
import { saveAs } from 'file-saver'

const { container, options, page } = useStore()

const formats = [
  { content: 'PNG 格式', value: 'png' },
  { content: 'JPG 格式', value: 'jpg' },
]

const saveImage = async ({ content, value }) => {
  if (!content) return
  const zoomLevel = page.value.zoomLevel
  try {
    page.value.zoomLevel = 100
    const node = document.querySelector(`${container} .page-content`)
    const blob = await toBlob(node, { scale: devicePixelRatio })
    saveAs(
      blob,
      `${options.value.document.title}${devicePixelRatio > 1 ? '@' + devicePixelRatio + 'x' : ''}.${value}`,
    )
  } catch {
    const dialog = useAlert({
      theme: 'warning',
      header: '错误提示',
      body: '导出图片失败，请重试或尝试刷新页面。',
      onConfirm() {
        dialog.destroy()
      },
    })
  } finally {
    page.value.zoomLevel = zoomLevel
  }
}
</script>
