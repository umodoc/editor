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
        <menus-button :text="t('tools.signature.clear')" @menu-click="reset">
          <icon name="clear-format" />
        </menus-button>
        <menus-toolbar-base-color
          modeless
          default-color="#000"
          @change="changeLineColor"
        />
        <menus-button
          :text="t('tools.signature.lineWidth')"
          menu-type="dropdown"
          :select-options="lineWidthOptions"
          @change="changeLineWidth"
        >
          <icon name="highlight" />
        </menus-button>
      </div>
      <div class="umo-signature-container" :data-tip="t('tools.signature.tip')">
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
  </menus-button>
</template>

<script setup>
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
    useMessage('error', t('tools.signature.notEmpty'))
  }
}

watch(
  () => dialogVisible,
  (val) => {
    if (!val) {
      reset()
    }
  },
)
</script>

<style lang="less" scoped>
.umo-signature-toolbar {
  margin-bottom: 10px;
}
.umo-signature-container {
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
    opacity: 0.5;
    pointer-events: none;
  }
}
</style>
