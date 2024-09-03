<template>
  <menus-button
    ico="comment"
    :text="t('comment.text')"
    @menu-click="openCommentBox"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { editor, commentBox } = useStore()
const openCommentBox = () => {
  commentBox.value = true
  editor.value.commands.focus()
}
</script>

<style lang="less" scoped></style>
