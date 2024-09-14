<template>
  <node-view-wrapper :id="node.attrs.id" class="umo-node-view">
    <div
      ref="containerRef"
      class="umo-node-container umo-hover-shadow umo-select-outline umo-node-code-block"
      :class="node.attrs.theme"
    >
      <div
        v-if="!options.document?.readOnly"
        class="umo-show-code-block-toolbar"
        v-text="t('node.codeBlock.menu')"
      ></div>
    </div>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import 'prism-code-editor/prism/languages/bash'
import 'prism-code-editor/prism/languages/css'
import 'prism-code-editor/prism/languages/css-extras'
import 'prism-code-editor/prism/languages/ini'
import 'prism-code-editor/prism/languages/kotlin'
import 'prism-code-editor/prism/languages/xml'
import 'prism-code-editor/prism/languages/markup'
import 'prism-code-editor/prism/languages/r'
import 'prism-code-editor/prism/languages/basic'
import 'prism-code-editor/prism/languages/vbnet'
import 'prism-code-editor/prism/languages/c'
import 'prism-code-editor/prism/languages/opencl'
import 'prism-code-editor/prism/languages/diff'
import 'prism-code-editor/prism/languages/java'
import 'prism-code-editor/prism/languages/less'
import 'prism-code-editor/prism/languages/objectivec'
import 'prism-code-editor/prism/languages/ruby'
import 'prism-code-editor/prism/languages/sql'
import 'prism-code-editor/prism/languages/wasm'
import 'prism-code-editor/prism/languages/cpp'
import 'prism-code-editor/prism/languages/go'
import 'prism-code-editor/prism/languages/javascript'
import 'prism-code-editor/prism/languages/js-templates'
import 'prism-code-editor/prism/languages/jsx'
import 'prism-code-editor/prism/languages/lua'
import 'prism-code-editor/prism/languages/perl'
import 'prism-code-editor/prism/languages/python'
import 'prism-code-editor/prism/languages/rust'
import 'prism-code-editor/prism/languages/swift'
import 'prism-code-editor/prism/languages/clike'
import 'prism-code-editor/prism/languages/csharp'
import 'prism-code-editor/prism/languages/graphql'
import 'prism-code-editor/prism/languages/json'
import 'prism-code-editor/prism/languages/makefile'
import 'prism-code-editor/prism/languages/scss'
import 'prism-code-editor/prism/languages/typescript'
import 'prism-code-editor/prism/languages/tsx'
import 'prism-code-editor/prism/languages/yaml'
import 'prism-code-editor/prism/languages/regex'
import 'prism-code-editor/layout.css'

import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { createEditor, type PrismEditor } from 'prism-code-editor'
import { defaultCommands, editHistory } from 'prism-code-editor/commands'
import { cursorPosition } from 'prism-code-editor/cursor'
import { indentGuides } from 'prism-code-editor/guides'
import { highlightBracketPairs } from 'prism-code-editor/highlight-brackets'
import { matchBrackets } from 'prism-code-editor/match-brackets'
import { matchTags } from 'prism-code-editor/match-tags'

const { node, updateAttributes } = defineProps(nodeViewProps)

const { options } = useStore()

const containerRef = $ref(null)

const code = $ref(node.attrs.code)
let codeEditor = $ref<PrismEditor | null>(null)

const nodeStyle = $computed(() => {
  const { margin } = node.attrs
  const marginTop =
    margin?.top && margin?.top !== '' ? `${margin.top}px` : undefined
  const marginBottom =
    margin?.bottom && margin?.bottom !== '' ? `${margin.bottom}px` : undefined
  return {
    marginTop,
    marginBottom,
  }
})

onMounted(() => {
  codeEditor = createEditor(containerRef, {
    readOnly: options.value.document?.readOnly,
    language: node.attrs.language,
    tabSize: 2,
    lineNumbers: node.attrs.lineNumbers,
    wordWrap: node.attrs.wordWrap,
    value: code,
    onUpdate(value) {
      updateAttributes({ code: value })
    },
  })
  codeEditor.addExtensions(
    matchBrackets(),
    matchTags(),
    indentGuides(),
    highlightBracketPairs(),
    cursorPosition(),
    defaultCommands(),
    editHistory(),
  )
})
onBeforeUnmount(() => {
  codeEditor?.remove()
})

watch(
  () => options.value.document?.readOnly,
  (val: boolean) => {
    codeEditor?.setOptions({
      readOnly: val,
    })
  },
)
watch(
  () => [node.attrs.language, node.attrs.lineNumbers, node.attrs.wordWrap],
  () => {
    codeEditor?.setOptions(node.attrs)
  },
)
</script>

<style lang="less">
@import '@/assets/styles/_mixins.less';

