<template>
  <editor-menus-button
    :ico="`align-${textAlign}`"
    text="文字对齐方式"
    menu-type="popup"
    hide-text
    :disabled="!editor?.can().chain().focus().setTextAlign('center').run()"
    :popup-visible="popupVisible"
    @toggle-popup="togglePopup"
  >
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
  &-group {
    padding-top: 2px;
    margin: -5px 0;
  }
}
</style>
