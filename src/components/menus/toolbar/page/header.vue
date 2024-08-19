<template>
  <menus-button
    ico="page-header"
    :text="page.header ? t('page.footer.hide') : t('page.footer.show')"
    huge
    @menu-click="page.header = !page.header"
  />
</template>

<script setup>
const { page } = useStore()
</script>
