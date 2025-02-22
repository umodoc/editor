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

<script setup lang="ts">
import domtoimage from 'dom-to-image-more'
import { saveAs } from 'file-saver'

const { toBlob } = domtoimage
const container = inject('container')
const exportFile = inject('exportFile')
const page = inject('page')
const options = inject('options')

const formats = [
  { content: t('export.image.png'), value: 'png' },
  { content: t('export.image.jpg'), value: 'jpg' },
]

const saveImage = async ({
  content,
  value,
}: {
  content: string
  value: string
}) => {
  if (!content) {
    return
  }
  const { zoomLevel } = page.value
  exportFile.value.image = true
  try {
    page.value.zoomLevel = 100
    await nextTick()
    const node = document.querySelector(
      `${container} .umo-page-content`,
    ) as HTMLElement
    const blob = await toBlob(node, { scale: devicePixelRatio })
    const { title } = options.value.document ?? {}
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
