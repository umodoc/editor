<template>
  <menus-button
    ico="zoom-auto"
    :text="t('view.zoomAuto')"
    huge
    shortcut="Ctrl+0"
    @menu-click="autoWidth"
  />
</template>

<script setup>
const page = inject('page')
const container = inject('container')

const autoWidth = () => {
  const autoWidthBtn = document.querySelector(
    `${container} .umo-auto-width-button`,
  )
  if (autoWidthBtn) {
    autoWidthBtn.click()
  }
}
</script>
