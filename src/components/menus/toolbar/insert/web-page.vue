<template>
  <menus-button
    ico="web-page"
    text="网页"
    huge
    @menu-click="dialogVisible = true"
  >
    <modal
      :visible="dialogVisible"
      icon="web-page"
      title="插入网页"
      width="480px"
      confirmBtn="插入"
      @confirm="insertWebPage"
      @close="dialogVisible = false"
    >
      <div class="web-page-container">
        <div class="web-page-tip">某些网页可能不支持嵌入。</div>
        <t-input
          v-model.trim="url"
          :status="error ? 'error' : 'default'"
          type="url"
          clearable
          placeholder="请输入网页地址，以 http:// 或 https:// 开头"
        />
      </div>
    </modal>
  </menus-button>
</template>

<script setup>
const { editor } = useStore()

let dialogVisible = $ref(false)
let url = $ref('')
let error = $ref(false)

const insertWebPage = () => {
  if (!editor.value) return
  if (
    url === '' ||
    (!url.startsWith('http://') && !url.startsWith('https://'))
  ) {
    error = true
    return
  }
  editor.value
    ?.chain()
    .focus()
    .setParagraph()
    .setIframe({
      src: url,
    })
    .run()
  error = false
  dialogVisible = false
}
watch(
  () => dialogVisible,
  (val) => {
    if (!val) {
      url = ''
      error = false
    }
  },
)
</script>

<style lang="less" scoped>
.web-page {
  &-container {
    padding: 2px;
  }
  &-tip {
    color: var(--umo-text-color-light);
    margin-bottom: 10px;
  }
}
</style>
