<template>
  <div class="toc-container">
    <div class="toc-title">
      <icon class="icon-toc" name="toc" />页面大纲
      <div class="umo-dialog__close" @click="$emit('close')">
        <icon name="close" />
      </div>
    </div>
    <div class="toc-content umo-scrollbar">
      <div v-if="tableOfContents.length === 0" class="toc-empty">
        当前页面无大纲
      </div>
      <div
        v-else
        class="toc-item"
        v-for="item in tableOfContents"
        :key="item.id"
        :class="{
          active: item.isActive,
          ['level-' + item.originalLevel]: true,
        }"
        :data-heading="'H' + item.originalLevel"
        @click="headingClick(item)"
      >
        {{ item.textContent }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { TextSelection } from '@tiptap/pm/state'
const { editor, tableOfContents } = useStore()

const headingClick = (heading) => {
  if (!editor.value) return
  const element = editor.value.view.dom.querySelector(
    `[data-toc-id="${heading.id}"`,
  )
  const pos = editor.value.view.posAtDOM(element, 0)

  const tr = editor.value.view.state.tr
  tr.setSelection(new TextSelection(tr.doc.resolve(pos)))
  editor.value.view.dispatch(tr)

  editor.value.view.focus()
  editor.value.commands.scrollIntoView()
}
</script>

<style lang="less" scoped>
.toc-container {
  background-color: var(--umo-color-white);
  border-right: solid 1px var(--umo-border-color);
  width: 320px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .toc-title {
    border-bottom: solid 1px var(--umo-border-color-light);
    display: flex;
    align-items: center;
    position: relative;
    padding: 15px;
    .icon-toc {
      margin-right: 5px;
      font-size: 20px;
    }
    .umo-dialog__close {
      position: absolute;
      right: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .toc-content {
    list-style: none;
    flex: 1;
    display: flex;
    padding: 15px;
    flex-direction: column;
    .toc-empty {
      font-size: 14px;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--umo-text-color-light);
    }
    .toc-item {
      min-height: 32px;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
      white-space: nowrap;
      border-radius: 3px;
      padding: 10px;
      display: flex;
      width: 100%;
      box-sizing: border-box;
      align-items: center;
      &::before {
        content: attr(data-heading);
        color: var(--umo-text-color-light);
        margin-right: 8px;
        border-radius: 2px;
        border: solid 1px var(--umo-border-color);
        font-size: 8px;
        padding: 5px 4px;
        height: 1em;
      }
      &:hover {
        cursor: pointer;
        background: var(--umo-button-hover-background);
        color: var(--umo-primary-color);
        &::before {
          color: var(--umo-primary-color);
          border-color: var(--umo-primary-color);
        }
      }
      &.active {
        background: var(--umo-primary-color);
        color: var(--umo-color-white);
      }
      &.level-1 {
        font-size: 20px;
      }
      &.level-2 {
        font-size: 18px;
      }
      &.level-3 {
        font-size: 16px;
      }
      &.level-4 {
        font-size: 14px;
      }
      &.level-5 {
        font-size: 12px;
      }
      &.level-6 {
        font-size: 10px;
      }
    }
  }
}
</style>
