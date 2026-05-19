<template>
  <div class="umo-bubble-tag-input">
    <t-input
      v-model.trim="value"
      type="search"
      size="small"
      :placeholder="t('bubbleMenu.tag.placeholder')"
      :status="value === '' ? 'error' : 'default'"
      @enter="onInput"
    >
      <template #suffixIcon>
        <icon name="plus" size="14" @click="onInput(value)" />
      </template>
    </t-input>
  </div>
</template>

<script setup>
const editor = inject('editor')
let value = $ref('')

const setValue = () => {
  const attrs = editor.value?.getAttributes('tag')
  if (attrs?.text) {
    value = attrs.text
  }
}

onMounted(() => {
  setValue()
  editor.value?.on('selectionUpdate', setValue)
})

onBeforeUnmount(() => {
  editor.value?.off('selectionUpdate', setValue)
})

const onInput = (value) => {
  if (value === '') {
    return
  }
  const tag = editor.value?.state?.selection?.$from?.node()
  if (tag) {
    editor.value?.commands.updateAttributes('tag', { text: value })
  }
}
</script>

<style lang="scss" scoped>
.umo-bubble-tag-input {
  margin-right: 8px;
  width: 120px;
  :deep(.umo-input__suffix) {
    margin-right: -3px;
    cursor: pointer;
  }
}
</style>
