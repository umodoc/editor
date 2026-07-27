<template>
  <modal
    :visible="visible"
    width="714px"
    @confirm="submitBarcode"
    @close="emit('update:visible', false)"
  >
    <template #header>
      <icon name="barcode" />
      {{ dialogTitle }}
    </template>
    <div class="umo-barcode-container">
      <div class="umo-barcode-toolbar">
        <menus-button
          style="width: 126px"
          :text="t('tools.barcode.format')"
          :select-options="formats"
          menu-type="select"
          :select-value="config.format"
          @menu-click="(value) => (config.format = value)"
        />
        <t-divider layout="vertical" />
        <menus-button
          style="width: 114px"
          :text="t('tools.barcode.font')"
          :select-options="fonts"
          menu-type="select"
          :select-value="config.font"
          @menu-click="(value) => (config.font = value)"
        />
        <t-divider layout="vertical" />
        <menus-toolbar-base-color
          :text="t('tools.barcode.lineColor')"
          :default-color="config.lineColor"
          modeless
          @change="(value) => (config.lineColor = value)"
        />
        <menus-toolbar-base-background-color
          :text="t('tools.barcode.bgColor')"
          :default-color="config.background"
          modeless
          @change="(value) => (config.background = value)"
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
            <div class="umo-barcode-toolbar-more umo-scrollbar">
              <t-form size="small" label-align="left">
                <t-form-item :label="t('tools.barcode.width')">
                  <t-slider
                    v-model="config.width"
                    :min="1"
                    :max="4"
                    :step="1"
                    :tooltip-props="{ showArrow: false, theme: 'light' }"
                  />
                </t-form-item>
                <t-form-item :label="t('tools.barcode.height')">
                  <t-slider
                    v-model="config.height"
                    :min="10"
                    :max="200"
                    :step="1"
                    :tooltip-props="{ showArrow: false, theme: 'light' }"
                  />
                </t-form-item>
                <t-form-item :label="t('tools.barcode.margin')">
                  <t-slider
                    v-model="config.margin"
                    :min="0"
                    :max="25"
                    :step="1"
                    :tooltip-props="{ showArrow: false, theme: 'light' }"
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
                  <t-input v-model="config.text" size="small" />
                </t-form-item>
                <t-form-item :label="t('tools.barcode.textPosition')">
                  <t-select
                    v-model="config.textPosition"
                    :options="textPositions"
                    :popup-props="{ destroyOnClose: true, attach: container }"
                    size="small"
                  />
                </t-form-item>
                <t-form-item :label="t('tools.barcode.textMargin')">
                  <t-slider
                    v-model="config.textMargin"
                    :min="-15"
                    :max="40"
                    :step="1"
                    :tooltip-props="{ showArrow: false, theme: 'light' }"
                  />
                </t-form-item>
                <t-form-item :label="t('tools.barcode.fontSize')">
                  <t-slider
                    v-model="config.fontSize"
                    :min="8"
                    :max="36"
                    :step="1"
                    :tooltip-props="{ showArrow: false, theme: 'light' }"
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
        <div class="umo-barcode-svg umo-scrollbar">
          <div
            v-if="renderError"
            class="umo-barcode-empty"
            v-text="t('tools.barcode.renderError')"
          ></div>
          <svg
            v-show="!renderError"
            id="variable-barcode"
            ref="barcodeSvgRef"
          ></svg>
        </div>
      </div>
    </div>
  </modal>
</template>

<script setup>
import JsBarcode from 'jsbarcode'
import { svgToDataURL } from '@/utils/file'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  content: {
    type: String,
    default: '',
  },
  value: {
    type: Object,
    default: null,
  },
  mode: {
    type: String,
    default: 'editor',
  },
})

const emit = defineEmits(['update:visible', 'confirm'])

const { popupVisible, togglePopup } = usePopup()

const container = inject('container')
const options = inject('options')
const { t } = useI18n()

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
const fonts = computed(() =>
  (options.value.dicts?.fonts || []).map((item) => ({
    label: l(item.label),
    value: item.value || '',
  })),
)
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

const dialogTitle = computed(() =>
  props.value?.src || props.value?.url || props.content
    ? t('tools.barcode.edit')
    : t('tools.barcode.text'),
)

let config = $ref({ ...defaultConfig })
let renderError = $ref(false)
const barcodeSvgRef = ref(null)

const resolveInitialContent = () => props.content || props.value?.content || ''

const parseInitialConfig = () => {
  const sourceContent = resolveInitialContent()
  if (!sourceContent) {
    return { ...defaultConfig }
  }
  try {
    return {
      ...defaultConfig,
      ...JSON.parse(sourceContent),
    }
  } catch {
    return { ...defaultConfig }
  }
}

const changeFontOptions = (value) => {
  let fontOptions = config.fontOptions.split(' ')
  if (fontOptions.includes(value)) {
    fontOptions = fontOptions.filter((item) => item !== value)
  } else {
    fontOptions.push(value)
  }
  config.fontOptions = fontOptions.join(' ').trim()
}

const renderBarcode = async () => {
  try {
    await nextTick()
    JsBarcode(`${container} #variable-barcode`, config.content, config)
    renderError = false
  } catch {
    renderError = true
  }
}

const submitBarcode = () => {
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
  const width = barcodeSvgRef.value?.width?.animVal?.value || null
  const height = barcodeSvgRef.value?.height?.animVal?.value || null
  emit('confirm', {
    url: svgToDataURL(barcodeSvgRef.value?.outerHTML || ''),
    content: JSON.stringify(config),
    width,
    height,
    name: t('tools.barcode.text'),
    type: 'image/svg+xml',
  })
  emit('update:visible', false)
}

watch(
  () => props.visible,
  (value) => {
    if (!value) {
      return
    }
    config = parseInitialConfig()
    renderBarcode()
  },
  { immediate: true },
)

watch(
  () => config,
  () => {
    if (props.visible) {
      renderBarcode()
    }
  },
  { deep: true },
)
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

.umo-barcode-toolbar-more {
  width: 260px;
  height: 200px;
  padding: var(--umo-popup-content-padding);
  margin: -12px;

  :deep(.umo-form__item) {
    --td-font-body-medium: 12px;
    margin-bottom: 5px;
    font-size: 12px;
  }

  :deep(.umo-divider--horizontal) {
    margin: 5px 0;
  }
}
</style>
