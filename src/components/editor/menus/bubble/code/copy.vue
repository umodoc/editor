<template>
  <editor-menus-button tooltip="复制代码" @button-click="copyCode">
    <icon name="copy" />
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()

const copyCode = () => {
  const codeBlock = editor.value.commands.getSelectionNode()
  const { copy } = useClipboard({
    source: ref(codeBlock.props.node.attrs.code),
  })
  copy()
  useMessage('success', '代码已复制到剪切板')
}
</script>
