<template>
  <editor-menus-button
    tooltip="语言列表"
    button-type="select"
    style="width: 120px"
    :select-options="languageOptions"
    :value="editor?.getAttributes('codeBlock')?.language"
    placeholder="清选择"
    filterable
    @button-click="setLanguage"
  >
  </editor-menus-button>
</template>

<script setup>
import { languages } from 'prism-code-editor/prism'

const { editor } = useStore()

const languageOptions = Object.keys(languages).map((item) => {
  return { label: item, value: item }
})

const setLanguage = (language) => {
  const codeBlock = editor.value.commands.getSelectionNode()
  codeBlock.props.updateAttributes({ language })
}
</script>
