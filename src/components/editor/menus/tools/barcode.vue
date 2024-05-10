<template>
  <editor-menus-button huge-button @button-click="dialogVisible = true">
    <icon :name="content ? 'edit' : 'barcode'" />
    <template #text>
      <p class="button-text">条形码</p>
    </template>
  </editor-menus-button>
  <modal
    :visible="dialogVisible"
    icon="barcode"
    title="条形码生成"
    width="695px"
    @confirm="setBarcode"
    @close="dialogVisible = false"
  >
    <div class="barcode-container">
      <div class="barcode-toolbar">
        <editor-menus-button
          style="width: 126px"
          tooltip="条形码标准"
          :select-options="formats"
          button-type="select"
          :value="config.format"
          @button-click="(value) => (config.format = value)"
        ></editor-menus-button>
        <t-divider layout="vertical" />
        <editor-menus-button
          style="width: 114px"
          tooltip="文字字体"
          :select-options="options.dicts.fonts"
          button-type="select"
          :value="config.font"
          @button-click="(value) => (config.font = value)"
        ></editor-menus-button>
        <t-divider layout="vertical" />
        <editor-menus-base-color
          tooltip="条形码及文字颜色"
          :default-color="config.lineColor"
          modeless
          @change="(value) => (config.lineColor = value)"
        />
        <editor-menus-base-background-color
          tooltip="条形码背景颜色"
          :default-color="config.background"
          modeless
          @change="(value) => (config.background = value)"
        />
        <t-divider layout="vertical" />
        <editor-menus-base-bold
          :button-active="config.fontOptions.includes('bold')"
          @button-click-through="changeFontOptions('bold')"
        />
        <editor-menus-base-italic
          :button-active="config.fontOptions.includes('italic')"
          @button-click-through="changeFontOptions('italic')"
        />
        <t-divider layout="vertical" />
        <editor-menus-base-align-left
          :button-active="config.textAlign === 'left'"
          @button-click-through="config.textAlign = 'left'"
        />
        <editor-menus-base-align-center
          :button-active="config.textAlign === 'center'"
          @button-click-through="config.textAlign = 'center'"
        />
        <editor-menus-base-align-right
          :button-active="config.textAlign === 'right'"
          @button-click-through="config.textAlign = 'right'"
        />
        <t-divider layout="vertical" />
        <editor-menus-button
          tooltip="更多"
          button-type="popup"
          :popup-visible="popupVisible"
          @toggle-popup="togglePopup"
        >
          <icon name="setting" />
          <template #content>
            <div class="barcode-toolbar-more">
              <t-form size="small" label-align="left">
                <t-form-item label="单个条形的宽度：">
                  <t-slider
                    v-model="config.width"
                    :min="1"
                    :max="4"
                    :step="1"
                    :tooltip-props="{
                      showArrow: false,
                      theme: 'light',
                    }"
                  />
                </t-form-item>
                <t-form-item label="条形码的高度：">
                  <t-slider
                    v-model="config.height"
                    :min="10"
                    :max="200"
                    :step="1"
                    :tooltip-props="{
                      showArrow: false,
                      theme: 'light',
                    }"
                  />
                </t-form-item>
                <t-form-item label="条形码四周留白：">
                  <t-slider
                    v-model="config.margin"
                    :min="0"
                    :max="25"
                    :step="1"
                    :tooltip-props="{
                      showArrow: false,
                      theme: 'light',
                    }"
                  />
                </t-form-item>
                <t-divider></t-divider>
                <t-form-item label="是否显示文字：">
                  <t-checkbox v-model="config.displayValue"
                    >显示文字</t-checkbox
                  >
                </t-form-item>
                <t-form-item
                  label="文字内容："
                  help="填写后会覆盖条形码内容文本"
                >
                  <t-textarea v-model="config.text" autosize maxlength="100" />
                </t-form-item>
                <t-form-item label="文字所在位置：">
                  <t-select
                    v-model="config.textPosition"
                    :options="textPositions"
                    :popup-props="{
                      destroyOnClose: true,
                      attach: container,
                    }"
                  >
                  </t-select>
                </t-form-item>
                <t-form-item label="文字上下距离：">
                  <t-slider
                    v-model="config.textMargin"
                    :min="-15"
                    :max="40"
                    :step="1"
                    :tooltip-props="{
                      showArrow: false,
                      theme: 'light',
                    }"
                  />
                </t-form-item>
                <t-form-item label="文字字体大小：">
                  <t-slider
                    v-model="config.fontSize"
                    :min="8"
                    :max="36"
                    :step="1"
                    :tooltip-props="{
                      showArrow: false,
                      theme: 'light',
                    }"
                  />
                </t-form-item>
              </t-form>
            </div>
          </template>
        </editor-menus-button>
      </div>
      <div class="barcode-code">
        <t-input
          v-model="config.content"
          maxlength="44"
          show-limit-number
          autofocus
          clearable
          placeholder="请输入要转化成条形码的内容"
          :status="renderError && config.content !== '' ? 'error' : ''"
        >
          <template #prefixIcon>
            <icon name="barcode" />
          </template>
        </t-input>
        <div
          v-if="renderError && config.content"
          class="t-input__tips t-tips t-is-error"
        >
          您输入的内容可能不符合当前选择的条形码规范约束，请检查。
        </div>
      </div>
      <div class="barcode-render">
        <div class="barcode-title">预览</div>
        <div class="barcode-svg narrow-scrollbar">
          <div v-if="renderError" class="barcode-empty">当前无预览内容</div>
          <svg ref="barcodeSvgRef" id="barcode" v-show="!renderError"></svg>
        </div>
      </div>
    </div>
  </modal>
