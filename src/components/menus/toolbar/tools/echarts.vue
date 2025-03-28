<template>
  <menus-button
    :ico="'echarts'"
    :text="t('tools.echarts.text')"
    huge
    @menu-click="menuClick"
  >
    <modal
      :visible="dialogVisible"
      icon="echarts"
      :header="
        dialogAddOrEdit ? t('tools.echarts.add') : t('tools.echarts.edit')
      "
      width="960px"
      @confirm="setConfirm"
      @close="dialogVisible = false"
    >
      <div class="umo-echarts-container">
        <div class="umo-echarts-header">
          <t-radio-group
            v-if="modelMode === 1"
            v-model="baseModeSet"
            variant="default-filled"
            default-value="0"
          >
            <t-radio-button :value="0">{{
              t('tools.echarts.setting')
            }}</t-radio-button>
            <t-radio-button :value="1">{{
              t('tools.echarts.dataGrid')
            }}</t-radio-button>
          </t-radio-group>
          <t-radio-group
            v-model="modelMode"
            variant="default-filled"
            default-value="0"
          >
            <t-radio-button :value="1">{{
              t('tools.echarts.visualization')
            }}</t-radio-button>
            <t-radio-button :value="0">{{
              t('tools.echarts.source')
            }}</t-radio-button>
          </t-radio-group>
        </div>
        <div v-if="modelMode === 0" class="umo-echarts-source-center">
          <t-textarea
            v-model="sourceOptions"
            class="umo-echarts-code"
            autofocus
            :placeholder="t('tools.echarts.placeholder')"
          />
          <div class="umo-echarts-render">
            <div id="echartsSourceModeId" class="umo-echarts-svg"></div>
          </div>
        </div>
        <div
          v-if="modelMode === 1 && baseModeSet === 0"
          class="umo-echarts-source-center"
        >
          <div class="umo-echarts-render">
            <div id="echartsSettingModeId" class="umo-echarts-svg"></div>
          </div>
          <div class="umo-echarts-settting">
            <t-form label-align="top">
              <!--图形类型-->
              <t-form-item
                :label="t('tools.echarts.set.seriesType')"
                name="seriesType"
              >
                <t-select
                  v-model="baseConfig.config.seriesType"
                  class="demo-select-base"
                >
                  <t-option
                    v-for="(item, index) in baseData.seriesType"
                    :key="index"
                    :value="item.code"
                    :label="item.name"
                  >
                    {{ item.name }}
                  </t-option>
                </t-select>
              </t-form-item>
              <t-form-item v-if="baseConfig.config.seriesType === 'line'">
                <!--平滑折线-->
                <t-checkbox
                  v-if="baseConfig.config.seriesType === 'line'"
                  v-model="baseConfig.config.smooth"
                  >{{ t('tools.echarts.set.smooth') }}</t-checkbox
                >
              </t-form-item>
              <t-form-item>
                <!--图例-->
                <t-checkbox v-model="baseConfig.config.legend">{{
                  t('tools.echarts.set.legend')
                }}</t-checkbox>
              </t-form-item>
              <!--图例布局-->
              <t-form-item
                v-if="baseConfig.config.legend"
                :label="t('tools.echarts.set.legendorient')"
                name="legendorient"
              >
                <t-select
                  v-model="baseConfig.config.legendorient"
                  class="demo-select-base"
                >
                  <t-option
                    v-for="(item, index) in baseData.legendorient"
                    :key="index"
                    :value="item.code"
                    :label="item.name"
                  >
                    {{ item.name }}
                  </t-option>
                </t-select>
              </t-form-item>
              <!--图例纵向位置-->
              <t-form-item
                v-if="baseConfig.config.legend"
                :label="t('tools.echarts.set.legendlocation')"
                name="legend"
              >
                <t-select
                  v-model="baseConfig.config.legendlocation"
                  class="demo-select-base"
                >
                  <t-option
                    v-for="(item, index) in baseData.legendlocation"
                    :key="index"
                    :value="item.code"
                    :label="item.name"
                  >
                    {{ item.name }}
                  </t-option>
                </t-select>
              </t-form-item>
              <!--图例横向位置-->
              <t-form-item
                v-if="baseConfig.config.legend"
                :label="t('tools.echarts.set.legendleft')"
                name="legendleft"
              >
                <t-select
                  v-model="baseConfig.config.legendleft"
                  class="demo-select-base"
                >
                  <t-option
                    v-for="(item, index) in baseData.titleleft"
                    :key="index"
                    :value="item.code"
                    :label="item.name"
                  >
                    {{ item.name }}
                  </t-option>
                </t-select>
              </t-form-item>
              <!--标题名称-->
              <t-form-item
                :label="t('tools.echarts.set.titleText')"
                name="title"
              >
                <t-input
                  v-model="baseConfig.config.titleText"
                  :placeholder="t('tools.echarts.set.titleTextPlaceholder')"
                />
              </t-form-item>
              <!--标题位置-->
              <t-form-item
                v-if="baseConfig.config.titleText != ''"
                :label="t('tools.echarts.set.titleleft')"
                name="titleleft"
              >
                <t-select
                  v-model="baseConfig.config.titleleft"
                  class="demo-select-base"
                >
                  <t-option
                    v-for="(item, index) in baseData.titleleft"
                    :key="index"
                    :value="item.code"
                    :label="item.name"
                  >
                    {{ item.name }}
                  </t-option>
                </t-select>
              </t-form-item>
            </t-form>
          </div>
        </div>
        <div
          v-if="modelMode === 1 && baseModeSet === 1"
          class="umo-echarts-source-center"
        >
          <div class="umo-echarts-render" style="margin-left: 2px">
            <t-table
              id="echartsSettingGridId"
              class="umo-echarts-table"
              row-key="tabkey"
              :columns="baseData.Columns"
              :data="baseConfig.data"
              size="small"
              :show-header="false"
              :fixed-rows="[1]"
              :editable-cell-state="editableCellState"
              bordered
              lazy-load
            />
          </div>
        </div>
      </div>
    </modal>
  </menus-button>
