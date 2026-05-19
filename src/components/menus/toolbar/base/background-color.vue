<template>
  <menus-button
    :text="text || t('base.bgColor')"
    menu-type="popup"
    popup-handle="arrow"
    hide-text
    :disabled="!editor?.can().chain().focus().setBackgroundColor().run()"
    :popup-visible="popupVisible"
    @toggle-popup="togglePopup"
  >
    <icon
      name="background-color"
      class="umo-icon-background-color"
      :style="{
        background: editor?.getAttributes('highlight')?.color || currentColor,
      }"
    />
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
    default: '',
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
    editor.value?.chain().focus().unsetBackgroundColor().run()
  } else {
    editor.value?.chain().focus().setBackgroundColor(color).run()
  }
}
</script>

<style lang="scss" scoped>
.umo-icon-background-color {
  border-radius: 2px;
}
</style>
