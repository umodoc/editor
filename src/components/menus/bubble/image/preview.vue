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

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { editor } = useStore()
const viewerVisible = $ref(false)
</script>
