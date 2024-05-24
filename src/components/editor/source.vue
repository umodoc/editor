<template>
  <div class="source-editor">
    <monaco-editor
      v-model:value="code"
      :options="config"
      language="html"
      @mount="editorMount"
      @change="codeChange"
    >
      <template #loading>
        <span class="loading">加载中...</span>
      </template>
    </monaco-editor>
  </div>
</template>

<script setup>
import { MonacoEditor, loader } from '@vue-monaco/editor'

const { options, editor } = useStore()
const $document = useState('document')

loader.config({
  paths: {
    vs: `${options.value.cdnUrl}/libs/monaco-editor/min/vs`,
  },
  'vs/nls': {
    availableLanguages: {
      '*': 'zh-cn',
    },
  },
})
const config = {
  fontSize: 14,
  formatOnType: true,
  formatOnPaste: true,
  lineNumbersMinChars: 3,
  minimap: { enabled: false },
  wordWrap: 'on',
  scrollbar: {
    verticalScrollbarSize: 5,
    horizontalScrollbarSize: 5,
    scrollbarVisibility: 'auto',
    horizontal: 'hidden',
  },
}
const code = $ref(editor.value?.getHTML() || $document.value.content)

const editorMount = async (editor) => {
  setTimeout(() => {
    editor.getAction('editor.action.formatDocument').run()
  }, 200)
}

const codeChange = () => {
  $document.value.content = code
}
</script>

<style lang="less" scoped>
.source-editor {
  height: 100%;
  :deep(.monaco-editor) {
    .decorationsOverviewRuler {
      display: none !important;
    }
    .scrollbar .slider {
      border-radius: 3px;
    }
  }
}
.loading {
  font-size: 12px;
  color: var(--umo-text-color-light);
}
</style>
