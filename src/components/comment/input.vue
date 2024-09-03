<template>
  <div class="umo-comment-container">
    <t-comment
      :avatar="user.avatarUrl || options.user?.avatarUrl"
      :author="user.nickName || options.user?.nickName || '未知用户'"
    >
      <template #content>
        <div class="umo-comment-form">
          <t-textarea
            v-model="comment"
            size="small"
            placeholder="请输入评论内容"
            autosize
            autofocus
          />
          <div class="umo-comment-buttons">
            <t-button
              class="umo-comment-button"
              :disabled="comment === ''"
              @click="submitComment"
            >
              回复
            </t-button>
            <t-button
              theme="default"
              class="umo-comment-button"
              variant="text"
              @click="closeComment"
            >
              取消
            </t-button>
          </div>
        </div>
      </template>
    </t-comment>
  </div>
</template>

<script setup lang="ts">
const { options, editor, commentBox } = useStore()

const props = defineProps({
  user: {
    type: Object,
    default: () => ({}),
  },
})

const comment = $ref('')
const submitComment = () => {
  console.log(comment)
  closeComment()
}
const closeComment = () => {
  commentBox.value = false
  editor.value?.commands.focus()
}
</script>

<style lang="less" scoped>
.umo-comment {
  &-container {
    width: 300px;
    padding: 5px 3px 6px;
    :deep(.umo-comment__inner) {
      .umo-comment {
        &__avatar {
          margin-right: 10px;
          cursor: default;
          img {
            width: 48px;
            height: 48px;
          }
        }
        &__name {
          cursor: default;
          font-size: 14px;
        }
      }
    }
  }
  &-form {
    .umo-comment-buttons {
      margin-top: 10px;
      :deep(.umo-button) {
        margin-right: 10px;
        padding: 0 15px;
        height: 28px;
        font-size: 12px;
      }
    }
  }
}
</style>
