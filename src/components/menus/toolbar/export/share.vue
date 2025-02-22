<template>
  <menus-button
    ico="share"
    :text="t('export.share.text')"
    huge
    @menu-click="dialogVisible = true"
  />
  <modal
    :visible="dialogVisible"
    icon="share"
    :header="t('export.share.text')"
    width="420px"
    :confirm-btn="t('export.share.copy')"
    @confirm="copyLink"
    @close="dialogVisible = false"
  >
    <div class="umo-share-container">
      <div class="umo-share-tip" v-text="t('export.share.tip')"></div>
      <t-textarea
        class="umo-share-textarea"
        :value="options.shareUrl"
        readonly
        autosize
      ></t-textarea>
    </div>
  </modal>
</template>

<script setup lang="ts">
const options = inject('options')
const container = inject('container')
let dialogVisible = $ref(false)

const copyLink = () => {
  const { copy } = useClipboard({ source: options.value.shareUrl })
  void copy()
  useMessage('success', {
    attach: container,
    content: t('export.share.copied'),
  })
  dialogVisible = false
}
</script>

<style lang="less" scoped>
.umo-share-container {
  padding: 2px;
  .umo-share-tip {
    font-size: 12px;
    color: var(--umo-text-color-light);
    margin-bottom: 6px;
    line-height: 1.4;
  }
  .umo-share-textarea {
    :deep(textarea) {
      word-break: break-all;
      word-wrap: break-word;
    }
  }
}
</style>
