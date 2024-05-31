<template>
  <menus-button
    :ico="content ? 'edit' : 'mermaid'"
    :text="content ? '编辑' : 'Mermaid'"
    huge
    @menu-click="buttonClick"
  >
    <modal
      :visible="dialogVisible"
      icon="mermaid"
      :title="content ? '编辑 Mermaid 图表' : '添加 Mermaid 图表'"
      width="960px"
      @confirm="setMermaid"
      @close="dialogVisible = flase"
    >
      <div class="mermaid-container">
        <t-textarea
          class="mermaid-code"
          v-model="mermaidCode"
          autofocus
          placeholder="请输入 Mermaid 代码"
        />
        <div class="mermaid-render">
          <div class="mermaid-title">预览</div>
          <div
            class="mermaid-svg narrow-scrollbar"
            ref="mermaidRef"
            v-html="svgCode"
          ></div>
        </div>
      </div>
    </modal>
  </menus-button>
</template>

<script setup>
import mermaid from 'mermaid'
import svg64 from 'svg64'

const props = defineProps({
  content: {
    type: String,
  },
})

let dialogVisible = $ref(false)
const { editor } = useStore()

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

const buttonClick = () => {
  dialogVisible = true
  mermaidInit()
}

// 渲染 Mermaid
const defaultCode = `graph TB\na-->b`
let mermaidCode = $ref('')
let svgCode = $ref('')
const mermaidRef = $ref()
const renderMermaid = async () => {
  try {
    const { svg } = await mermaid.render('mermaid-svg', mermaidCode)
    svgCode = svg
  } catch (e) {
    svgCode = ''
  }
}
watch(
  () => dialogVisible,
  (val) => {
    if (val) mermaidCode = props.content || defaultCode
  },
  { immediate: true },
)
watch(
  () => mermaidCode,
  async () => {
    if (dialogVisible) {
      await nextTick()
      renderMermaid()
    }
  },
  { immediate: true },
)

// 创建或更新 Mermaid
const setMermaid = () => {
  if (mermaidCode === '') {
    useMessage('error', 'Mermaid 代码不能为空')
    return
  }
  const svg = mermaidRef.querySelector('svg')
  const width = svg.width.animVal.value
  const height = svg.height.animVal.value
  const src = svg64(svgCode)
  if (!props.content || (props.content && props.content !== mermaidCode)) {
    editor.value
      ?.chain()
      .focus()
      .setImage(
        {
          type: 'mermaid',
          src,
          content: mermaidCode,
          width,
          height,
        },
        props.content ? true : false,
      )
      .run()
  }
  dialogVisible = false
}
</script>

<style lang="less" scoped>
.mermaid-container {
  display: flex;
  .mermaid-code {
    width: 320px;
    margin-left: 2px;
    :deep(.umo-textarea__inner) {
      height: 100%;
      resize: none;
    }
  }
  .mermaid-render {
    flex: 1;
    margin-left: 20px;
    border: solid 1px var(--td-border-level-2-color);
    border-radius: var(--umo-radius);
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    .mermaid-title {
      background-color: var(--umo-button-hover-background);
      padding: 0 10px;
      position: absolute;
      font-size: 12px;
      border-bottom-right-radius: var(--umo-radius);
    }
    .mermaid-svg {
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
