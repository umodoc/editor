<template>
  <menus-button
    :text="t('bubbleMenu.code.languages')"
    menu-type="select"
    style="width: 120px"
    :select-options="languageOptions"
    :select-value="editor?.getAttributes('codeBlock')?.language"
    filterable
    @menu-click="setLanguage"
  >
  </menus-button>
</template>

<script setup>
import { languages } from 'prism-code-editor/prism'
import { getSelectionNode } from '@/extensions/selection'

const { editor } = useStore()

const languageOptions = Object.keys(languages).map((item) => {
  return { label: item, value: item }
})

const setLanguage = (language) => {
  const codeBlock = getSelectionNode(editor.value)
  editor.value.commands.updateAttributes(codeBlock.type, { language })
}
</script>
