<template>
  <t-tooltip
    :content="content"
    theme="light"
    placement="top"
    :attach="container"
    :show-arrow="false"
    destroy-on-close
  >
    <slot />
  </t-tooltip>
</template>

<script setup>
const props = defineProps({
  content: {},
})
const { container } = useStore()
</script>

<style lang="less" scoped></style>