</template>

<script setup lang="ts">
import { Input } from 'tdesign-vue-next'

import {
  calbaseConfigData,
  calbaseConfigOptions,
} from '@/extensions/echarts/cal-service'
import { useEchartsLoader } from '@/extensions/echarts/init-service'
import { getSelectionNode } from '@/extensions/selection'
import { shortId } from '@/utils/short-id'

const { mode } = defineProps({
  mode: {
    type: String,
    default: undefined,
  },
})

const container = inject('container')
const editor = inject('editor')
const options = inject('options')

const { loadEchartScript } = useEchartsLoader(options.value)

// 弹窗口显示隐藏 true 显示 默认隐藏
let dialogVisible = $ref(false)
// 弹窗后标题是编辑还是新增，true: 新增 fasle: 编辑
let dialogAddOrEdit = $ref(true)
// 界面显示模式
let modelMode = $ref(0)
// 当前节点缓存信息
let curNode = $ref(null)
// sourceOptions 高级模型-配置信息信息
let sourceOptions = $ref(null)

// 高级模式下 mychart 展示对象
let sourceMyChart: any = null
// 基础模式下 mychart 展示对象，避免响应式
let settingMyChart: any = null

// 基础模型下默认设置界面，0: 图形界面 1: 数据界面
let baseModeSet = $ref(0)
// baseConfig 可视化界面下的配置，需要保存的动态数据
let baseConfig = $ref({ data: [], config: {} })
// 基础数据，不会改变的数据
let baseData: any = {}
// 弹出窗显示
const menuClick = () => {
  if (dialogVisible) {
    return
  }
  baseModeSet = 0 // 默认打开都是设置界面

  const openAddMode = () => {
    dialogAddOrEdit = true
    modelMode = options.value.echarts?.mode
    sourceOptions = null
    initBaseConfig()
    dialogVisible = true
  }

  // 新增模式
  if (mode === 'add') {
    openAddMode()
    return
  }
  curNode = getSelectionNode(editor.value)
  // 选中节点为 echarts 节点时，去读取界面上的配置信息
  if (curNode?.type?.name !== 'echarts') {
    openAddMode()
    return
  }

  // 更新模式
  dialogAddOrEdit = false
  modelMode = curNode.attrs?.mode
  sourceOptions = null
  if (curNode.attrs?.chartOptions !== null) {
    sourceOptions = JSON.stringify(curNode.attrs?.chartOptions)
  }
  initBaseConfig()
  loadBaseConfig(curNode.attrs?.chartConfig)
  // 弹窗点击显示
  dialogVisible = true
}
// 弹窗点击确定时，对父界面的影响设置
const setConfirm = () => {
  let resOptions = {
    id: '',
    name: '',
    mode: modelMode,
    chartOptions: null,
    chartConfig: null,
    describe: '',
    nodeAlign: 'center',
    margin: {},
  }
  if (!dialogAddOrEdit) {
    resOptions = JSON.parse(JSON.stringify(curNode.attrs))
  } else {
    resOptions.id = shortId()
    resOptions.mode = modelMode
  }
  if (resOptions.mode === 1) {
    // 可配置模式
    const newData = calbaseConfigData(baseConfig.data)
    resOptions.chartConfig = { data: newData, config: baseConfig.config } as any

    if (settingMyChart === null) {
      const dialog = useAlert({
        attach: container,
        theme: 'warning',
        header: t('tools.echarts.text'),
        body: t('tools.echarts.settingerror'), // 请确认预览视图是否正确显示！
        onConfirm() {
          dialog.destroy()
        },
      })
      return
    }
  } else {
    // 源码模式
    try {
      resOptions.chartOptions = JSON.parse(sourceOptions)
    } catch (e) {
      const dialog = useAlert({
        attach: container,
        theme: 'warning',
        header: t('tools.echarts.text'),
        body: t('tools.echarts.sourceerror'), // 结构不正确
        onConfirm() {
          dialog.destroy()
        },
      })
      return
    }
    if (sourceMyChart === null) {
      const dialog = useAlert({
        attach: container,
        theme: 'warning',
        header: t('tools.echarts.text'),
        body: t('tools.echarts.sourceerror2'), // 结构不正确或未定义
        onConfirm() {
          dialog.destroy()
        },
      })
      return
    }
  }
  // 设置了保存图片或者高级模式时，自动保存图片
  if (options.value.echarts?.renderImage || resOptions.mode === 0) {
    // 源码模式或 havImage
    const dataURI = (
      resOptions.mode === 1 ? settingMyChart : sourceMyChart
    ).getDataURL({
      type: 'png', // 可以是'png'或'jpeg'
      pixelRatio: 5, // 提高分辨率，默认是1
      backgroundColor: '#fff', // 背景颜色，默认是透明
    })
    const byteString = atob(dataURI.split(',')[1])
    const [typePart] = dataURI.split(',')
    const [protocol, mimeString] = typePart
      .split(':')
      .slice(1)
      .toString()
      .split(';')
    // 分离出MIME类型
    // var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    // 写入字节流到Blob
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    const fileBlob = new Blob([ab], { type: mimeString })
    options.value.onFileUpload(fileBlob, resOptions.id, 'echarts')
  }
  //
  if (!dialogAddOrEdit) {
    editor.value.commands.updateEcharts(resOptions)
  } else {
    editor.value.commands.setEcharts(resOptions)
  }
  dialogVisible = false
}

