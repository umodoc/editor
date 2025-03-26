<template>
  <menus-button
    :ico="content ? 'edit' : 'mermaid'"
    :text="content ? t('tools.mermaid.edit') : t('tools.mermaid.text')"
    huge
    @menu-click="menuClick"
  >
    <modal
      :visible="dialogVisible"
      icon="mermaid"
      :header="content ? t('tools.mermaid.edit') : t('tools.mermaid.text')"
      width="960px"
      @confirm="setMermaid"
      @close="dialogVisible = false"
    >
      <div class="umo-mermaid-container">
        <t-textarea
          v-model="mermaidCode"
          class="umo-mermaid-code"
          autofocus
          :placeholder="t('tools.mermaid.placeholder')"
        />
        <div class="umo-mermaid-render">
          <div
            class="umo-mermaid-title"
            v-text="t('tools.mermaid.preview')"
          ></div>
          <div
            ref="mermaidRef"
            class="umo-mermaid-svg narrow-scrollbar"
            v-html="svgCode"
          ></div>
        </div>
      </div>
    </modal>
  </menus-button>
</template>

<script setup lang="ts">
import mermaid from 'mermaid'
import svg64 from 'svg64'

import { shortId } from '@/utils/short-id'

const props = defineProps({
  content: {
    type: String,
    default: '',
  },
})

let dialogVisible = $ref(false)
const editor = inject('editor')
const container = inject('container')
const uploadFileMap = inject('uploadFileMap')

//  初始化 Mermaid
const mermaidInit = () => {
  mermaid.initialize({
    darkMode: false,
    startOnLoad: false,
    // fontFamily:'',
    fontSize: 12,
    theme: 'base',
  })
}

const menuClick = () => {
  dialogVisible = true
  mermaidInit()
}

// 渲染 Mermaid
const defaultCode = 'graph TB\na-->b'
let mermaidCode = $ref('')
let svgCode = $ref('')
const mermaidRef = $ref<HTMLElement | null>(null)
const renderMermaid = async () => {
  try {
    const { svg } = await mermaid.render('mermaid-svg', mermaidCode)
    svgCode = svg
  } catch {
    svgCode = ''
  }
}
watch(
  () => dialogVisible,
  (val: boolean) => {
    if (val) {
      mermaidCode = props.content ?? defaultCode
    }
  },
  { immediate: true },
)
watch(
  () => mermaidCode,
  async () => {
    if (dialogVisible) {
      await nextTick()
      void renderMermaid()
    }
  },
  { immediate: true },
)

// 创建或更新 Mermaid
const setMermaid = () => {
  if (mermaidCode === '') {
    useMessage('error', {
      attach: container,
      content: t('tools.mermaid.notEmpty'),
    })
    return
  }
  if (!props.content || (props.content && props.content !== mermaidCode)) {
    const id = shortId(10)
    const svg = mermaidRef.querySelector('svg')
    const { width, height } = svg.getBoundingClientRect()
    const name = `mermaid-${shortId()}.svg`
    const blob = new Blob([svg.outerHTML], {
      type: 'image/svg+xml',
    })
    const file = new File([blob], name, {
      type: 'image/svg+xml',
    })
    uploadFileMap.value.set(id, file)
    editor.value
      ?.chain()
      .focus()
      .setImage(
        {
          id,
          type: 'mermaid',
          name,
          size: file.size,
          src: svg64(svgCode),
          content: mermaidCode,
          width,
          height,
          equalProportion: false,
        },
        !!props.content,
      )
      .run()
  }
  dialogVisible = false
}
</script>

<style lang="less" scoped>
.umo-mermaid-container {
  display: flex;
  .umo-mermaid-code {
    width: 320px;
    margin-left: 2px;
    :deep(.umo-textarea__inner) {
      height: 100%;
      resize: none;
    }
  }
  .umo-mermaid-render {
    flex: 1;
    margin-left: 20px;
    border: solid 1px var(--td-border-level-2-color);
    border-radius: var(--umo-radius);
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    .umo-mermaid-title {
      background-color: var(--umo-button-hover-background);
      padding: 0 10px;
      position: absolute;
      font-size: 12px;
      border-bottom-right-radius: var(--umo-radius);
    }
    .umo-mermaid-svg {
      box-sizing: border-box;
      height: 320px;
      padding: 40px 20px 20px;
      overflow: auto;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
