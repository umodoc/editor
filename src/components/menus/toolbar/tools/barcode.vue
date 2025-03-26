<template>
  <menus-button
    :ico="content ? 'edit' : 'barcode'"
    :text="content ? t('tools.barcode.edit') : t('tools.barcode.text')"
    huge
    @menu-click="dialogVisible = true"
  >
    <modal
      :visible="dialogVisible"
      icon="barcode"
      :header="t('tools.barcode.title')"
      width="720px"
      @confirm="setBarcode"
      @close="dialogVisible = false"
    >
      <div class="umo-barcode-container">
        <div class="umo-barcode-toolbar">
          <menus-button
            style="width: 126px"
            :text="t('tools.barcode.format')"
            :select-options="formats"
            menu-type="select"
            :select-value="config.format"
            @menu-click="
              (value: string) => {
                config.format = value
              }
            "
          ></menus-button>
          <t-divider layout="vertical" />
          <menus-button
            style="width: 114px"
            :text="t('tools.barcode.font')"
            :select-options="fonts ?? []"
            menu-type="select"
            :select-value="config.font"
            @menu-click="
              (value: string) => {
                config.font = value
              }
            "
          ></menus-button>
          <t-divider layout="vertical" />
          <menus-toolbar-base-color
            :text="t('tools.barcode.lineColor')"
            :default-color="config.lineColor"
            modeless
            @change="(value: any) => (config.lineColor = value)"
          />
          <menus-toolbar-base-background-color
            :text="t('tools.barcode.bgColor')"
            :default-color="config.background"
            modeless
            @change="(value: any) => (config.background = value)"
          />
          <t-divider layout="vertical" />
          <menus-toolbar-base-bold
            :menu-active="config.fontOptions.includes('bold')"
            @menu-click-through="changeFontOptions('bold')"
          />
          <menus-toolbar-base-italic
            :menu-active="config.fontOptions.includes('italic')"
            @menu-click-through="changeFontOptions('italic')"
          />
          <t-divider layout="vertical" />
          <menus-toolbar-base-align-left
            :menu-active="config.textAlign === 'left'"
            @menu-click-through="config.textAlign = 'left'"
          />
          <menus-toolbar-base-align-center
            :menu-active="config.textAlign === 'center'"
            @menu-click-through="config.textAlign = 'center'"
          />
          <menus-toolbar-base-align-right
            :menu-active="config.textAlign === 'right'"
            @menu-click-through="config.textAlign = 'right'"
          />
          <t-divider layout="vertical" />
          <menus-button
            :text="t('tools.barcode.more')"
            menu-type="popup"
            :popup-visible="popupVisible"
            @toggle-popup="togglePopup"
          >
            <icon name="setting" />
            <template #content>
              <div class="umo-barcode-toolbar-more">
                <t-form size="small" label-align="left">
                  <t-form-item :label="t('tools.barcode.width')">
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
                  <t-form-item :label="t('tools.barcode.height')">
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
                  <t-form-item :label="t('tools.barcode.margin')">
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
                  <t-form-item :label="t('tools.barcode.displayValue')">
                    <t-checkbox v-model="config.displayValue">
                      {{ t('tools.barcode.displayValueText') }}
                    </t-checkbox>
                  </t-form-item>
                  <t-form-item
                    :label="t('tools.barcode.textContent')"
                    :help="t('tools.barcode.textContentTip')"
                  >
                    <t-textarea
                      v-model="config.text"
                      autosize
                      maxlength="100"
                    />
                  </t-form-item>
                  <t-form-item :label="t('tools.barcode.textPosition')">
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
                  <t-form-item :label="t('tools.barcode.textMargin')">
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
                  <t-form-item :label="t('tools.barcode.fontSize')">
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
          </menus-button>
        </div>
        <div class="umo-barcode-code">
          <t-input
            v-model="config.content"
            maxlength="44"
            show-limit-number
            autofocus
            clearable
            :placeholder="t('tools.barcode.placeholder')"
            :status="renderError && config.content !== '' ? 'error' : 'default'"
          >
            <template #prefixIcon>
              <icon name="barcode" />
            </template>
          </t-input>
          <div
            v-if="renderError && config.content"
            class="umo-barcode-error"
            v-text="t('tools.barcode.error')"
          ></div>
        </div>
        <div class="umo-barcode-render">
          <div
            class="umo-barcode-title"
            v-text="t('tools.barcode.preview')"
          ></div>
          <div class="umo-barcode-svg narrow-scrollbar">
            <div
              v-if="renderError"
              class="umo-barcode-empty"
              v-text="t('tools.barcode.renderError')"
            ></div>
            <svg v-show="!renderError" id="barcode" ref="barcodeSvgRef"></svg>
          </div>
        </div>
      </div>
    </modal>
  </menus-button>
