<template>
  <editor-menus-button
    tooltip="文字对齐方式"
    button-type="popup"
    :disabled="!editor?.can().chain().focus().setTextAlign('center').run()"
    :popup-visible="popupVisible"
    @toggle-popup="togglePopup"
  >
    <icon :name="`align-${textAlign}`" class="text-align" />
    <template #content>
      <div class="text-align-group">
        <editor-menus-base-align-left />
        <editor-menus-base-align-center />
        <editor-menus-base-align-right />
        <editor-menus-base-align-justify />
        <editor-menus-base-align-distributed />
      </div>
    </template>
  </editor-menus-button>
</template>

<script setup>
let { popupVisible, togglePopup } = usePopup()

const { editor } = useStore()

const textAlign = computed(() => {
  if (!editor.value) {
    return 'left'
  }
  if (editor.value.isActive({ textAlign: 'justify' })) {
    return 'left'
  }
  if (editor.value.isActive({ textAlign: 'center' })) {
    return 'center'
  }
  if (editor.value.isActive({ textAlign: 'right' })) {
    return 'right'
  }
  if (editor.value.isActive({ textAlign: 'justify' })) {
    return 'justify'
  }
  return 'left'
})
</script>

<style lang="less" scoped>
.text-align {
  font-size: 16px;
  &-group {
    padding-top: 2px;
    margin: -5px 0;
  }
}
</style>
