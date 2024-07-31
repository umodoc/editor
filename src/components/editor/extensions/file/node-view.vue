<template>
  <node-view-wrapper
    ref="containerRef"
    class="node-view file-node-view"
    :style="{ 'justify-content': node.attrs.nodeAlign }"
  >
    <div class="node-container hover-shadow select-outline file">
      <div class="file-icon">
        <img :src="filePath" class="icon" />
      </div>
      <div class="file-info">
        <div class="file-name" :title="node.attrs.name">
          {{ node.attrs.name }}
        </div>
        <div class="file-meta">{{ prettyBytes(node.attrs.size) }}</div>
      </div>
      <div class="file-action">
        <div
          v-if="!node.attrs.uploaded && node.attrs.file !== null"
          class="action-item"
          :title="t('file.uploading')"
        >
          <icon class="loading" name="loading" />
        </div>
        <a
          v-else
          :href="node.attrs.url"
          :download="node.attrs.name"
          target="_blank"
          class="action-item"
          :title="t('file.download')"
        >
          <icon name="download" />
        </a>
      </div>
    </div>
  </node-view-wrapper>
</template>

<script setup>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { getFileIcon } from '@/utils/file'
import prettyBytes from 'pretty-bytes'

const { node, updateAttributes } = defineProps(nodeViewProps)
const { options } = useStore()
const containerRef = ref(null)
let filePath = $ref()

onMounted(async () => {
  let fileIcon = getFileIcon(node.attrs.name)
  filePath = `${options.value.cdnUrl}/icons/file/${fileIcon}.svg`
  if (node.attrs.uploaded === false && node.attrs.file) {
    try {
      const { id, url } = await options.value.onFileUpload(node.attrs.file)
      if (containerRef.value) {
        updateAttributes({ id, url, file: null, uploaded: true })
      }
    } catch (error) {
      useMessage('error', error.message)
    }
  }
})
</script>

<style lang="less">
.node-view {
  .file {
    display: inline-flex;
    align-items: center;
    padding: 12px;
    outline: solid 1px var(--umo-content-node-border);
    overflow: hidden;
    background-color: var(--umo-color-white);
    border-radius: var(--umo-content-node-radius);
    &-icon {
      width: 32px;
      height: 32px;
      margin-right: 8px;
      flex: 1;
      img {
        width: 32px;
        display: block;
      }
    }
    &-name {
      font-size: 14px;
      font-weight: 500;
      line-height: 1;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
      white-space: nowrap;
      width: 200px;
    }
    &-meta {
      font-size: 12px;
      color: var(--umo-text-color-light);
      line-height: 1;
      margin-top: 6px;
    }
    &-action {
      flex: 1;
      display: flex;
      align-items: center;
      color: var(--umo-text-color-light);
      gap: 5px;
      .action-item {
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 32px;
        width: 32px;
        background-color: var(--umo-color-white);
        box-sizing: border-box;
        cursor: pointer;
        border-radius: 50%;
        color: var(--umo-text-color-light);
        &:hover {
          border: solid 1px var(--umo-primary-color);
          color: var(--umo-primary-color);
        }
        .loading {
          animation: turn 1s linear infinite;
        }
      }
    }
  }
}
@keyframes turn {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
