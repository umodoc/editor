<template>
  <div class="umo-source-editor">
    <monaco-editor
      v-model:value="code"
      :options="config"
      language="html"
      @mount="editorMount"
      @change="codeChange"
    >
      <template #loading>
        <span
          class="umo-source-editor-loading"
          v-text="t('source.loading')"
        ></span>
      </template>
    </monaco-editor>
  </div>
</template>

<script setup lang="ts">
import { type Editor, loader, MonacoEditor } from '@vue-monaco/editor'

const { options, editor } = useStore()
const { locale } = useI18n()
const $document = useState('document')

loader.config({
  paths: {
    vs: `${options.value.cdnUrl}/libs/monaco-editor/min/vs`,
  },
  'vs/nls': {
    availableLanguages: {
      '*': locale.value.toLowerCase(),
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
const code = $ref($document.value.content)

const editorMount = (editor: Editor.ICodeEditor) => {
  if (editor) {
    void editor.getAction('editor.action.formatDocument')?.run()
    editor.getModel()?.updateOptions({ tabSize: 2 })
  }
}

const codeChange = () => {
  $document.value.content = code
}
</script>

<style lang="less" scoped>
.umo-source-editor {
  height: 100%;
  :deep(.monaco-editor) {
    .decorationsOverviewRuler {
      display: none !important;
    }
    .scrollbar .slider {
      border-radius: 3px;
    }
  }
  .umo-source-editor-loading {
    font-size: 12px;
    color: var(--umo-text-color-light);
  }
}
</style>
