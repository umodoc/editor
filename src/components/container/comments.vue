<template>
  <!-- 
   TODO: 
    1. 每个有评论的节点后面显示一个数字，点击后打开评论列表
    2. 点击文档中的标注正文也可以打开评论
  -->
  <div v-if="visible" class="umo-comments-group-container">
    <!-- 仅显示当前节点下的所有评论 -->
    <div :style="`transform: translateY(${scrollTop}px);`">
      <div class="umo-comments-group-header">
        <div class="umo-comments-group-header-title">
          <icon name="comment" />
          <span>本节批注 / 评论 (3)</span>
        </div>
        <div class="umo-comments-group-header-actions">
          <tooltip content="关闭评论栏">
            <t-button
              size="small"
              shape="square"
              variant="text"
              @click="visible = false"
            >
              <icon name="close" />
            </t-button>
          </tooltip>
        </div>
      </div>
      <div class="umo-comments-group-body">
        <comment-panel :active="true" />
        <comment-panel :done="true" />
        <comment-panel />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'

const { page, editor } = useStore()

let visible = $ref(true)
let scrollTop = $ref(0)

// 更新位置
const updatePostion = () => {
  const { offsetTop } = useNodePostion()
  if (offsetTop === null) {
    return
  }
  visible = true
  scrollTop = offsetTop
}
watch(
  editor,
  (value: Editor | undefined) => {
    if (value) {
      editor.value?.on('selectionUpdate', updatePostion)
      editor.value?.on('focus', updatePostion)
    } else {
      visible = false
    }
  },
  { immediate: true },
)
</script>

<style lang="less" scoped>
.umo-comments-group {
  &-container {
    min-width: 250px;
    width: 250px;
    padding-right: 50px;
    position: absolute;
    right: -320px;
    top: 0;
    bottom: 0;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }
  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 20px;
    padding: 10px;
    margin-bottom: 10px;
    background-color: var(--umo-color-white);
    border-radius: var(--umo-radius);
    border: solid 1px var(--umo-border-color);
    &-title {
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: 500;
      :deep(.umo-icon) {
        margin-right: 6px;
        font-size: 18px;
      }
    }
    &-actions {
      :deep(.umo-icon) {
        font-size: 18px;
        color: var(--umo-text-color-light);
      }
    }
  }
  &-body {
    :deep(.umo-comment-container) {
      &:not(last-child) {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
