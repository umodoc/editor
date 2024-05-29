<template>
  <menus-button
    ico="embed"
    text="Embed"
    huge
    @button-click="dialogVisible = true"
  />
  <modal
    :visible="dialogVisible"
    icon="embed"
    title="Embed 嵌入"
    width="420px"
    confirmBtn="复制"
    @confirm="copyEmbed"
    @close="dialogVisible = false"
  >
    <div class="embed-container">
      <div class="embed-tip">
        复制后，请手动修改 &lt;iframe&gt; 的宽度和高度，以便获得更好的浏览效果。
      </div>
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
  useMessage('success', '代码已复制到剪切板')
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