.umo-node-view {
  .umo-node-code-block {
    width: 100%;
    outline: solid 1px var(--umo-content-node-border);
    overflow: hidden;
    border-radius: var(--umo-content-node-radius);
    position: relative;
    .umo-show-code-block-toolbar {
      position: absolute;
      right: 5px;
      top: 5px;
      font-size: 12px;
      padding: 3px 6px;
      cursor: pointer;
      background-color: var(--umo-color-white);
      border: solid 1px var(--umo-border-color);
      z-index: 10;
      border-radius: var(--umo-radius);
      display: none;
    }
    &.dark {
      .umo-show-code-block-toolbar {
        color: #999;
        background-color: var(--umo-color-black);
      }
    }
    &:hover {
      .umo-show-code-block-toolbar {
        display: block;
        &:hover {
          opacity: 1;
        }
      }
    }
  }
}

.prism-code-editor {
  max-height: 560px;
  font-size: 14px;
  .umo-scrollbar();
  textarea {
    caret-color: var(--umo-color-black);
  }
  textarea[aria-readonly='true'] {
    caret-color: transparent;
  }
}
.dark > {
  .prism-code-editor {
    font-family: var(--umo-content-code-family);
    --editor__bg: #0d1117;
    --widget__border: #303741;
    --widget__bg: #161b22;
    --widget__color: #b8bfc7;
    --widget__color-active: #fff;
    --widget__color-options: #757e8a;
    --widget__bg-input: #0d1117;
    --widget__bg-hover: #5a5d5e4f;
    --widget__bg-active: #1f6feb66;
    --widget__focus-ring: #007acc;
    --search__bg-find: #f2cc6080;
    --widget__bg-error: #5a1d1d;
    --widget__error-ring: #be1100;
    --editor__bg-highlight: #6e76811a;
    --editor__bg-selection-match: #3fb95040;
    --editor__line-number: #6e7681;
    --editor__bg-scrollbar: 210, 10%, 32%;
    --editor__bg-fold: #7d8590;
    --bg-guide-indent: #e6edf31f;
    color-scheme: dark;
    color: #fff;
  }
  textarea {
    caret-color: var(--umo-color-white);
    &::selection {
      color: #0000;
      background: #264f78;
    }
  }
  .pce-matches .match {
    --search__bg-find: #8c8d6c;
  }
  .active-line {
    --editor__line-number: #e6edf3;
  }
  .guide-indents .active {
    --bg-guide-indent: #e6edf33d;
  }
  [class*='language-'],
  .language-markdown .url > .operator,
  .token.punctuation,
  .token.attr-equals,
  .token.code.keyword {
    color: #e6edf3;
  }
  .token.atrule,
  .token.variable,
  .language-css .token.url,
  .token.parameter,
  .token.list.punctuation,
  .token.class-name,
  .token.maybe-class-name {
    color: #ffa657;
  }
  .token.atrule .rule,
  .token.unit,
  .token.selector .combinator,
  .token.operator,
  .token.regex-flags,
  .token.token.anchor,
  .token.number.quantifier,
  .token.keyword {
    color: #ff7b72;
  }
  .token.tag,
  .token.selector,
  .token.doctype,
  .language-regex .escape {
    color: #7ee787;
  }
  .token.token.interpolation-punctuation,
  .token.attr-value,
  .token.string,
  .token.regex,
  .language-regex,
  .token.string-property,
  .language-markdown .url .content,
  .language-markdown .url .variable {
    color: #a5d6ff;
  }
  .token.builtin,
  .token.selector .class,
  .token.selector .id,
  .token.pseudo-class,
  .token.pseudo-element,
  .token.attr-name,
  .language-css .token.property,
  .token.number,
  .token.color,
  .token.boolean,
  .token.constant,
  .token.title.important,
  .title.important .punctuation,
  .language-css .token.function,
  .token.code-snippet.code,
  .token.doctype .name,
  .token.property-access,
  .token.keyword-null,
  .token.keyword-this,
  .token.char-class,
  .token.char-set,
  .token.regex .punctuation,
  .language-jsx .tag > .punctuation,
  .language-tsx .tag > .punctuation {
    color: #79c0ff;
  }
  .token.function {
    color: #d2a8ff;
  }
  .token.comment,
  .token.cdata {
    color: #8b949e;
  }
  .token.important,
  .token.bold {
    font-weight: 700;
  }
  .token.italic {
    font-style: italic;
  }
  .token.bracket-level-0,
  .token.bracket-level-6 {
    color: #79c0ff;
  }
  .token.bracket-level-1,
  .token.bracket-level-7 {
    color: #56d364;
  }
  .token.bracket-level-2,
  .token.bracket-level-8 {
    color: #e3b341;
  }
  .token.bracket-level-3,
  .token.bracket-level-9 {
    color: #ffa198;
  }
  .token.bracket-level-4,
  .token.bracket-level-10 {
    color: #ff9bce;
  }
  .token.bracket-level-5,
  .token.bracket-level-11 {
    color: #d2a8ff;
  }
  .token.bracket-error {
    color: #7d8590;
  }
  .token.markup-bracket {
    color: inherit;
  }
  .active-bracket {
    box-shadow:
      inset 0 0 0 1px #3fb95099,
      inset 0 0 0 9in #3fb95040;
  }
  .active-tagname,
  .word-matches span {
    box-shadow:
      inset 0 0 0 1px #6e768199,
      inset 0 0 0 9in #6e768180;
  }
}
.light {
  > .prism-code-editor {
    caret-color: #24292e;
    font-family: var(--umo-content-code-family);
    --editor__bg: #fff;
    --widget__border: #bfbfbf;
    --widget__bg: #f6f8fa;
    --widget__color: #434d56;
    --widget__color-active: var(--umo-color-black);
    --widget__color-options: #5a6772;
    --widget__bg-input: #fafbfc;
    --widget__bg-hover: #b8b8b84f;
    --widget__bg-active: #2188ff33;
    --widget__focus-ring: #007acc;
    --search__bg-find: #ffdf5d66;
    --widget__bg-error: #f2dede;
    --widget__error-ring: #be1100;
    --editor__bg-highlight: #f6f8fa;
    --editor__bg-selection-match: #34d05840;
    --editor__line-number: #1b1f2380;
    --editor__bg-scrollbar: 210, 7%, 55%;
    --editor__bg-fold: #656d76;
    --bg-guide-indent: #1f23281f;
    color-scheme: light;
    color: var(--umo-text-color);
  }
  textarea::selection {
    color: #0000;
    background: #add6ff;
  }
  .pce-matches .match {
    --search__bg-find: #e9e5ba;
  }
  .active-line {
    --editor__line-number: #1f2328;
  }
  .guide-indents .active {
    --bg-guide-indent: #1f23284d;
  }
  [class*='language-'],
  .language-markdown .url > .operator,
  .token.attr-equals,
  .token.punctuation {
    color: #24292e;
  }
  .token.doctype,
  .token.builtin {
    color: #005cc5;
  }
  .token.atrule,
  .token.variable,
  .language-css .token.url,
  .token.parameter,
  .token.list.punctuation,
  .token.maybe-class-name,
  .token.class-name {
    color: #e36209;
  }
  .token.keyword,
  .token.doctype .name,
  .token.atrule .rule,
  .token.unit,
  .token.selector .combinator,
  .token.regex-flags,
  .token.token.anchor,
  .token.number.quantifier,
  .token.operator {
    color: #d73a49;
  }
  .token.tag,
  .token.selector,
  .language-regex .escape {
    color: #22863a;
  }
  .token.selector .class,
  .token.selector .id,
  .token.pseudo-class,
  .token.pseudo-element,
  .token.function {
    color: #6f42c1;
  }
  .token.token.interpolation-punctuation,
  .token.attr-value,
  .token.string,
  .token.regex,
  .language-regex,
  .token.string-property,
  .language-markdown .url .content,
  .language-markdown .url .variable {
    color: #032f62;
  }
  .token.code.keyword {
    color: #24292e;
  }
  .token.attr-name,
  .language-css .token.property,
  .token.number,
  .token.constant,
  .token.color,
  .token.boolean,
  .token.title.important,
  .title.important .punctuation,
  .token.property-access,
  .token.char-class,
  .token.char-set,
  .token.regex .punctuation,
  .language-css .token.function,
  .token.code-snippet.code {
    color: #005cc5;
  }
  .token.comment,
  .token.cdata {
    color: #6a737d;
  }
  .token.important,
  .token.bold {
    font-weight: 700;
  }
  .token.italic {
    font-style: italic;
  }
  .language-jsx .tag > .punctuation,
  .language-tsx .tag > .punctuation {
    color: #0550ae;
  }
  .token.bracket-level-0,
  .token.bracket-level-6 {
    color: #0366d6;
  }
  .token.bracket-level-1,
  .token.bracket-level-7 {
    color: #138934;
  }
  .token.bracket-level-2,
  .token.bracket-level-8 {
    color: #b37700;
  }
  .token.bracket-level-3,
  .token.bracket-level-9 {
    color: #cb2431;
  }
  .token.bracket-level-4,
  .token.bracket-level-10 {
    color: #a43276;
  }
  .token.bracket-level-5,
  .token.bracket-level-11 {
    color: #8a3ddb;
  }
  .token.bracket-error {
    color: #ff1212cc;
  }
  .token.markup-bracket {
    color: inherit;
  }
  .active-bracket {
    box-shadow:
      inset 0 0 0 1px #34d05899,
      inset 0 0 0 9in #35d05940;
  }
  .active-tagname,
  .word-matches span {
    box-shadow:
      inset 0 0 0 1px #afb8c199,
      inset 0 0 0 9in #eaeef280;
  }
}
[contenteditable='false'] {
  .umo-node-code-block {
    outline: solid 1px var(--umo-content-node-border);
  }
}
</style>
