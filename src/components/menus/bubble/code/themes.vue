<template>
  <menus-button
    :text="t('bubbleMenu.code.themes.text')"
    menu-type="select"
    style="width: 100px"
    :select-options="themes"
    :select-value="editor?.getAttributes('codeBlock')?.theme"
    @menu-click="setTheme"
  />
</template>

<script setup>
const { editor } = useStore()

const themes = [
  { label: t('bubbleMenu.code.themes.dark'), value: 'dark' },
  { label: t('bubbleMenu.code.themes.light'), value: 'light' },
]

const setTheme = (theme) => {
  const codeBlock = editor.value.commands.getSelectionNode()
  editor.value.commands.updateAttributes(codeBlock.type, { theme })
}
</script>
