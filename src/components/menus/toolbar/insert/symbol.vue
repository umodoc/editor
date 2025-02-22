<template>
  <menus-button
    ico="symbol"
    :text="t('insert.symbol')"
    menu-type="popup"
    huge
    :popup-visible="popupVisible"
    @toggle-popup="togglePopup"
  >
    <template #content>
      <div class="umo-symbols-container narrow-scrollbar">
        <template v-for="(group, index) in options.dicts?.symbols" :key="index">
          <div class="umo-symbols-group-title" v-text="l(group.label)"></div>
          <div class="umo-symbols-group-container">
            <div
              v-for="(item, i) in group.items.split('')"
              :key="i"
              class="umo-symbols-group-item"
              @click="selectSymbol(item)"
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
const { popupVisible, togglePopup } = usePopup()
const editor = inject('editor')
const options = inject('options')

const selectSymbol = (char: string) => {
  editor.value?.chain().focus().insertContent(char).run()
  popupVisible.value = false
}
</script>

<style lang="less" scoped>
.umo-symbols-container {
  width: 336px;
  max-height: var(--umo-popup-max-height);
  min-height: 300px;
  overflow: auto;
  margin: calc(var(--umo-popup-content-padding) * -1);
  padding: calc(var(--umo-popup-content-padding) - 2px);
}

.umo-symbols-group {
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