watch(
  () => [sourceOptions, modelMode, baseConfig.config, baseModeSet],
  async () => {
    try {
      disposeChart()
      await nextTick()
      await loadModeEchart()
    } catch (e) {}
  },
  { deep: true, immediate: false },
)

// 界面数据加载
const loadModeEchart = async () => {
  await nextTick()
  await loadEchartScript()
  // 接下来的使用就跟之前一样，初始化图表，设置配置项
  if (typeof echarts !== 'undefined') {
    //  根据参数不同 实现效果不同
    disposeChart()
    const _curDomSetting = document.getElementById('echartsSettingModeId')
    const _curDomSource = document.getElementById('echartsSourceModeId')
    if (modelMode === 1 && _curDomSetting !== null) {
      //  实际的参数设置
      const newData = calbaseConfigData(baseConfig.data)
      if (!(newData === null || newData.length === 0)) {
        const newOptions = calbaseConfigOptions(
          JSON.parse(JSON.stringify(newData)),
          JSON.parse(JSON.stringify(baseConfig.config)),
          options.value,
        )

        settingMyChart = echarts.init(_curDomSetting)
        try {
          settingMyChart.setOption(newOptions)
        } catch (e) {
          disposeChart()
        }
      }
    } else if (
      modelMode === 0 &&
      sourceOptions !== null &&
      _curDomSource !== null
    ) {
      sourceMyChart = echarts.init(_curDomSource)
      try {
        const calOptions = normalizeJsonString(sourceOptions)
        if (calOptions !== sourceOptions) {
          sourceOptions = calOptions
        }
        sourceMyChart.setOption(JSON.parse(sourceOptions))
      } catch (e) {
        disposeChart()
      }
    }
  }
}
// 控件每次加载之前需要销毁下，防止出现重复加载不成功的问题
const disposeChart = () => {
  if (sourceMyChart !== null) {
    sourceMyChart.dispose()
    sourceMyChart = null
  }
  if (settingMyChart !== null) {
    settingMyChart.dispose()
    settingMyChart = null
  }
}
// 对输入json处理，属性和单引号需要转换成双引号
const normalizeJsonString = (jsonString: any) => {
  // 正则表达式，用于匹配键名（假设键名是有效的JavaScript标识符）
  const keyPattern = /(\s*)([a-zA-Z_$][\w$]*)(\s*:\s*)/g
  // 正则表达式，用于匹配单引号字符串并将其转为双引号
  const singleQuotePattern = /'([^']*)'/g

  // 将单引号转为双引号
  jsonString = jsonString.replace(singleQuotePattern, '"$1"')
  // 给键名添加双引号
  jsonString = jsonString.replace(keyPattern, '$1"$2"$3')
  return jsonString
}

