<template>
  <menus-button
    ico="image"
    :text="t('insert.image.text')"
    menu-type="popup"
    huge
    :popup-visible="popupVisible"
    @toggle-popup="togglePopup"
  >
    <template #content>
      <div class="umo-image-dropdown">
        <div
          v-for="item in imageOptions"
          :key="item.value"
          class="umo-image-item"
          :title="item.title"
          @click="menuClick(item.value)"
        >
          <div class="umo-image-item-title">{{ item.title }}</div>
          <div
            v-if="item.description && item.description !== ''"
            class="umo-image-item-description"
          >
            {{ item.description }}
          </div>
        </div>
      </div>
    </template>
  </menus-button>
</template>

<script setup lang="ts">
const { popupVisible, togglePopup } = usePopup()

const container = inject('container')
const editor = inject('editor')
const uploadFileMap = inject('uploadFileMap')

const imageOptions = [
  {
    title: t('insert.image.block'),
    value: 'image',
    description: t('insert.image.blockdesc'),
  },
  {
    title: t('insert.image.inline'),
    value: 'inlineImage',
    description: t('insert.image.inlinedesc'),
  },
]

const menuClick = (type) => {
  editor.value
    ?.chain()
    .focus()
    .selectFiles(type, container.value, uploadFileMap.value)
    .run()
  popupVisible.value = false
}
</script>
<style lang="less" scoped>
.umo-image-dropdown {
  width: 180px;

  .umo-image-item {
    padding: 4px 12px;
    cursor: pointer;
    border-radius: var(--umo-radius);
    &:hover {
      background-color: var(--td-bg-color-container-hover);
    }
    &-title {
      display: flex;
      align-items: center;
      font-size: 14px;
    }
    &-description {
      color: var(--umo-text-color-light);
      white-space: normal;
      line-height: 1.4;
      margin-top: 3px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}
</style>
