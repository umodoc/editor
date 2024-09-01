<template>
  <div class="umo-comment-container" :class="{ active, done }">
    <div class="umo-comment-header">
      <div class="umo-comment-header-quote">
        Umo Editor 是一个基于 Vue3 和 Tiptap
        的适合于国人使用的本土化开源文档编辑器
      </div>
      <div class="umo-comment-header-actions">
        <tooltip content="将该项标为已解决">
          <t-button
            :class="{ done }"
            size="small"
            shape="square"
            variant="text"
            @click="markAsDone"
          >
            <icon name="check" />
          </t-button>
        </tooltip>
      </div>
    </div>
    <div class="umo-comment-body">
      <t-comment
        class="umo-comment-item"
        avatar="https://tdesign.gtimg.com/site/avatar.jpg"
        author="张三"
        datetime="今天16:38"
        content="这里是评论者写的评论内容,这里是评论者写的评论内容。"
      >
        <template #actions>
          <tooltip content="编辑此评论">
            <span @click="editComment"><icon name="edit" /></span>
          </tooltip>
          <tooltip content="回复此评论">
            <span @click="replyComment"><icon name="reply" /></span>
          </tooltip>
          <tooltip content="删除此评论">
            <span @click="deleteComment"><icon name="node-delete" /></span>
          </tooltip>
        </template>
        <!-- 回复评论 -->
        <template v-if="active" #reply>
          <t-textarea
            v-model="comment"
            class="umo-comment-reply"
            size="small"
            placeholder="Enter 发送, Shift+Enter 换行"
            autosize
            autofocus
          />
        </template>
      </t-comment>
      <div v-if="!active" class="umo-comment-divider">中间省略了 2 条评论</div>
      <t-comment
        class="umo-comment-item"
        avatar="https://tdesign.gtimg.com/site/avatar.jpg"
        author="李四"
        datetime="今天16:38"
        content="2222222"
      >
        <template #quote>
          <t-popup>
            <div class="umo-comment-reply-info">
              回复@张三：这里是评论者写的评论内容,这里是评论者写的评论内容。
            </div>
            <template #content>
              <div class="umo-comment-reply-detail">
                这里是评论者写的评论内容,这里是评论者写的评论内容。
              </div>
            </template>
          </t-popup>
        </template>
      </t-comment>
      <!-- 发布新评论 -->
      <t-textarea
        v-if="active"
        v-model="comment"
        class="umo-comment-reply"
        size="small"
        placeholder="Enter 发送, Shift+Enter 换行"
        autosize
        autofocus
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  active: {
    type: Boolean,
    default: false,
  },
  done: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['done'])

const comment = $ref('')

const markAsDone = () => {
  emits('done')
}

const editComment = () => {
  console.log('edit')
}
const replyComment = () => {
  console.log('reply')
}
const deleteComment = () => {
  console.log('delete')
}
const createComment = () => {
  console.log('create')
}
</script>

<style lang="less" scoped>
.umo-comment {
  &-container {
    background-color: var(--umo-color-white);
    border-radius: var(--umo-radius);
    border: solid 1px var(--umo-border-color);
    padding: 12px 15px 15px;
    &.active {
      border-color: var(--umo-primary-color);
      box-shadow: var(--umo-shadow);
    }
    &.done {
      border-color: #17cd81;
      background-color: #00ff4c0f;
    }
  }
  &-header {
    display: flex;
    align-items: center;
    padding-bottom: 13px;
    &-quote {
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
      white-space: nowrap;
      font-size: 12px;
      line-height: 14px;
      color: var(--umo-text-color-light);
      padding: 0 10px;
      position: relative;
      opacity: 0.8;
      &::before {
        content: '';
        display: block;
        height: 14px;
        width: 4px;
        background-color: var(--umo-text-color-light);
        border-radius: 2px;
        position: absolute;
        left: 0;
      }
    }
    &-actions {
      --td-comp-size-xs: 20px;
      :deep(.umo-button) {
        color: var(--umo-text-color-light);
        &.done {
          color: #15b371;
        }
        .umo-icon {
          font-size: 14px;
        }
      }
    }
  }
  &-body {
    position: relative;
  }
}
.umo-comment-item {
  position: relative;
  &:not(:last-child) {
    margin-bottom: 12px;
    border-bottom: solid 1px var(--umo-border-color-light);
    padding-bottom: 12px;
  }
  :deep(.umo-comment__inner) {
    .umo-comment {
      &__avatar {
        margin-right: 12px;
        cursor: default;
        img {
          width: 32px;
          height: 32px;
        }
      }
      &__author {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 5px;
      }
      &__name {
        font-size: 14px;
        cursor: default;
      }
      &__time {
        padding: 0;
      }
      &__detail {
        font-size: 12px;
        word-break: break-all;
        word-wrap: break-word;
        line-height: 1.6;
      }
      &__quote {
        margin-top: 6px;
        border: none;
        padding: 3px 8px;
        border-radius: var(--umo-radius);
        background-color: var(--umo-content-node-selected-background);
        cursor: pointer;
        &:hover {
          background-color: var(--umo-button-hover-background);
        }
      }
      &__actions {
        position: absolute;
        top: 0;
        right: 0;
        gap: 2px;
        margin-top: 2px;
        display: none;
        .umo-button {
          margin: 0 !important;
          height: 20px;
          width: 20px;
          padding: 0;
          color: #999;
        }
      }
    }
  }
  :deep(.umo-comment__reply) {
    margin: 10px 0 0;
    background: none;
    padding: 0;
  }
  &:hover {
    :deep(.umo-comment__inner) {
      .umo-comment__actions {
        display: flex !important;
      }
      .umo-comment__time {
        display: none;
      }
    }
  }
}
.umo-comment-divider {
  margin: 12px 0;
  font-size: 12px;
  text-align: center;
  color: var(--umo-primary-color);
  border-bottom: solid 1px var(--umo-border-color-light);
  padding-bottom: 10px;
  cursor: pointer;
}
.umo-comment-reply {
  :deep(.umo-textarea__inner) {
    font-size: 12px;
    line-height: 1.6;
  }
  &-info {
    width: 154px;
    font-size: 12px;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    white-space: nowrap;
    box-sizing: border-box;
    color: var(--umo-text-color-light);
  }
  &-detail {
    font-size: 12px;
    padding: 8px 10px;
    max-width: 154px;
    line-height: 1.4;
    word-break: break-all;
    word-wrap: break-word;
  }
}
</style>
