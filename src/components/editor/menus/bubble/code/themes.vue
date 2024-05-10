<template>
  <editor-menus-button
    tooltip="主题"
    button-type="select"
    style="width: 100px"
    :select-options="themes"
    :value="editor?.getAttributes('codeBlock')?.theme"
    placeholder="清选择"
    @button-click="setTheme"
  >
  </editor-menus-button>
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
