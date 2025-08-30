<template>
  <component
    :is="h(Dialog, { ...$attrs, attach: container, ref: changeRef }, $slots)"
  />
</template>

<script setup lang="ts">
import { Dialog } from 'tdesign-vue-next'
// @ts-ignore
import { h } from 'vue'

const container = inject('container', 'body')
const vm = getCurrentInstance()
const changeRef = (expose: any) => (vm.expose = expose)
</script>
