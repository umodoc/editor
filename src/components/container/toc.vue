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
        v-for="(item, index) in tableOfContents"
        :key="item.id"
        :class="{
          active: activeHeading === index || item.isActive,
          ['level-' + item.level]: true,
        }"
        :data-heading="'H' + item.originalLevel"
        @click="headingClick(item, index)"
      >
        {{ item.textContent }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { TextSelection } from '@tiptap/pm/state'
const { editor, tableOfContents } = useStore()

let activeHeading = $ref(null)
const headingClick = (heading, index) => {
  activeHeading = index
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
  width: 360px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .toc-title {
    border-bottom: solid 1px var(--umo-border-color-light);
    display: flex;
    align-items: center;
    position: relative;
    padding: 10px 15px;
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
    padding: 10px;
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
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
      white-space: nowrap;
      border-radius: 3px;
      padding: 5px 7px 5px 37px;
      box-sizing: border-box;
      align-items: center;
      position: relative;
      margin: 2px 0;
      &::before {
        position: absolute;
        content: attr(data-heading);
        color: var(--umo-text-color-light);
        margin-right: 8px;
        border-radius: 2px;
        border: solid 1px var(--umo-border-color);
        font-size: 8px;
        padding: 5px 4px;
        left: 7px;
        top: 50%;
        transform: translateY(-50%);
      }
      &:hover {
        cursor: pointer;
        background: var(--umo-content-node-selected-background);
        color: var(--umo-primary-color);
        &::before {
          color: var(--umo-primary-color);
          border-color: var(--umo-primary-color);
        }
      }
      &.active {
        background: var(--umo-button-hover-background);
        color: var(--umo-primary-color);
        &::before {
          color: var(--umo-primary-color);
          border-color: var(--umo-primary-color);
        }
      }
      &.level-1 {
        margin-left: 0;
        width: 100%;
      }
      &.level-2 {
        margin-left: 15px;
        width: calc(100% - 15px);
      }
      &.level-3 {
        margin-left: 30px;
        width: calc(100% - 30px);
      }
      &.level-4 {
        margin-left: 45px;
        width: calc(100% - 45px);
      }
      &.level-5 {
        margin-left: 60px;
        width: calc(100% - 60px);
      }
      &.level-6 {
        padding-left: 75px;
        width: calc(100% - 75px);
      }
    }
  }
}
</style>
