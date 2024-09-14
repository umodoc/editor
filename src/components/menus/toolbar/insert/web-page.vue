<template>
  <menus-button
    ico="web-page"
    :text="t('insert.web.text')"
    huge
    @menu-click="dialogVisible = true"
  >
    <modal
      :visible="dialogVisible"
      icon="web-page"
      :header="t('insert.web.title')"
      width="480px"
      :confirm-btn="t('insert.web.insert')"
      @confirm="insertWebPage"
      @close="dialogVisible = false"
    >
      <div class="umo-web-page-container">
        <div class="umo-web-page-tip" v-text="t('insert.web.tip')"></div>
        <t-input
          v-model.trim="url"
          :status="error ? 'error' : 'default'"
          type="url"
          clearable
          :placeholder="t('insert.web.placeholder')"
        />
      </div>
    </modal>
  </menus-button>
</template>

<script setup lang="ts">
const { editor } = useStore()

let dialogVisible = $ref(false)
let url = $ref('')
let error = $ref(false)

const insertWebPage = () => {
  if (!editor.value) {
    return
  }
  if (
    url === '' ||
    (!url.startsWith('http://') && !url.startsWith('https://'))
  ) {
    error = true
    return
  }
  editor.value
    .chain()
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
  (val: boolean) => {
    if (!val) {
      url = ''
      error = false
    }
  },
)
</script>

<style lang="less" scoped>
.umo-web-page {
  &-container {
    padding: 2px;
  }
  &-tip {
    color: var(--umo-text-color-light);
    margin-bottom: 10px;
  }
}
</style>
