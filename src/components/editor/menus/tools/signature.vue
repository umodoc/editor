<template>
  <editor-menus-button
    ico="signature"
    text="电子签名"
    huge
    @button-click="dialogVisible = true"
  />
  <modal
    v-model:visible="dialogVisible"
    icon="signature"
    title="插入电子签名"
    width="642px"
    @confirm="setSignature"
    @close="dialogVisible = false"
  >
    <div class="signature-toolbar">
      <editor-menus-button text="清空画布" @button-click="reset">
        <icon name="clear-format" />
      </editor-menus-button>
      <editor-menus-base-color
        modeless
        default-color="#000"
        @change="changeLineColor"
      />
      <editor-menus-button
        text="画笔粗细"
        menu-type="dropdown"
        :select-options="lineWidthOptions"
        @change="changeLineWidth"
      >
        <icon name="highlight" />
      </editor-menus-button>
    </div>
    <div class="signature-container" data-tip="请在当前区域签名">
      <signature
        ref="signatureRef"
        :line-color="lineColor"
        :line-width="lineWidth"
        :width="600"
        :height="200"
        is-crop
        format="image/png"
      />
    </div>
  </modal>
</template>

<script setup>
import signature from 'vue-esign'

const { editor } = useStore()
let dialogVisible = $ref(false)

let lineColor = $ref('#000')
let lineWidth = $ref(5)
const lineWidthOptions = $ref([
  { content: '2', value: 2 },
  { content: '3', value: 3 },
  { content: '4', value: 4 },
  { content: '5', value: 5 },
  { content: '6', value: 6 },
  { content: '7', value: 7 },
  { content: '8', value: 8 },
])
const signatureRef = $ref(null)
const reset = () => {
  signatureRef.reset()
}

const changeLineColor = (color) => {
  lineColor = color
}
const changeLineWidth = ({ value }) => {
  lineWidth = value
}

const setSignature = async () => {
  try {
    const image = await signatureRef.generate()
    editor.value
      ?.chain()
      .focus()
      .setImage({
        type: 'signature',
        src: image,
        width: 80,
        draggable: true,
      })
      .run()
    dialogVisible = false
  } catch {
    useMessage('error', '没有检测到您的签名')
  }
}

watch(
  () => dialogVisible,
  (val) => {
    if (!val) reset()
  },
)
</script>

<style lang="less" scoped>
.desc {
  font-size: 12px;
  color: var(--umo-text-color-light);
  margin-left: 10px;
}
.signature-toolbar {
  margin-bottom: 10px;
}
.signature-container {
  border: solid 1px var(--umo-primary-color);
  box-sizing: border-box;
  border-radius: var(--umo-radius);
  overflow: hidden;
  position: relative;
  &::before {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    content: attr(data-tip);
    align-items: center;
    justify-content: center;
    z-index: 1;
    color: var(--umo-text-color-light);
    letter-spacing: 5px;
    opacity: 0.5;
    pointer-events: none;
  }
}
</style>
