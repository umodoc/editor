<template>
  <menus-button
    :ico="'echarts'"
    :text="t('tools.echarts.text')"
    huge
    @menu-click="menuClick"
  >
    <modal
      :visible="dialogVisible"
      width="960px"
      @confirm="setConfirm"
      @close="dialogVisible = false"
    >
      <template #header>
        <icon name="echarts" />
        {{ isAdd ? t('tools.echarts.add') : t('tools.echarts.edit') }}
      </template>
      <div v-if="dialogVisible" class="umo-echarts-container">
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
                <t-checkbox
                  v-if="baseConfig.config.seriesType === 'line'"
                  v-model="baseConfig.config.smooth"
                  >{{ t('tools.echarts.set.smooth') }}</t-checkbox
                >
              </t-form-item>
              <t-form-item>
                <t-checkbox v-model="baseConfig.config.legend">{{
                  t('tools.echarts.set.legend')
                }}</t-checkbox>
              </t-form-item>
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
              <t-form-item
                :label="t('tools.echarts.set.titleText')"
                name="title"
              >
                <t-input
                  v-model="baseConfig.config.titleText"
                  :placeholder="t('tools.echarts.set.titleTextPlaceholder')"
                />
              </t-form-item>
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

<script setup>
import { Input } from 'tdesign-vue-next'

import {
  calbaseConfigData,
  calbaseConfigOptions,
} from '@/extensions/echarts/cal-service'
import { loadResource } from '@/utils/load-resource'
import { getSelectionNode } from '@/utils/selection'
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

let dialogVisible = $ref(false)
let isAdd = $ref(true)
let modelMode = $ref(0)
let curNode = $ref(null)
let sourceOptions = $ref(null)

let sourceChart = null
let settingChart = null

let baseModeSet = $ref(0)
let baseConfig = $ref({ data: [], config: {} })
let baseData = {}

const menuClick = () => {
  if (dialogVisible) {
    return
  }
  baseModeSet = 0

  const openAddMode = () => {
    isAdd = true
    modelMode = options.value.echarts?.mode
    sourceOptions = null
    initBaseConfig()
    dialogVisible = true
  }

  if (mode === 'add') {
    openAddMode()
    return
  }
  curNode = getSelectionNode(editor.value)
  if (curNode?.type?.name !== 'echarts') {
    openAddMode()
    return
  }

  isAdd = false
  modelMode = curNode.attrs?.mode
  sourceOptions = null
  if (curNode.attrs?.chartOptions !== null) {
    sourceOptions = JSON.stringify(curNode.attrs?.chartOptions)
  }
  initBaseConfig()
  loadBaseConfig(curNode.attrs?.chartConfig)
  dialogVisible = true
}

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
  if (!isAdd) {
    resOptions = JSON.parse(JSON.stringify(curNode.attrs))
  } else {
    resOptions.id = shortId()
    resOptions.mode = modelMode
  }
  if (resOptions.mode === 1) {
    const newData = calbaseConfigData(baseConfig.data)
    resOptions.chartConfig = { data: newData, config: baseConfig.config }

    if (settingChart === null) {
      const dialog = useAlert({
        attach: container,
        theme: 'warning',
        header: t('tools.echarts.text'),
        body: t('tools.echarts.settingError'),
        onConfirm() {
          dialog.destroy()
        },
      })
      return
    }
  } else {
    try {
      resOptions.chartOptions = JSON.parse(sourceOptions)
    } catch (e) {
      const dialog = useAlert({
        attach: container,
        theme: 'warning',
        header: t('tools.echarts.text'),
        body: t('tools.echarts.sourceerror'),
        onConfirm() {
          dialog.destroy()
        },
      })
      return
    }
    if (sourceChart === null) {
      const dialog = useAlert({
        attach: container,
        theme: 'warning',
        header: t('tools.echarts.text'),
        body: t('tools.echarts.sourceerror2'),
        onConfirm() {
          dialog.destroy()
        },
      })
      return
    }
  }
  if (options.value.echarts?.renderImage || resOptions.mode === 0) {
    const dataURI = (
      resOptions.mode === 1 ? settingChart : sourceChart
    ).getDataURL({
      type: 'png',
        pixelRatio: 5,
        backgroundColor: '#fff',
    })
    const byteString = atob(dataURI.split(',')[1])
    const [typePart] = dataURI.split(',')
    const [protocol, mimeString] = typePart
      .split(':')
      .slice(1)
      .toString()
      .split(';')
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    const fileBlob = new Blob([ab], { type: mimeString })
    options.value.onFileUpload(fileBlob, resOptions.id, 'echarts')
  }
  if (!isAdd) {
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

const loadModeEchart = async () => {
  await nextTick()
  await loadResource(`${options.value.cdnUrl}/libs/echarts/echarts.min.js`)
  if (typeof echarts !== 'undefined') {
    disposeChart()
    const _curDomSetting = document.getElementById('echartsSettingModeId')
    const _curDomSource = document.getElementById('echartsSourceModeId')
    if (modelMode === 1 && _curDomSetting !== null) {
      const newData = calbaseConfigData(baseConfig.data)
      if (!(newData === null || newData.length === 0)) {
        const newOptions = calbaseConfigOptions(
          JSON.parse(JSON.stringify(newData)),
          JSON.parse(JSON.stringify(baseConfig.config)),
          options.value,
        )

        settingChart = echarts.init(_curDomSetting)
        try {
          settingChart.setOption(newOptions)
        } catch (e) {
          disposeChart()
        }
      }
    } else if (
      modelMode === 0 &&
      sourceOptions !== null &&
      _curDomSource !== null
    ) {
      sourceChart = echarts.init(_curDomSource)
      try {
        const calOptions = normalizeJsonString(sourceOptions)
        if (calOptions !== sourceOptions) {
          sourceOptions = calOptions
        }
        sourceChart.setOption(JSON.parse(sourceOptions))
      } catch (e) {
        disposeChart()
      }
    }
  }
}
const disposeChart = () => {
  if (sourceChart !== null) {
    sourceChart.dispose()
    sourceChart = null
  }
  if (settingChart !== null) {
    settingChart.dispose()
    settingChart = null
  }
}
const normalizeJsonString = (jsonString) => {
  const keyPattern = /(\s*)([a-zA-Z_$][\w$]*)(\s*:\s*)/g
  const singleQuotePattern = /'([^']*)'/g
  jsonString = jsonString.replace(singleQuotePattern, '"$1"')
  jsonString = jsonString.replace(keyPattern, '$1"$2"$3')
  return jsonString
}

