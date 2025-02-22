<template>
  <menus-button
    ico="page-footer"
    :text="page.footer ? t('page.footer.hide') : t('page.footer.show')"
    huge
    @menu-click="page.footer = !page.footer"
  />
</template>

<script setup lang="ts">
const page = inject('page')
</script>
