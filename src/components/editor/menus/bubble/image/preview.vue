<template>
  <editor-menus-button
    tooltip="图片预览"
    @button-click="viewerVisible = !viewerVisible"
  >
    <icon name="image-preview" />
  </editor-menus-button>
  <t-image-viewer
    v-model:visible="viewerVisible"
    :images="[editor?.getAttributes('image').src]"
  >
  </t-image-viewer>
</template>

<script setup>
const { editor } = useStore()
const viewerVisible = $ref(false)
</script>
