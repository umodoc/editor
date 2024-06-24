<template>
  <menus-button
    ico="embed"
    :text="t('export.embed.text')"
    huge
    @menu-click="dialogVisible = true"
  />
  <modal
    :visible="dialogVisible"
    icon="embed"
    :header="t('export.embed.title')"
    width="460px"
    :confirmBtn="t('export.embed.copy')"
    @confirm="copyEmbed"
    @close="dialogVisible = false"
  >
    <div class="embed-container">
      <div class="embed-tip" v-text="t('export.embed.tip')"></div>
      <t-textarea
        class="embed-textarea"
        :value="embedValue"
        readonly
        autosize
      ></t-textarea>
    </div>
  </modal>
</template>

<script setup>
const { options } = useStore()
let dialogVisible = $ref(false)

const embedValue = computed(() => {
  return `<iframe src="${options.value.shareUrl}" width="100%" height="720px" frameborder="0" allowfullscreen="true"></iframe>`
})

const copyEmbed = () => {
  const { copy } = useClipboard({ source: embedValue })
  copy()
  useMessage('success', t('export.embed.copied'))
  dialogVisible = false
}
</script>

<style lang="less" scoped>
.embed-container {
  padding: 2px;
  .embed-tip {
    font-size: 12px;
    color: var(--umo-text-color-light);
    margin-bottom: 6px;
    line-height: 1.4;
  }
  .embed-textarea {
    :deep(textarea) {
      word-break: break-all;
      word-wrap: break-word;
    }
  }
}
</style>
