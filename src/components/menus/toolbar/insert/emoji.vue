<template>
  <menus-button
    ico="emoji"
    text="表情"
    menu-type="popup"
    huge
    :popup-visible="popupVisible"
    @toggle-popup="togglePopup"
  >
    <template #content>
      <div class="emojis-container narrow-scrollbar">
        <template v-for="(group, index) in options.dicts.emojis" :key="index">
          <div class="emojis-group-title">{{ group.label }}</div>
          <div class="emojis-group-container">
            <div
              class="emojis-group-item"
              v-for="(item, i) in group.items.split(' ')"
              :key="i"
              @click="selectEmoji(item)"
            >
              {{ item }}
            </div>
          </div>
        </template>
      </div>
    </template>
  </menus-button>
</template>

<script setup>
let { popupVisible, togglePopup } = usePopup()
const { options, editor } = useStore()

const selectEmoji = (emoji) => {
  editor.value?.chain().focus().insertContent(emoji).run()
  popupVisible.value = false
}
</script>

<style lang="less" scoped>
.emojis-container {
  width: 404px;
  max-height: var(--umo-popup-max-height);
  min-height: 320px;
  overflow: auto;
  margin: calc(var(--umo-popup-content-padding) * -1);
}

.emojis-group {
  position: relative;
  &-title {
    color: var(--umo-text-color-light);
    font-size: 12px;
    position: sticky;
    line-height: 2.4;
    top: 0;
    background-color: var(--umo-button-hover-background);
    padding-left: calc(var(--umo-popup-content-padding) + 5px);
    &:first-child {
      margin-top: 0;
    }
  }
  &-container {
    display: flex;
    flex-wrap: wrap;
    padding: 10px var(--umo-popup-content-padding);
    overflow: auto;
    gap: 2px;
  }
  &-item {
    flex-basis: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    line-height: 1em;
    border-radius: var(--umo-radius);
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 20px;
    margin-bottom: 2px;
    color: var(--umo-text-color);
    transition: font-size 0.2s;
    &:hover {
      background-color: var(--umo-button-hover-background);
      font-size: 24px;
    }
  }
}
</style>
