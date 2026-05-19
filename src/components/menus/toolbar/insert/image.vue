<template>
  <menus-button
    ico="image"
    :text="t('insert.image.text')"
    menu-type="dropdown"
    huge
    overlay-class-name="umo-image-dropdown"
  >
    <template #dropmenu>
      <t-dropdown-menu>
        <t-dropdown-item
          v-for="item in imageOptions"
          :key="item.value"
          :value="item.value"
          @click="insertImage(item.value)"
        >
          <icon :name="item.icon" class="umo-image-dropdown-icon" />
          <div>
            <div class="umo-image-dropdown-title">{{ item.title }}</div>
            <div class="umo-image-dropdown-description">
              {{ item.description }}
            </div>
          </div>
        </t-dropdown-item>
      </t-dropdown-menu>
    </template>
  </menus-button>
</template>

<script setup>
const container = inject('container')
const editor = inject('editor')
const uploadFileMap = inject('uploadFileMap')

const imageOptions = [
  {
    title: t('insert.image.block'),
    value: 'image',
    icon: 'image',
    description: t('insert.image.blockdesc'),
  },
  {
    title: t('insert.image.inline'),
    value: 'inlineImage',
    icon: 'image-inline',
    description: t('insert.image.inlinedesc'),
  },
]

const insertImage = (type) => {
  editor.value
    ?.chain()
    .focus()
    .selectFiles(type, container, uploadFileMap.value)
    .run()
}
</script>
<style lang="scss">
.umo-image-dropdown {
  .umo-dropdown__item-text {
    padding: 5px 5px;
    display: flex;
    gap: 8px;
  }
  &-icon {
    font-size: 2em;
    opacity: 0.6;
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
    font-size: 12px;
  }
}
</style>