</template>

<script setup>
// https://github.com/lindell/JsBarcode/wiki/Options
import JsBarcode from 'jsbarcode'
import svg64 from 'svg64'

const { content } = defineProps({
  content: {
    type: String,
  },
})

let { popupVisible, togglePopup } = usePopup()

let dialogVisible = $ref(false)
const { container, options, editor } = useStore()

// 工具栏
const formats = [
  { label: 'CODE128', value: 'CODE128' },
  { label: 'CODE128 A', value: 'CODE128A' },
  { label: 'CODE128 B', value: 'CODE128B' },
  { label: 'CODE128 C', value: 'CODE128C' },
  { label: 'EAN13', value: 'EAN13' },
  { label: 'UPC', value: 'UPC' },
  { label: 'CODE39', value: 'CODE39' },
  { label: 'ITF14', value: 'ITF14' },
  { label: 'ITF', value: 'ITF' },
  { label: 'MSI', value: 'MSI' },
  { label: 'MSI10', value: 'MSI10' },
  { label: 'MSI11', value: 'MSI11' },
  { label: 'MSI1010', value: 'MSI1010' },
  { label: 'MSI1110', value: 'MSI1110' },
  { label: 'Pharmacode', value: 'Pharmacode' },
]
const textPositions = [
  { label: '底部', value: 'bottom' },
  { label: '顶部', value: 'top' },
]
const defaultConfig = {
  content: '',
  width: 2,
  height: 100,
  font: null,
  format: 'CODE128',
  lineColor: '#000',
  background: '',
  fontOptions: '',
  displayValue: true,
  textAlign: 'center',
  textPosition: 'bottom',
  fontSize: 20,
  textMargin: 2,
  margin: 10,
  text: undefined,
}
let config = $ref({ ...defaultConfig })
let changed = $ref(false)

const changeFontOptions = (val) => {
  let fontOptions = config.fontOptions.split(' ')
  if (fontOptions.includes(val)) {
    fontOptions = fontOptions.filter((item) => item !== val)
  } else {
    fontOptions.push(val)
  }
  config.fontOptions = fontOptions.join(' ').trim()
}

// 生成条形码
let renderError = $ref(false)
const barcodeSvgRef = $ref(null)
const renderBarcode = async () => {
  try {
    await nextTick()
    JsBarcode(`${container} #barcode`, config.content, config)
    renderError = false
  } catch {
    renderError = true
  }
}
watch(
  () => dialogVisible,
  (val) => {
    if (val) {
      config = content ? JSON.parse(content) : { ...defaultConfig }
      setTimeout(() => (changed = false), 200)
    }
  },
  { immediate: true },
)
watch(
  () => config,
  () => {
    if (dialogVisible) {
      changed = true
      renderBarcode()
    }
  },
  { immediate: true, deep: true },
)

// 创建或更新条形码
const setBarcode = () => {
  if (renderError) {
    useMessage('error', '条形码生成失败')
    return
  }
  if (config.content === '') {
    useMessage('error', '条形码内容不能为空')
    return
  }
  const width = barcodeSvgRef.width.animVal.value
  const height = barcodeSvgRef.height.animVal.value
  if (changed) {
    editor.value
      ?.chain()
      .focus()
      .setImage(
        {
          type: 'barcode',
          src: svg64(barcodeSvgRef.outerHTML),
          content: JSON.stringify(config),
          width,
          height,
        },
        !!content,
      )
      .run()
  }
  dialogVisible = false
}
</script>

<style lang="less" scoped>
.barcode-container {
  padding: 2px;
  .barcode-toolbar {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
  }
  .barcode-code {
    margin-bottom: 10px;
    :deep(.umo-textarea__inner) {
      height: 100%;
      resize: none;
    }
    .umo-input__tips {
      position: relative;
    }
  }
  .barcode-render {
    border: solid 1px var(--td-border-level-2-color);
    border-radius: var(--umo-radius);
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    .barcode-title {
      background-color: var(--umo-button-hover-background);
      padding: 0 10px;
      position: absolute;
      font-size: 12px;
      border-bottom-right-radius: var(--umo-radius);
    }
    .barcode-svg {
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      padding: 30px 10px;
      min-height: 100px;
      overflow: auto;
      color: var(--umo-text-color);
      svg {
        border: solid 1px var(--umo-border-color-light);
      }
    }
    .barcode-empty {
      color: var(--umo-text-color-light);
      font-size: 12px;
      margin: 20px;
    }
  }
}
</style>

<style lang="less">
.barcode-toolbar-more {
  padding: 10px 20px 10px 15px;
  width: 300px;
  .umo-form__item {
    margin-bottom: 5px;
  }
  .umo-form__label {
    margin-right: 20px;
  }
  .umo-divider--horizontal {
    margin: 10px 0;
  }
}
</style>
