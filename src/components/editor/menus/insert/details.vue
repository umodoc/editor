<template>
  <editor-menus-button
    :button-active="editor?.isActive('details')"
    :disabled="!editor?.can().setDetails()"
    huge-button
    @button-click="editor?.chain().focus().setDetails().run()"
  >
    <icon name="details" />
    <template #text>
      <p class="button-text">详情</p>
    </template>
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
</script>
