<template>
  <menus-button
    text="语言列表"
    menu-type="select"
    style="width: 120px"
    :select-options="languageOptions"
    :value="editor?.getAttributes('codeBlock')?.language"
    placeholder="清选择"
    filterable
    @button-click="setLanguage"
  >
  </menus-button>
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
