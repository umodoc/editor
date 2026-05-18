<template>
  <menus-button
    :text="t('view.zoom')"
    ico="zoom"
    menu-type="dropdown"
    huge
    :select-options="zooms"
    @click="setZoomLevel"
  />
</template>

<script setup>
const page = inject('page')

const zooms = [
  { content: '75%', value: 75 },
  { content: '100%', value: 100 },
  { content: '125%', value: 125 },
  { content: '150%', value: 150 },
  { content: '200%', value: 200 },
  { content: '300%', value: 300 },
  { content: '400%', value: 400 },
  { content: '500%', value: 500 },
]

const setZoomLevel = ({ value }) => {
  if (value) {
    page.value.zoomLevel = value
  }
}
</script>
