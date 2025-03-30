<template>
  <menus-button
    ico="link"
    :text="t('insert.link.text')"
    menu-type="popup"
    huge
    :popup-visible="popupVisible"
    @toggle-popup="togglePopup"
  >
    <template #content>
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
          <t-form-item>
            <t-button theme="primary" type="submit" @click="insertLink">{{
              t('insert.link.insert')
            }}</t-button>
            <t-button
              theme="default"
              variant="text"
              style="margin-left: 10px"
              @click="removeLink"
              >{{ t('insert.link.remove') }}</t-button
            >
          </t-form-item>
        </t-form>
      </div>
    </template>
  </menus-button>
</template>

<script setup lang="ts">
import { getSelectionText } from '@/extensions/selection'

const { popupVisible, togglePopup } = usePopup()
const editor = inject('editor')

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
  popupVisible.value = false
}
const removeLink = () => {
  editor.value?.chain().focus().unsetLink().run()
  popupVisible.value = false
}

watch(
  () => popupVisible.value,
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
  padding: 0 2px 2px;
  margin-top: -6px;
  width: 320px;
  :deep(.umo-form__item) {
    margin-bottom: 5px;
    &:last-child {
      margin-top: 15px;
    }
  }
}
</style>
