<template>
  <menus-button
    ico="color"
    :text="text || t('base.color')"
    menu-type="popup"
    popup-handle="arrow"
    hide-text
    :popup-visible="popupVisible"
    :disabled="!editor?.can().chain().focus().setColor().run()"
    @toggle-popup="togglePopup"
    @menu-click="colorChange(currentColor)"
  >
    <div
      class="umo-current-color"
      :style="{
        background: editor?.getAttributes('textStyle')?.color || currentColor,
      }"
    ></div>
    <template #content>
      <picker-color :default-color="defaultColor" @change="colorChange" />
    </template>
  </menus-button>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    default: '',
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

const { popupVisible, togglePopup } = usePopup()
const editor = inject('editor')

let currentColor = $ref()
const colorChange = (color) => {
  currentColor = color
  popupVisible.value = false

  if (props.modeless) {
    emits('change', currentColor)
    return
  }

  if (color === '') {
    editor.value?.chain().focus().unsetColor().run()
  } else {
    editor.value?.chain().focus().setColor(color).run()
  }
}
</script>

<style lang="scss" scoped>
.umo-current-color {
  width: 12px;
  height: 2px;
  position: absolute;
  margin: 0 0 -22px 2px;
}
</style>