</template>

<script setup lang="ts">
import JsBarcode from 'jsbarcode'
import svg64 from 'svg64'

import { shortId } from '@/utils/short-id'

const { content } = defineProps({
  content: {
    type: String,
    default: '',
  },
})

const { popupVisible, togglePopup } = usePopup()

let dialogVisible = $ref(false)
const container = inject('container')
const editor = inject('editor')
const options = inject('options')
const uploadFileMap = inject('uploadFileMap')

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
const fonts = options.value.dicts?.fonts.map((item: any) => {
  return {
    label: l(item.label),
    value: item.value ?? '',
  }
})
const textPositions = [
  { label: t('tools.barcode.bottom'), value: 'bottom' },
  { label: t('tools.barcode.top'), value: 'top' },
]
const defaultConfig = {
  content: '',
  width: 2,
  height: 100,
  font: '',
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

const changeFontOptions = (val: string) => {
  let fontOptions = config.fontOptions.split(' ')
  if (fontOptions.includes(val)) {
    fontOptions = fontOptions.filter((item: any) => item !== val)
  } else {
    fontOptions.push(val)
  }
  config.fontOptions = fontOptions.join(' ').trim()
}

// 生成条形码
let renderError = $ref(false)
const barcodeSvgRef = $ref<
  | (HTMLElement & {
      width: { animVal: { value: number } }
      height: { animVal: { value: number } }
    })
  | null
>(null)
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
  (val: boolean) => {
    if (val) {
      config = content ? JSON.parse(content) : { ...defaultConfig }
      setTimeout(() => {
        changed = false
      }, 200)
    }
  },
  { immediate: true },
)
watch(
  () => config,
  () => {
    if (dialogVisible) {
      changed = true
      void renderBarcode()
    }
  },
  { immediate: true, deep: true },
)

// 创建或更新条形码
const setBarcode = () => {
  if (renderError) {
    useMessage('error', {
      attach: container,
      content: t('tools.barcode.renderError'),
    })
    return
  }
  if (config.content === '') {
    useMessage('error', {
      attach: container,
      content: t('tools.barcode.notEmpty'),
    })
    return
  }
  const id = shortId(10)
  const name = `barcode-${id}.svg`
  const width = barcodeSvgRef?.width.animVal.value
  const height = barcodeSvgRef?.height.animVal.value
  const blob = new Blob([barcodeSvgRef.outerHTML], {
    type: 'image/svg+xml',
  })
  const file = new File([blob], name, {
    type: 'image/svg+xml',
  })
  uploadFileMap.value.set(id, file)

  if (changed) {
    editor.value
      ?.chain()
      .focus()
      .setImage(
        {
          id,
          type: 'barcode',
          name,
          size: file.size,
          src: svg64(barcodeSvgRef?.outerHTML ?? ''),
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
.umo-barcode-container {
  padding: 2px;
  .umo-barcode-toolbar {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
  }
  .umo-barcode-code {
    margin-bottom: 10px;
    :deep(.umo-textarea__inner) {
      height: 100%;
      resize: none;
    }
    .umo-barcode-error {
      font-size: 12px;
      color: var(--umo-error-color);
    }
  }
  .umo-barcode-render {
    border: solid 1px var(--td-border-level-2-color);
    border-radius: var(--umo-radius);
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    .umo-barcode-title {
      background-color: var(--umo-button-hover-background);
      padding: 0 10px;
      position: absolute;
      font-size: 12px;
      border-bottom-right-radius: var(--umo-radius);
    }
    .umo-barcode-svg {
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
    .umo-barcode-empty {
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
