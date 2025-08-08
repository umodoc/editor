<template>
  <node-view-wrapper ref="containerRef" class="umo-node-view umo-code-block">
    <div
      :class="`umo-node-container hover-shadow umo-node-code-block umo-node-code-block-theme-${node.attrs.theme}`"
    >
      <div class="umo-node-code-block-toolbar">
        <div class="umo-node-code-block-toolbar-left">
          <template v-if="editor?.isEditable && !options.document?.readOnly">
            <menus-button
              :text="t('bubbleMenu.code.languages')"
              menu-type="select"
              style="width: 100px"
              :select-options="languageOptions"
              :select-value="node.attrs.language"
              :popup-props="{
                attach: container,
                overlayClassName: 'umo-code-block-language',
              }"
              filterable
              borderless
              @menu-click="
                (value: string) => updateAttribute('language', value)
              "
            />
            <menus-button
              :text="t('bubbleMenu.code.themes.text')"
              menu-type="select"
              style="width: 100px"
              :select-options="themeOptions"
              :select-value="node.attrs.theme"
              :disabled="options.document?.readOnly"
              force-enabled
              borderless
              @menu-click="(value: string) => updateAttribute('theme', value)"
            />
          </template>
          <span v-else class="umo-node-code-block-language">{{
            node.attrs.language
          }}</span>
        </div>
        <div class="umo-node-code-block-toolbar-right">
          <menus-button
            class="umo-word-wrap-button"
            :menu-active="node.attrs.wordWrap"
            :text="t('bubbleMenu.code.wordWrap')"
            ico="code-word-wrap"
            hide-text
            force-enabled
            @menu-click="updateAttribute('wordWrap', !node.attrs.wordWrap)"
          />
          <menus-button
            class="umo-copy-button"
            ico="copy"
            :text="t('bubbleMenu.code.copy.text')"
            hide-text
            force-enabled
            @menu-click="copyCode"
          />
          <menus-button
            class="umo-copy-button"
            v-if="editor?.isEditable && !options.document?.readOnly"
            ico="node-delete"
            :text="t('bubbleMenu.delete')"
            hide-text
            @menu-click="deleteNode"
          />
        </div>
      </div>
      <pre
        class="umo-node-code-block-content"
        :class="{
          'umo-node-code-block-word-wrap': node.attrs.wordWrap,
        }"
      ><node-view-content
        :class="`hljs language-${node.attrs.language}`"
        :style="`white-space: pre${node.attrs.wordWrap ? '-wrap' : ''} !important;`"
        as="code"
      /></pre>
    </div>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { common, createLowlight } from 'lowlight'

const { node, updateAttributes, deleteNode } = defineProps(nodeViewProps)
const lowlight = createLowlight(common)

const container = inject('container')
const options = inject('options')
const editor = inject('editor')
const containerRef = ref(null)

const languageOptions = lowlight.listLanguages().map((item) => {
  return { label: item, value: item }
})
const themeOptions = [
  { label: t('bubbleMenu.code.themes.dark'), value: 'dark' },
  { label: t('bubbleMenu.code.themes.light'), value: 'light' },
]

const updateAttribute = (type: string, value: string) => {
  updateAttributes({ [type]: value })
}

const copyCode = () => {
  const { copy } = useClipboard({
    source: node.textContent,
  })
  void copy()
  useMessage('success', {
    attach: container,
    content: t('bubbleMenu.code.copy.success'),
  })
}
</script>

<style lang="less">
@import '@/assets/styles/_mixins.less';

