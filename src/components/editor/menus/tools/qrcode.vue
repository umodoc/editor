<template>
  <editor-menus-button :huge-button="hugeButton" @button-click="buttonClick">
    <icon :name="content ? 'edit' : 'qrcode'" />
    <template #text>
      <p class="button-text">二维码</p>
    </template>
  </editor-menus-button>
  <modal
    :visible="dialogVisible"
    icon="qrcode"
    :title="content ? '编辑二维码' : '插入二维码'"
    width="695px"
    @confirm="setQrcode"
    @close="dialogVisible = false"
  >
    <div class="qrcode-container">
      <div class="qrcode-toolbar">
        <editor-menus-button
          style="width: 126px"
          tooltip="二维码容错能力"
          :select-options="levels"
          button-type="select"
          :value="config.ecl"
          @button-click="(value) => (config.ecl = value)"
        ></editor-menus-button>
        <editor-menus-button button-type="input" tooltip="二维码四周留白大小">
          <t-input-number
            v-model="config.padding"
            size="small"
            theme="normal"
            :max="10"
            :min="0"
            :allow-input-over-limit="false"
            placeholder=""
          >
            <template #label><span>四周留白：</span></template>
          </t-input-number>
        </editor-menus-button>
        <editor-menus-button button-type="input" tooltip="二维码的宽度和高度">
          <t-input-number
            v-model="config.width"
            size="small"
            theme="normal"
            :max="1024"
            :min="64"
            :allow-input-over-limit="false"
            placeholder=""
          >
            <template #label><span>宽高度：</span></template>
          </t-input-number>
        </editor-menus-button>
        <t-divider layout="vertical" />
        <editor-menus-base-color
          tooltip="二维码颜色"
          :default-color="config.color"
          modeless
          @change="(value) => (config.color = value)"
        />
        <editor-menus-base-background-color
          tooltip="二维码背景颜色"
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
          placeholder="请输入要转化成二维码的内容"
        >
        </t-textarea>
        <div
          v-if="renderError && config.content !== ''"
          class="t-input__tips t-tips t-is-error"
        >
          二维码生成错误。
        </div>
      </div>
      <div class="qrcode-render">
        <div class="qrcode-title">预览</div>
        <div class="qrcode-svg narrow-scrollbar">
          <div v-if="!svgCode" class="qrcode-empty">当前无预览内容</div>
          <div class="svg" v-else v-html="svgCode"></div>
        </div>
      </div>
    </div>
  </modal>
</template>

<script setup>
import QRCode from 'qrcode-svg'
import svg64 from 'svg64'

const { content } = defineProps({
  hugeButton: {
    type: Boolean,
    default: true,
  },
  content: {
    type: String,
  },
})

let dialogVisible = $ref(false)
const { editor } = useStore()

const buttonClick = async () => {
  renderQrcode()
  dialogVisible = true
}

const levels = [
  { label: '低', value: 'L' },
  { label: '中', value: 'M' },
  { label: '高', value: 'Q' },
  { label: '最高', value: 'H' },
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
    useMessage('error', '条形码生成失败')
    return
  }
  if (config.content === '') {
    useMessage('error', '条形码内容不能为空')
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
