<template>
  <menus-button
    :ico="content ? 'edit' : 'qrcode'"
    :text="content ? t('tools.qrcode.edit') : t('tools.qrcode.text')"
    huge
    @menu-click="menuClick"
  >
    <modal
      :visible="dialogVisible"
      icon="qrcode"
      :header="content ? t('tools.qrcode.edit') : t('tools.qrcode.text')"
      width="695px"
      @confirm="setQrcode"
      @close="dialogVisible = false"
    >
      <div class="qrcode-container">
        <div class="qrcode-toolbar">
          <menus-button
            style="width: 126px"
            :text="t('tools.qrcode.level')"
            :select-options="levels"
            menu-type="select"
            :select-value="config.ecl"
            @menu-click="(value) => (config.ecl = value)"
          ></menus-button>
          <menus-button
            menu-type="input"
            :tooltip="t('tools.qrcode.paddingTip')"
          >
            <t-input-number
              v-model="config.padding"
              size="small"
              theme="normal"
              :max="10"
              :min="0"
              :allow-input-over-limit="false"
              placeholder=""
            >
              <template #label
                ><span v-text="t('tools.qrcode.padding')"></span
              ></template>
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
              placeholder=""
            >
              <template #label
                ><span v-text="t('tools.qrcode.width')"></span
              ></template>
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
        <div class="qrcode-code">
          <t-textarea
            v-model="config.content"
            maxlength="200"
            show-limit-number
            autofocus
            autosize
            :placeholder="t('tools.qrcode.placeholder')"
          >
          </t-textarea>
          <div
            v-if="renderError && config.content !== ''"
            class="t-input__tips t-tips t-is-error"
            v-text="t('tools.qrcode.renderError')"
          ></div>
        </div>
        <div class="qrcode-render">
          <div class="qrcode-title" v-text="t('tools.qrcode.preview')"></div>
          <div class="qrcode-svg narrow-scrollbar">
            <div
              v-if="!svgCode"
              class="qrcode-empty"
              v-text="t('tools.qrcode.notEmpty')"
            ></div>
            <div class="svg" v-else v-html="svgCode"></div>
          </div>
        </div>
      </div>
    </modal>
  </menus-button>
</template>

<script setup>
import QRCode from 'qrcode-svg'
import svg64 from 'svg64'

const { content } = defineProps({
  content: {
    type: String,
  },
})

let dialogVisible = $ref(false)
const { editor } = useStore()

const menuClick = async () => {
  renderQrcode()
  dialogVisible = true
}

const levels = [
  { label: t('tools.qrcode.levelL'), value: 'L' },
  { label: t('tools.qrcode.levelM'), value: 'M' },
  { label: t('tools.qrcode.levelQ'), value: 'Q' },
  { label: t('tools.qrcode.levelH'), value: 'H' },
]
const defaultConfig = {
  ecl: 'M',
  padding: 1,
  width: 256,
  height: 256,
  color: '#000000',
  background: '#ffffff',
  content: '',
  xmlDeclaration: false,
  join: true,
  pretty: false,
  container: 'svg-viewbox',
}

let config = $ref({ ...defaultConfig })
let changed = $ref(false)

let svgCode = $ref(null)
let renderError = $ref(false)
const renderQrcode = () => {
  try {
    svgCode = null
    config.height = config.width
    const qrcode = new QRCode(config)
    svgCode = qrcode.svg()
    renderError = false
  } catch {
    svgCode = null
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
      renderQrcode()
    }
  },
  { immediate: true, deep: true },
)

// 创建或更新条形码
const setQrcode = () => {
  if (renderError || !svgCode) {
    useMessage('error', t('tools.qrcode.renderError'))
    return
  }
  if (config.content === '') {
    useMessage('error', t('tools.qrcode.notEmpty'))
    return
  }
  const { width, height } = config
  const src = svg64(svgCode)
  if (changed) {
    editor.value
      ?.chain()
      .focus()
      .setImage(
        {
          type: 'qrcode',
          src,
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
.qrcode-container {
  padding: 2px;
  .qrcode-toolbar {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
  }
  .qrcode-code {
    margin-bottom: 10px;
    :deep(.umo-textarea__inner) {
      height: 100%;
      resize: none;
    }
    .umo-input__tips {
      position: relative;
    }
  }
  .qrcode-render {
    border: solid 1px var(--td-border-level-2-color);
    border-radius: var(--umo-radius);
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    .qrcode-title {
      background-color: var(--umo-button-hover-background);
      padding: 0 10px;
      position: absolute;
      font-size: 12px;
      border-bottom-right-radius: var(--umo-radius);
    }
    .qrcode-empty {
      color: var(--umo-text-color-light);
      font-size: 12px;
      margin: 40px;
    }
    .qrcode-svg {
      box-sizing: border-box;
      padding: 30px 10px;
      min-height: 100px;
      overflow: auto;
      color: var(--umo-text-color);
      display: flex;
      align-items: center;
      justify-content: center;
      > .svg {
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
