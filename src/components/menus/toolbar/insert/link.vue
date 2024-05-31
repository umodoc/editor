<template>
  <menus-button
    ico="link"
    text="链接"
    huge
    @menu-click="dialogVisible = true"
  />
  <modal
    :visible="dialogVisible"
    icon="link"
    title="插入链接"
    width="420px"
    draggable
    destroy-on-close
    confirmBtn="插入"
    @confirm="insertLink"
    @close="dialogVisible = false"
  >
    <div class="link-container">
      <t-form label-align="top">
        <t-form-item label="链接文本：">
          <t-input
            v-model.trim="text"
            :status="error.text ? 'error' : 'default'"
            placeholder="请输入链接文本"
            clearable
          />
        </t-form-item>
        <t-form-item label="链接地址：">
          <t-input
            v-model="href"
            :status="error.href ? 'error' : 'default'"
            type="url"
            clearable
            placeholder="请输入链接地址，一般以 http:// 或 https:// 开头"
          />
        </t-form-item>
      </t-form>
    </div>
  </modal>
</template>

<script setup>
const { editor } = useStore()
let dialogVisible = $ref(false)

let text = $ref('')
let href = $ref('')
let error = $ref({ text: false, href: false })
const insertLink = () => {
  if (text === '') {
    error.text = true
    return
  }
  if (
    !href.startsWith('http://') &&
    !href.startsWith('https://') &&
    !href.startsWith('ftp://') &&
    !href.startsWith('ftps://') &&
    !href.startsWith('mailto://')
  ) {
    error.href = true
    return
  }
  error.text = false
  error.href = false
  editor.value?.commands.setLink({ href, target: '_blank' })
  editor.value?.chain().focus().insertContent(text).run()
  dialogVisible = false
}
watch(
  () => dialogVisible,
  (val) => {
    if (val) {
      text = editor.value.commands.getSelectionText()
      href = editor.value.getAttributes('link').href || ''
    } else {
      text = ''
      href = ''
      error.text = false
      error.href = false
    }
  },
)
</script>

<style lang="less" scoped>
.link {
  &-container {
    padding: 2px;
    :deep(.umo-form__item) {
      &:not(:last-child) {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
