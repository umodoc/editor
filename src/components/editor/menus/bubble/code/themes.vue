<template>
  <editor-menus-button
    text="主题"
    menu-type="select"
    style="width: 100px"
    :select-options="themes"
    :value="editor?.getAttributes('codeBlock')?.theme"
    placeholder="清选择"
    @button-click="setTheme"
  />
</template>

<script setup>
const { editor } = useStore()

const themes = [
  { label: '暗色主题', value: 'dark' },
  { label: '浅色主题', value: 'light' },
]

const setTheme = (theme) => {
  const codeBlock = editor.value.commands.getSelectionNode()
  codeBlock.props.updateAttributes({ theme })
}
</script>
