<template>
  <menus-button
    ico="image-preview"
    text="图片预览"
    @button-click="viewerVisible = !viewerVisible"
  />
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
