<template>
  <modal
    :visible="visible"
    width="532px"
    @confirm="submitQrcode"
    @close="emit('update:visible', false)"
  >
    <template #header>
      <icon name="qrcode" />
      {{ dialogTitle }}
    </template>
    <div class="umo-qrcode-container">
      <div class="umo-qrcode-toolbar">
        <menus-button
          style="width: 126px"
          :text="t('tools.qrcode.level')"
          :select-options="levels"
          menu-type="select"
          :select-value="config.ecl"
          @menu-click="(value) => (config.ecl = value)"
        />
        <menus-button menu-type="input" :tooltip="t('tools.qrcode.paddingTip')">
          <t-input-number
            v-model="config.padding"
            size="small"
            theme="normal"
            :max="10"
            :min="0"
            :allow-input-over-limit="false"
          >
            <template #label>
              <span v-text="t('tools.qrcode.padding')"></span>
            </template>
          </t-input-number>
        </menus-button>
        <menus-button menu-type="input" :tooltip="t('tools.qrcode.widthTip')">
          <t-input-number
            v-model="config.width"
            size="small"
            theme="normal"
            :max="1024"
            :min="64"
            :allow-input-over-limit="false"
          >
            <template #label>
              <span v-text="t('tools.qrcode.width')"></span>
            </template>
          </t-input-number>
        </menus-button>
        <t-divider layout="vertical" />
        <menus-toolbar-base-color
          :text="t('tools.qrcode.color')"
          :default-color="config.color"
          modeless
          @change="(value) => (config.color = value)"
        />
        <menus-toolbar-base-background-color
          :text="t('tools.qrcode.bgColor')"
          :default-color="config.background"
          modeless
          @change="(value) => (config.background = value)"
        />
      </div>
      <div class="umo-qrcode-code">
        <t-textarea
          v-model="config.content"
          maxlength="200"
          show-limit-number
          autofocus
          autosize
          :placeholder="t('tools.qrcode.placeholder')"
        />
        <div
          v-if="renderError && config.content !== ''"
          class="umo-barcode-error"
          v-text="t('tools.qrcode.renderError')"
        ></div>
      </div>
      <div class="umo-qrcode-render">
        <div class="umo-qrcode-title" v-text="t('tools.qrcode.preview')"></div>
        <div class="umo-qrcode-svg umo-scrollbar">
          <div
            v-if="!svgCode"
            class="umo-qrcode-empty"
            v-text="t('tools.qrcode.notEmpty')"
          ></div>
          <div v-else class="umo-svg-render" v-html="svgCode"></div>
        </div>
      </div>
    </div>
  </modal>
</template>

<script setup>
import { qrcode } from 'pure-svg-code'
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

const container = inject('container')
const { t } = useI18n()

const levels = [
  { label: t('tools.qrcode.levelL'), value: 'L' },
  { label: t('tools.qrcode.levelM'), value: 'M' },
  { label: t('tools.qrcode.levelQ'), value: 'Q' },
  { label: t('tools.qrcode.levelH'), value: 'H' },
]
const defaultConfig = {
  content: '',
  padding: 1,
  width: 256,
  height: 256,
  color: '#000000',
  background: '#ffffff',
  ecl: 'M',
}

const dialogTitle = computed(() =>
  props.value?.src || props.value?.url || props.content
    ? t('tools.qrcode.edit')
    : t('tools.qrcode.text'),
)

let config = $ref({ ...defaultConfig })
let svgCode = $ref(null)
let renderError = $ref(false)

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

const renderQrcode = () => {
  try {
    svgCode = null
    config.height = config.width
    svgCode = qrcode(config)
    renderError = false
  } catch {
    svgCode = null
    renderError = true
  }
}

const submitQrcode = () => {
  if (renderError || !svgCode) {
    useMessage('error', {
      attach: container,
      content: t('tools.qrcode.renderError'),
    })
    return
  }
  if (config.content === '') {
    useMessage('error', {
      attach: container,
      content: t('tools.qrcode.notEmpty'),
    })
    return
  }
  emit('confirm', {
    url: svgToDataURL(svgCode),
    content: JSON.stringify(config),
    width: config.width,
    height: config.height,
    name: t('tools.qrcode.text'),
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
    renderQrcode()
  },
  { immediate: true },
)

watch(
  () => config,
  () => {
    if (props.visible) {
      renderQrcode()
    }
  },
  { deep: true },
)
</script>

<style lang="less" scoped>
.umo-qrcode-container {
  padding: 2px;
  .umo-qrcode-toolbar {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
  }
  .umo-qrcode-code {
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
  .umo-qrcode-render {
    border: solid 1px var(--td-border-level-2-color);
    border-radius: var(--umo-radius);
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    .umo-qrcode-title {
      background-color: var(--umo-button-hover-background);
      padding: 0 10px;
      position: absolute;
      font-size: 12px;
      border-bottom-right-radius: var(--umo-radius);
    }
    .umo-qrcode-empty {
      color: var(--umo-text-color-light);
      font-size: 12px;
      margin: 40px;
    }
    .umo-qrcode-svg {
      box-sizing: border-box;
      padding: 30px 10px;
      min-height: 100px;
      overflow: auto;
      color: var(--umo-text-color);
      display: flex;
      align-items: center;
      justify-content: center;
      > .umo-svg-render {
        border: solid 1px var(--umo-border-color-light);
        :deep(svg) {
          display: block;
          width: 256px;
          height: 256px;
        }
      }
    }
  }
}
</style>
