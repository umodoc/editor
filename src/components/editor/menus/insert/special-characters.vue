<template>
  <editor-menus-button
    ico="special-characters"
    text="特殊字符"
    menu-type="popup"
    huge
    :popup-visible="popupVisible"
    @toggle-popup="togglePopup"
  >
    <template #content>
      <div class="characters-container narrow-scrollbar">
        <template
          v-for="(group, index) in options.dicts.specialCharacters"
          :key="index"
        >
          <div class="characters-group-title">{{ group.label }}</div>
          <div class="characters-group-container">
            <div
              class="characters-group-item"
              v-for="(item, i) in group.items.split('')"
              :key="i"
              @click="selectCharacter(item)"
            >
              {{ item }}
            </div>
          </div>
        </template>
      </div>
    </template>
  </editor-menus-button>
</template>

<script setup>
let { popupVisible, togglePopup } = usePopup()
const { options, editor } = useStore()

const selectCharacter = (char) => {
  editor.value?.chain().focus().insertContent(char).run()
  popupVisible.value = false
}
</script>

<style lang="less" scoped>
.characters-container {
  width: 336px;
  max-height: var(--umo-popup-max-height);
  min-height: 300px;
  overflow: auto;
  margin: calc(var(--umo-popup-content-padding) * -1);
  padding: calc(var(--umo-popup-content-padding) - 2px);
}

.characters-group {
  &-title {
    color: var(--umo-text-color-light);
    font-size: 12px;
    margin: 5px 0 2px 4px;
    &:first-child {
      margin-top: 0;
    }
  }
  &-container {
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    gap: 2px;
  }
  &-item {
    flex-basis: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    line-height: 1em;
    margin-bottom: 2px;
    border-radius: var(--umo-radius);
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 14px;
    color: var(--umo-text-color);
    &:hover {
      background-color: var(--umo-button-hover-background);
    }
  }
}
</style>
