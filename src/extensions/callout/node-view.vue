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
      @visible-change="(visible) => (bubbleMenu = visible)"
    >
      <div
        class="umo-node-container hover-shadow umo-node-callout"
        :style="{
          color: attrs.fontColor,
          backgroundColor: attrs.backgroundColor,
        }"
      >
        <span
          v-if="attrs.icon"
          class="umo-node-callout-icon"
          contenteditable="false"
          >{{ attrs.icon }}</span
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

<script setup>
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
const props = defineProps(nodeViewProps)
const attrs = $computed(() => props.node.attrs)
const { updateAttributes } = props

const container = inject('container')
const bubbleMenu = $ref(false)

const selectEmoji = (emoji) => {
  updateAttributes({
    icon: emoji,
  })
}
</script>

<style lang="less">
.umo-node-callout {
  padding: 8px 12px;
  border-radius: var(--umo-radius);
  display: flex;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  align-items: center;
  &-icon {
    font-size: 18px;
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
      .tiptap-invisible-character {
        display: none;
      }
    }
  }
}
</style>
