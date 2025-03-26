<template>
  <node-view-wrapper class="umo-node-view">
    <t-popup
      :attach="`${container} .umo-zoomable-container`"
      overlay-inner-class-name="umo-editor-bubble-menu"
      trigger="click"
      :visible="
        editor?.isEditable &&
        bubbleMenu &&
        editor.state.selection.to === editor.state.selection.from
      "
      @visible-change="(visible: boolean) => (bubbleMenu = visible)"
    >
      <div
        class="umo-node-container hover-shadow umo-node-callout"
        :style="{
          color: node.attrs.fontColor,
          backgroundColor: node.attrs.backgroundColor,
        }"
      >
        <span
          v-if="node.attrs.icon"
          class="umo-node-callout-icon"
          contenteditable="false"
          >{{ node.attrs.icon }}</span
        >
        <node-view-content
          class="umo-node-callout-content"
          :class="{
            'umo-node-callout-empty': node.content.size <= 2,
          }"
          :data-placeholder="t('callout.placeholder')"
        />
      </div>
      <template #content>
        <menus-bubble-callout-builtin />
        <div class="umo-bubble-menu-divider"></div>
        <menus-toolbar-insert-emoji @select-emoji="selectEmoji" />
        <menus-bubble-callout-emoji-remove
          v-if="editor.getAttributes('callout').icon"
        />
        <menus-bubble-callout-background />
        <div class="umo-bubble-menu-divider"></div>
        <menus-bubble-node-delete />
      </template>
    </t-popup>
  </node-view-wrapper>
</template>

<script lang="ts" setup>
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
const { node, updateAttributes } = defineProps(nodeViewProps)

const container = inject('container')
const bubbleMenu = $ref(false)

const selectEmoji = (emoji: string) => {
  updateAttributes({
    icon: emoji,
  })
}
</script>

<style lang="less" scoped>
.umo-node-callout {
  padding: 6px 12px;
  border-radius: var(--umo-radius);
  display: flex;
  width: 100%;
  min-height: 38px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  &-icon {
    font-size: 16px;
    margin-right: 10px;
  }
  &-content {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &.umo-node-callout-empty {
      display: flex;
      align-items: center;
      &::after {
        content: attr(data-placeholder);
        opacity: 0.5;
      }
      :deep(p) {
        height: 1em;
        line-height: 1em;
        * {
          display: none;
        }
      }
    }
  }
}
</style>
