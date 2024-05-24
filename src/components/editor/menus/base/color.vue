<template>
  <editor-menus-button
    ico="color"
    :text="text"
    menu-type="popup"
    popup-handle="arrow"
    hide-text
    :popup-visible="popupVisible"
    @toggle-popup="togglePopup"
    @button-click="colorChange(currentColor)"
  >
    <div
      class="current-color"
      :style="{
        background: editor?.getAttributes('textStyle')?.color || currentColor,
      }"
    ></div>
    <template #content>
      <toolbar-color-picker
        :default-color="defaultColor"
        @change="colorChange"
      />
    </template>
  </editor-menus-button>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    default: '字体颜色',
  },
  modeless: {
    type: Boolean,
    default: false,
  },
  defaultColor: {
    type: String,
    default: '#000',
  },
})
const emits = defineEmits(['change'])

let { popupVisible, togglePopup } = usePopup()
const { editor } = useStore()

let currentColor = $ref()
const colorChange = (color) => {
  currentColor = color
  popupVisible.value = false

  if (props.modeless) {
    emits('change', currentColor)
    return
  }

  if (color !== '') {
    editor.value?.chain().focus().setColor(color).run()
  } else {
    editor.value?.chain().focus().unsetColor().run()
  }
}
</script>

<style lang="less" scoped>
.current-color {
  width: 12px;
  height: 2px;
  position: absolute;
  margin: 0 0 -22px 2px;
}
</style>
