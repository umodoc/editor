<template>
  <menus-button
    ico="signature"
    :text="t('tools.signature.text')"
    huge
    @menu-click="dialogVisible = true"
  >
    <modal
      v-model:visible="dialogVisible"
      icon="signature"
      :header="t('tools.signature.title')"
      width="642px"
      @confirm="setSignature"
      @close="dialogVisible = false"
    >
      <div class="umo-signature-toolbar">
        <menus-button
          ico="undo"
          :text="t('base.undo')"
          hide-text
          @menu-click="signature?.undo()"
        />
        <menus-button
          ico="clear-format"
          :text="t('tools.signature.clear')"
          hide-text
          @menu-click="signature?.clear()"
        />
        <t-divider layout="vertical" />
        <menus-button
          :text="t('tools.signature.lineWidth')"
          menu-type="dropdown"
          hide-text
          :select-options="lineWidthOptions"
          @click="changeLineWidth"
        >
          <icon name="highlight" />
        </menus-button>
        <menus-toolbar-base-color
          :text="t('tools.signature.lineColor')"
          modeless
          :default-color="options.color"
          @change="changeLineColor"
        />
        <menus-button
          :text="t('tools.signature.smooth')"
          :menu-active="openSmooth"
          hide-text
          @menu-click="changeSmooth"
        >
          <icon name="highlight" />
        </menus-button>
        <t-divider layout="vertical" />
        <menus-button
          ico="image-reset"
          :text="t('tools.signature.reset')"
          hide-text
          @menu-click="resetOptions"
        />
      </div>
      <div class="umo-signature-container" :data-tip="t('tools.signature.tip')">
        <canvas ref="signatureRef" />
      </div>
    </modal>
  </menus-button>
</template>

<script setup lang="ts">
import SmoothSignature from 'smooth-signature'

const { editor } = useStore()
let dialogVisible = $ref(false)
let openSmooth = $ref(false)

const lineWidthOptions = $ref([
  { content: '2', value: 2 },
  { content: '3', value: 3 },
  { content: '4', value: 4 },
  { content: '5', value: 5 },
  { content: '6', value: 6 },
  { content: '7', value: 7 },
  { content: '8', value: 8 },
])
const options = $ref({
  width: 600,
  height: 200,
  minWidth: 4,
  maxWidth: 4,
  color: '#000',
  openSmooth,
  scale: 2,
})
let signature = $ref(null)
const signatureRef = $ref(null)

const resetOptions = () => {
  signature.width = 600
  signature.height = 200
  signature.minWidth = 4
  signature.maxWidth = 4
  signature.color = '#000'
  signature.openSmooth = false
  openSmooth = false
}

const changeLineColor = (color: string) => {
  signature.color = color
}
const changeLineWidth = ({ value }: { value: number }) => {
  signature.minWidth = value
  signature.maxWidth = value
}
const changeSmooth = () => {
  openSmooth = !openSmooth
  signature.openSmooth = openSmooth
  signature.maxWidth = openSmooth ? signature.minWidth * 2 : signature.minWidth
}

const setSignature = () => {
  try {
    const image = signature.getPNG()
    editor.value
      ?.chain()
      .focus()
      .setImage({
        type: 'signature',
        src: image ?? '',
        width: 120,
        height: 40,
        draggable: true,
        previewType: null,
      })
      .run()
    dialogVisible = false
  } catch {
    useMessage('error', t('tools.signature.notEmpty'))
  }
}

watch(
  () => dialogVisible,
  async (val: any) => {
    if (val) {
      if (!signature) {
        await nextTick()
        signature = new SmoothSignature(signatureRef, options)
      }
    } else {
      signature?.clear()
      signature = null
    }
  },
  { immediate: true },
)
</script>

<style lang="less" scoped>
.umo-signature-toolbar {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}
.umo-signature-container {
  border: solid 1px var(--umo-primary-color);
  box-sizing: border-box;
  border-radius: var(--umo-radius);
  overflow: hidden;
  position: relative;
  display: flex;
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
    opacity: 0.5;
    pointer-events: none;
  }
  canvas {
    width: 600px;
    height: 200px;
  }
}
</style>
