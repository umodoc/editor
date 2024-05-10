<template>
  <editor-menus-button huge-button @button-click="dialogVisible = true">
    <icon name="share" />
    <template #text>
      <p class="button-text">文档分享</p>
    </template>
  </editor-menus-button>
  <modal
    :visible="dialogVisible"
    icon="share"
    title="文档分享"
    width="420px"
    confirmBtn="复制"
    @confirm="copyLink"
    @close="dialogVisible = false"
  >
    <div class="share-container">
      <div class="share-tip">复制链接发给需要分享的人。</div>
      <t-textarea
        class="share-textarea"
        :value="options.shareUrl"
        readonly
        autosize
      ></t-textarea>
    </div>
  </modal>
</template>

<script setup>
const { options } = useStore()
let dialogVisible = $ref(false)

const copyLink = () => {
  const { copy } = useClipboard({ source: options.value.shareUrl })
  copy()
  useMessage('success', '链接已复制到剪切板')
  dialogVisible = false
}
</script>

<style lang="less" scoped>
.share-container {
  padding: 2px;
  .share-tip {
    font-size: 12px;
    color: var(--umo-text-color-light);
    margin-bottom: 6px;
    line-height: 1.4;
  }
  .share-textarea {
    :deep(textarea) {
      word-break: break-all;
      word-wrap: break-word;
    }
  }
}
</style>
