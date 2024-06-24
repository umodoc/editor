<template>
  <menus-button
    ico="image-preview"
    :text="t('bubbleMenu.image.preview')"
    @menu-click="viewerVisible = !viewerVisible"
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
