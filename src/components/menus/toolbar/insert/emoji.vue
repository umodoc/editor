<template>
  <menus-button
    ico="emoji"
    :text="t('insert.emoji')"
    menu-type="popup"
    huge
    :popup-visible="popupVisible"
    @toggle-popup="togglePopup"
  >
    <template #content>
      <div class="umo-emojis-container narrow-scrollbar">
        <template v-for="(group, index) in options.dicts?.emojis" :key="index">
          <div class="umo-emojis-group-title" v-text="l(group.label)"></div>
          <div class="umo-emojis-group-container">
            <div
              v-for="(item, i) in group.items.split(' ')"
              :key="i"
              class="umo-emojis-group-item"
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

<script setup lang="ts">
const props = defineProps({
  onSelectEmoji: undefined,
})
const { popupVisible, togglePopup } = usePopup()
const editor = inject('editor')
const options = inject('options')

const selectEmoji = (emoji: string) => {
  if (props.onSelectEmoji) {
    props.onSelectEmoji(emoji)
  } else {
    editor.value?.chain().focus().insertContent(emoji).run()
  }
  popupVisible.value = false
}
</script>

<style lang="less" scoped>
.umo-emojis-container {
  width: 404px;
  max-height: var(--umo-popup-max-height);
  min-height: 320px;
  overflow: auto;
  margin: calc(var(--umo-popup-content-padding) * -1);
}

.umo-emojis-group {
  position: relative;
  &-title {
    color: var(--umo-text-color-light);
    font-size: 12px;
    position: sticky;
    line-height: 2.4;
    top: 0.5px;
    margin-left: 0.5px;
    background-color: var(--umo-button-hover-background);
    padding-left: calc(var(--umo-popup-content-padding) + 5px);
    border-top-left-radius: var(--umo-radius);
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
