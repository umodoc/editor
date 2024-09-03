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
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
defineProps({
  content: {
    type: String,
    required: true,
  },
})
const { container } = useStore()
</script>

<style lang="less" scoped></style>