// --基础模型下的相关方法和设置-开始
// let tableLayout='fixed'
const initBaseConfig = () => {
  baseData = {}
  baseData.Columns = []
  // 创建字母表A-Z
  const alphabet = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(i + 65),
  )

  // 循环遍历每个字母，并为其创建列配置
  alphabet.forEach((letter) => {
    baseData.Columns.push({
      title: letter,
      colKey: letter.toUpperCase(),
      align: 'center',
      // 只有'A'列是固定的
      fixed: letter === 'A' ? 'left' : undefined,
      // 编辑状态相关配置，全部集中在 edit
      edit: {
        component: Input,
        // props, 透传全部属性到 Input 组件（可以是一个函数，不同行有不同的 props 属性 时，使用 Function）
        props: {
          clearable: false,
          autofocus: false,
          placeholder: '',
        },
        // 除了点击非自身元素退出编辑态之外，还有哪些事件退出编辑态
        abortEditOnEvent: ['onEnter'],
        // 编辑完成，退出编辑态后触发
        onEdited: (context: any) => {
          const newData = context.newRowData
          if (context.rowIndex > 0) {
            for (const artt1 in newData) {
              if (artt1 === 'A' || artt1 === 'tabkey') {
                continue
              }
              if (!isNaN(Number(newData[artt1]))) {
                newData[artt1] = Number(newData[artt1])
              } else {
                newData[artt1] = 0
              }
            }
          }
          baseConfig.data.splice(context.rowIndex, 1, newData)
        },
        // 默认是否为编辑状态
        defaultEditable: false,
        showEditIcon: false,
      },
    })
  })

  //基础设置配置 不需要多语
  baseData.seriesType = [
    { code: 'bar', name: t('tools.echarts.set.bar') }, // "柱状图"
    { code: 'line', name: t('tools.echarts.set.line') }, // "折线图"
    { code: 'pie', name: t('tools.echarts.set.pie') }, // "饼图"
  ]
  baseData.legendorient = [
    { code: 'horizontal', name: t('tools.echarts.set.horizontal') }, // "水平"
    { code: 'vertical', name: t('tools.echarts.set.vertical') }, // "垂直"
  ]
  baseData.legendlocation = [
    { code: 'top', name: t('tools.echarts.set.top') }, // "顶部"
    { code: 'bottom', name: t('tools.echarts.set.bottom') }, // "底部"
  ]
  baseData.titleleft = [
    { code: 'left', name: t('tools.echarts.set.left') }, // "居左"
    { code: 'center', name: t('tools.echarts.set.center') }, // "居中"
    { code: 'right', name: t('tools.echarts.set.right') }, // "居右"
  ]
  //
  baseConfig = { data: [], config: {} }
  //
  baseConfig.data = [
    { tabkey: shortId(), A: '', B: '系列1', C: '系列2', D: '系列3' },
    { tabkey: shortId(), A: '类别 1', B: 4.3, C: 2.4, D: 2 },
    { tabkey: shortId(), A: '类别 2', B: 2.5, C: 4.4, D: 2 },
    { tabkey: shortId(), A: '类别 3', B: 3.5, C: 1.8, D: 3 },
    { tabkey: shortId(), A: '类别 4', B: 4.5, C: 2.8, D: 5 },
  ]
  for (let i = 0; i < 17; i++) {
    baseConfig.data.push({ tabkey: shortId(), A: '', B: '', C: '', D: '' })
  }

  //config 默认值
  baseConfig.config.seriesType = 'bar'
  baseConfig.config.smooth = false // 平滑折线
  baseConfig.config.legend = true // 图例 是否显示图例
  baseConfig.config.legendorient = 'horizontal' // 图例方向 默认水平
  baseConfig.config.legendlocation = 'bottom' // 图例位置底部
  baseConfig.config.legendleft = 'center' // 图例横向位置 居中
  baseConfig.config.titleText = '' // 标题名称
  baseConfig.config.titleleft = 'center' // 标题位置
}
// 从缓存配置中读取数据到当前展示配置中
const loadBaseConfig = (cachebaseConfig: any) => {
  if (cachebaseConfig === null) {
    return
  }
  if (cachebaseConfig.data !== null && cachebaseConfig.data.length > 0) {
    baseConfig.data = cachebaseConfig.data
  }
  for (const item of baseConfig.data) {
    item.tabkey = shortId()
  }
  for (let i = 0; i < 10; i++) {
    baseConfig.data.push({ tabkey: shortId(), A: '', B: '' })
  }
  if (cachebaseConfig.config !== null) {
    for (const attr1 in cachebaseConfig.config) {
      if (baseConfig.config[attr1] !== null) {
        baseConfig.config[attr1] = cachebaseConfig.config[attr1]
      }
    }
  }
}
const editableCellState = () => {
  return true
}
// --基础模式下的相关方法和设置-结束
</script>

