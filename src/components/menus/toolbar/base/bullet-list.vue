<template>
  <menus-button
    ico="bullet-list"
    :text="t('list.bullet.text')"
    shortcut="Ctrl+Shift+8"
    menu-type="popup"
    popup-handle="arrow"
    hide-text
    :menu-active="editor?.isActive('bulletList')"
    :popup-visible="popupVisible"
    :disabled="
      !editor?.can().chain().focus().toggleBulletList().run() &&
      !editor?.can().chain().focus().toggleOrderedList().run() &&
      !editor?.can().chain().focus().toggleTaskList().run()
    "
    @toggle-popup="togglePopup"
    @menu-click="toggleBulletList(options[0].value)"
  >
    <template #content>
      <div class="umo-bullet-list-group">
        <tooltip
          v-for="item in options"
          :key="item.value"
          :content="item.label"
        >
          <div
            class="umo-bullet-list-item"
            :class="{ active: listStyleType === item.value }"
            @click="toggleBulletList(item.value)"
          >
            <icon
              class="umo-icon-bullet-list"
              :name="`bullet-list-${item.value}`"
            />
          </div>
        </tooltip>
      </div>
    </template>
  </menus-button>
</template>

<script setup>
const { popupVisible, togglePopup } = usePopup()
const editor = inject('editor')

const options = [
  { label: t('list.bullet.disc'), value: 'disc' },
  { label: t('list.bullet.circle'), value: 'circle' },
  { label: t('list.bullet.square'), value: 'square' },
]

let listStyleType = $ref('')
watch(
  () => popupVisible.value,
  (val) => {
    if (val && editor.value) {
      const { listType } = editor.value.getAttributes('bulletList')
      listStyleType = listType
    }
  },
)
const toggleBulletList = (listType) => {
  const chain = editor.value?.chain().focus()
  if (editor.value?.isActive('bulletList')) {
    if (editor.value.getAttributes('bulletList').listType === listType) {
      chain?.toggleBulletList().run()
    } else {
      chain?.updateAttributes('bulletList', { listType }).run()
    }
  } else {
    chain
      ?.toggleBulletList()
      ?.updateAttributes('bulletList', { listType })
      ?.run()
  }
  listStyleType = listType
  popupVisible.value = false
}
</script>

<style lang="less" scoped>
.umo-bullet-list-group {
  display: flex;
  align-items: center;
  gap: 8px;
  .umo-bullet-list-item {
    cursor: pointer;
    padding: 5px;
    border: solid 1px var(--umo-border-color);
    box-sizing: border-box;
    &:last-child {
      margin-right: 0;
    }
    &:hover {
      background-color: var(--umo-button-hover-background);
    }
    &.active {
      border-color: var(--umo-primary-color);
    }
  }
  .umo-icon-bullet-list {
    font-size: 44px;
  }
}
</style>