const initBaseConfig = () => {
  baseData = {}
  baseData.Columns = []
  const alphabet = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(i + 65),
  )

  alphabet.forEach((letter) => {
    baseData.Columns.push({
      title: letter,
      colKey: letter.toUpperCase(),
      align: 'center',
      fixed: letter === 'A' ? 'left' : undefined,
      edit: {
        component: Input,
        props: {
          clearable: false,
          autofocus: false,
          placeholder: '',
        },
        abortEditOnEvent: ['onEnter'],
        onEdited: (context) => {
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
        defaultEditable: false,
        showEditIcon: false,
      },
    })
  })

  baseData.seriesType = [
    { code: 'bar', name: t('tools.echarts.set.bar') },
    { code: 'line', name: t('tools.echarts.set.line') },
    { code: 'pie', name: t('tools.echarts.set.pie') },
  ]
  baseData.legendorient = [
    { code: 'horizontal', name: t('tools.echarts.set.horizontal') },
    { code: 'vertical', name: t('tools.echarts.set.vertical') },
  ]
  baseData.legendlocation = [
    { code: 'top', name: t('tools.echarts.set.top') },
    { code: 'bottom', name: t('tools.echarts.set.bottom') },
  ]
  baseData.titleleft = [
    { code: 'left', name: t('tools.echarts.set.left') },
    { code: 'center', name: t('tools.echarts.set.center') },
    { code: 'right', name: t('tools.echarts.set.right') },
  ]
  baseConfig = { data: [], config: {} }
  baseConfig.data = [
    { tabkey: shortId(), A: '', B: 'Series 1', C: 'Series 2', D: 'Series 3' },
    { tabkey: shortId(), A: 'Category 1', B: 4.3, C: 2.4, D: 2 },
    { tabkey: shortId(), A: 'Category 2', B: 2.5, C: 4.4, D: 2 },
    { tabkey: shortId(), A: 'Category 3', B: 3.5, C: 1.8, D: 3 },
    { tabkey: shortId(), A: 'Category 4', B: 4.5, C: 2.8, D: 5 },
  ]
  for (let i = 0; i < 17; i++) {
    baseConfig.data.push({ tabkey: shortId(), A: '', B: '', C: '', D: '' })
  }

  baseConfig.config.seriesType = 'bar'
  baseConfig.config.smooth = false
  baseConfig.config.legend = true
  baseConfig.config.legendorient = 'horizontal'
  baseConfig.config.legendlocation = 'bottom'
  baseConfig.config.legendleft = 'center'
  baseConfig.config.titleText = ''
  baseConfig.config.titleleft = 'center'
}
const loadBaseConfig = (cachebaseConfig) => {
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

        :deep(.t-table) {
          &__content {
            border: none;
          }

          &__cell--editable {
            cursor: text;
          }
        }

        :deep(.umo-input) {
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
