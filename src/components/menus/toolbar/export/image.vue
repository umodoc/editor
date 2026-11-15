<template>
  <menus-button
    ico="image"
    :text="t('export.image.text')"
    menu-type="dropdown"
    huge
    :select-options="formats"
    @click="saveImage"
  />
</template>

<script setup>
import domtoimage from 'dom-to-image-more'
import { saveAs } from 'file-saver'

const { toCanvas } = domtoimage
const container = inject('container')
const exportFile = inject('exportFile')
const page = inject('page')
const options = inject('options')

const formats = [
  { content: t('export.image.png'), value: 'png' },
  { content: t('export.image.jpg'), value: 'jpg' },
]

const saveImage = async ({ content, value }) => {
  if (!content) {
    return
  }
  const { zoomLevel } = page.value
  exportFile.value.image = true
  try {
    page.value.zoomLevel = 100
    await nextTick()
    const node = document.querySelector(`${container} .umo-page-content`)
    const canvas = await toCanvas(node, { scale: devicePixelRatio })
    const mimeType = value === 'jpg' ? 'image/jpeg' : 'image/png'
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, mimeType, 1),
    )
    if (!blob) {
      throw new Error('Failed to encode exported image')
    }
    const { title } = options.value.document
    const filename =
      title !== '' ? options.value?.document?.title : t('document.untitled')
    saveAs(
      blob,
      `${filename}${devicePixelRatio > 1 ? `@${devicePixelRatio}x` : ''}.${value}`,
    )
  } catch {
    const dialog = useAlert({
      attach: container,
      theme: 'warning',
      header: t('export.image.error.title'),
      body: t('export.image.error.message'),
      onConfirm() {
        dialog.destroy()
      },
    })
  } finally {
    page.value.zoomLevel = zoomLevel
    exportFile.value.image = false
  }
}
</script>
