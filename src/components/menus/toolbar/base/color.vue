<template>
  <menus-button
    ico="color"
    :text="text || t('base.color')"
    menu-type="popup"
    popup-handle="arrow"
    hide-text
    :popup-visible="popupVisible"
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
      <color-picker :default-color="defaultColor" @change="colorChange" />
    </template>
  </menus-button>
</template>

<script setup lang="ts">
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

let currentColor = $ref<string | undefined>()
const colorChange = (color: string) => {
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

<style lang="less" scoped>
.umo-current-color {
  width: 12px;
  height: 2px;
  position: absolute;
  margin: 0 0 -22px 2px;
}
</style>
