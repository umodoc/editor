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

<script setup lang="ts">
const props = defineProps({
  content: {
    type: Object,
    required: true,
  },
})
const { container } = useStore()
</script>

<style lang="less" scoped></style>
