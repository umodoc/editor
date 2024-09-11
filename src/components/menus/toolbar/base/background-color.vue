<template>
  <menus-button
    :text="text"
    menu-type="popup"
    popup-handle="arrow"
    hide-text
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
      <color-picker :default-color="defaultColor" @change="colorChange" />
    </template>
  </menus-button>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  text: {
    type: String,
    // eslint-disable-next-line vue/valid-define-props
    default: t('base.bgColor'),
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
const { editor } = useStore()

let currentColor = $ref<string | undefined>()

const colorChange = (color: string) => {
  currentColor = color
  popupVisible.value = false

  if (props.modeless) {
    emits('change', currentColor)
    return
  }

  if (color === '') {
    editor.value?.chain().focus().unsetHighlight().run()
  } else {
    editor.value?.chain().focus().setHighlight({ color }).run()
  }
}
</script>

<style lang="less" scoped>
.umo-icon-background-color {
  border-radius: 2px;
}
</style>
