<template>
  <menus-button
    ico="equal-proportion"
    :text="t('bubbleMenu.image.proportion')"
    :menu-active="editor?.getAttributes('image')?.equalProportion"
    @menu-click="toggleEqualProportion"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
import { getSelectionNode } from '@/extensions/selection'

const { editor } = useStore()

const toggleEqualProportion = () => {
  const image = editor.value ? getSelectionNode(editor.value) : null
  editor.value?.commands.updateAttributes(image.type, {
    equalProportion: !image.attrs.equalProportion,
  })
}
</script>
