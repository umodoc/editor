<template>
  <menus-button
    ico="link"
    :text="t('insert.link.text')"
    huge
    @menu-click="dialogVisible = true"
  />
  <modal
    :visible="dialogVisible"
    icon="link"
    :header="t('insert.link.title')"
    width="420px"
    draggable
    destroy-on-close
    :confirm-btn="t('insert.link.insert')"
    @confirm="insertLink"
    @close="dialogVisible = false"
  >
    <div class="umo-link-container">
      <t-form label-align="top">
        <t-form-item :label="t('insert.link.hrefText')">
          <t-input
            v-model.trim="text"
            :status="error.text ? 'error' : 'default'"
            :placeholder="t('insert.link.hrefTextTip')"
            clearable
          />
        </t-form-item>
        <t-form-item :label="t('insert.link.href')">
          <t-input
            v-model="href"
            :status="error.href ? 'error' : 'default'"
            type="url"
            clearable
            :placeholder="t('insert.link.hrefTip')"
          />
        </t-form-item>
      </t-form>
    </div>
  </modal>
</template>

<script setup lang="ts">
import { getSelectionText } from '@/extensions/selection'

const { editor } = useStore()
let dialogVisible = $ref(false)

let text = $ref('')
let href = $ref('')
const error = $ref({ text: false, href: false })
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
  (val: boolean) => {
    if (val) {
      text = editor.value ? getSelectionText(editor.value) : ''
      href = editor?.value?.getAttributes('link').href ?? ''
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
.umo-link-container {
  padding: 2px;
  :deep(.umo-form__item) {
    &:not(:last-child) {
      margin-bottom: 10px;
    }
  }
}
</style>