.umo-code-block {
  display: block !important;
  .umo-node-code-block {
    border: solid 1px var(--umo-content-node-border);
    border-radius: 3px;
    &-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
      border-bottom: 1px solid var(--umo-content-node-border);
      height: 36px;
      border-top-left-radius: 2px;
      border-top-right-radius: 2px;
      background-color: var(--umo-content-node-selected-background);
      &-right {
        display: flex;
        align-items: center;
        display: none;
        gap: 5px;
        .umo-menu-button-wrap {
          margin-right: 0;
          .active .umo-button-content {
            color: var(--umo-primary-color);
          }
        }
      }
      .umo-button-content {
        color: var(--umo-text-color-light);
        &:hover {
          color: var(--umo-text-color);
        }
      }
    }
    &:hover {
      .umo-node-code-block-toolbar {
        &-right {
          display: flex;
        }
      }
    }
    &-language {
      font-size: 12px;
      color: var(--umo-text-color-light);
      padding: 0 6px;
    }
    &-theme-dark {
      .umo-node-code-block-toolbar {
        filter: invert(1);
      }
    }
    &-content {
      font-family: var(--umo-content-code-family);
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden;
      max-height: 500px;
      border-radius: 0;
      border-bottom-left-radius: 2px;
      border-bottom-right-radius: 2px;
      .umo-scrollbar();

      code {
        display: block;
        padding: 10px 20px !important;
        width: 100%;
        color: inherit;
        font-size: 0.8rem;
        box-sizing: border-box;
        border-radius: 0;
        background: none;
        &:first-child {
          margin-left: -0.4em;
        }
      }
    }
  }
  &.umo-node-focused {
    .umo-node-code-block {
      border-color: var(--umo-primary-color);
    }
  }
}
.umo-code-block-language {
  .umo-select__list {
    max-height: 200px;
  }
}
.umo-node-code-block-theme {
  &-light {
    pre {
      color: #24292e;
      background: #ffffff;
    }
    .hljs-doctag,
    .hljs-keyword,
    .hljs-meta .hljs-keyword,
    .hljs-template-tag,
    .hljs-template-variable,
    .hljs-type,
    .hljs-variable.language_ {
      color: #d73a49;
    }
    .hljs-title,
    .hljs-title.class_,
    .hljs-title.class_.inherited__,
    .hljs-title.function_ {
      color: #6f42c1;
    }
    .hljs-attr,
    .hljs-attribute,
    .hljs-literal,
    .hljs-meta,
    .hljs-number,
    .hljs-operator,
    .hljs-variable,
    .hljs-selector-attr,
    .hljs-selector-class,
    .hljs-selector-id {
      color: #005cc5;
    }
    .hljs-regexp,
    .hljs-string,
    .hljs-meta .hljs-string {
      color: #032f62;
    }
    .hljs-built_in,
    .hljs-symbol {
      color: #e36209;
    }
    .hljs-comment,
    .hljs-code,
    .hljs-formula {
      color: #6a737d;
    }
    .hljs-name,
    .hljs-quote,
    .hljs-selector-tag,
    .hljs-selector-pseudo {
      color: #22863a;
    }
    .hljs-subst {
      color: #24292e;
    }
    .hljs-section {
      color: #005cc5;
      font-weight: bold;
    }
    .hljs-bullet {
      color: #735c0f;
    }
    .hljs-emphasis {
      color: #24292e;
      font-style: italic;
    }
    .hljs-strong {
      color: #24292e;
      font-weight: bold;
    }
    .hljs-addition {
      color: #22863a;
      background-color: #f0fff4;
    }
    .hljs-deletion {
      color: #b31d28;
      background-color: #ffeef0;
    }
  }
  &-dark {
    pre {
      color: #c9d1d9;
      background: #1d2229;
    }

    .hljs-doctag,
    .hljs-keyword,
    .hljs-meta .hljs-keyword,
    .hljs-template-tag,
    .hljs-template-variable,
    .hljs-type,
    .hljs-variable.language_ {
      color: #ff7b72;
    }
    .hljs-title,
    .hljs-title.class_,
    .hljs-title.class_.inherited__,
    .hljs-title.function_ {
      color: #d2a8ff;
    }
    .hljs-attr,
    .hljs-attribute,
    .hljs-literal,
    .hljs-meta,
    .hljs-number,
    .hljs-operator,
    .hljs-variable,
    .hljs-selector-attr,
    .hljs-selector-class,
    .hljs-selector-id {
      color: #79c0ff;
    }
    .hljs-regexp,
    .hljs-string,
    .hljs-meta .hljs-string {
      color: #a5d6ff;
    }
    .hljs-built_in,
    .hljs-symbol {
      color: #ffa657;
    }
    .hljs-comment,
    .hljs-code,
    .hljs-formula {
      color: #8b949e;
    }
    .hljs-name,
    .hljs-quote,
    .hljs-selector-tag,
    .hljs-selector-pseudo {
      color: #7ee787;
    }
    .hljs-subst {
      color: #c9d1d9;
    }
    .hljs-section {
      color: #1f6feb;
      font-weight: bold;
    }
    .hljs-bullet {
      color: #f2cc60;
    }
    .hljs-emphasis {
      color: #c9d1d9;
      font-style: italic;
    }
    .hljs-strong {
      color: #c9d1d9;
      font-weight: bold;
    }
    .hljs-addition {
      color: #aff5b4;
      background-color: #033a16;
    }
    .hljs-deletion {
      color: #ffdcd7;
      background-color: #67060c;
    }
  }
}
</style>