<style lang="less" scoped>
@import '@/assets/styles/_mixins.less';

.umo-echarts-container {
  min-height: 300px;

  .umo-echarts-header {
    display: flex;
    justify-content: space-between;
    :only-child {
      margin-left: auto;
    }
  }
  .umo-echarts-source-center {
    display: flex;
    height: calc(100% - 30px);
    width: 100%;
    margin-top: 10px;
    overflow: visible;

    .umo-echarts-code {
      width: 320px;
      margin-right: 10px;

      :deep(.umo-textarea__inner) {
        height: 100%;
        resize: none;
      }
    }

    .umo-echarts-settting {
      --td-comp-margin-xxl: 10px;
      width: 360px;
      padding: 20px;
      margin-left: 10px;
      border: solid 1px var(--umo-border-color);
      border-radius: var(--umo-radius);
      max-height: 420px;
      overflow: auto;
      .umo-scrollbar();
      :deep(.umo-form__controls) {
        &,
        &-content {
          min-height: auto;
        }
      }
    }

    .umo-echarts-render {
      flex: 1;
      border: solid 1px var(--umo-border-color);
      border-radius: var(--umo-radius);
      position: relative;
      overflow: hidden;
      box-sizing: border-box;

      .umo-echarts-svg {
        box-sizing: border-box;
        height: 420px;
        padding: 20px 15px 15px;
        overflow: auto;
        display: flex;
        justify-content: center;
      }

      .umo-echarts-table {
        --td-comp-paddingTB-s: 3px;
        --td-comp-paddingLR-s: 5px;
        --td-comp-size-m: 18px;
        --td-component-border: var(--umo-border-color);
        box-sizing: border-box;
        height: 420px;
        padding: 0px;
        border: 0px;
        overflow: auto;
        display: flex;
        justify-content: center;
        :deep(.umo-table) {
          &__content {
            border: none;
          }
          &__cell--editable {
            cursor: text;
          }
        }
        :deep(.t-input) {
          border: none;
          box-shadow: none;
          cursor: text;
          input {
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
