<template>
  <node-view-wrapper
    :id="'chartNode-' + attrs.id"
    ref="containerRef"
    class="umo-node-view"
    :style="nodeStyle"
    @click.capture="editor?.commands.setNodeSelection(getPos())"
  >
    <div
      class="umo-node-container umo-node-echarts umo-select-outline"
      :class="{
        'umo-hover-shadow': !options.document?.readOnly,
      }"
      :data-options="
        options.document?.readOnly ? JSON.stringify(chartOption) : null
      "
    >
      <drager
        :selected="selected"
        :rotatable="false"
        :boundary="false"
        :disabled="options.document?.readOnly"
        :angle="0"
        :width="Number(attrs.width)"
        :height="Number(attrs.height)"
        :max-width="maxWidth"
        :min-height="200"
        :z-index="10"
        @resize="onResize"
        @focus="selected = true"
      >
        <div :id="'chart-' + attrs.id" class="umo-node-echarts-body"></div>
      </drager>
    </div>
  </node-view-wrapper>
</template>

<script setup>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import Drager from 'es-drager'

import {
  calbaseConfigData,
  calbaseConfigOptions,
} from '@/extensions/echarts/cal-service'
import { loadResource } from '@/utils/load-resource'

const props = defineProps(nodeViewProps)
const attrs = $computed(() => props.node.attrs)
const { updateAttributes, getPos } = props
const options = inject('options')
const editor = inject('editor')
const containerRef = ref(null)
let maxWidth = $ref(0)
let selected = $ref(false)
let chart = null
let chartOption = $ref(null)

onMounted(async () => {
  await nextTick()
  maxWidth = containerRef.value?.$el.offsetWidth
  if (attrs.width === null) {
    updateAttributes({ width: maxWidth })
  }
  await loadData()
})

const nodeStyle = $computed(() => {
  const { nodeAlign, margin } = attrs
  const marginTop =
    margin?.top && margin?.top !== '' ? `${margin.top}px` : undefined
  const marginBottom =
    margin?.bottom && margin?.bottom !== '' ? `${margin.bottom}px` : undefined
  return {
    'justify-content': nodeAlign,
    marginTop,
    marginBottom,
  }
})
const onResize = ({ width, height }) => {
  updateAttributes({
    width: Number(width.toFixed(2)),
    height: Number(height.toFixed(2)),
  })
  if (chart !== null) {
    chart.resize()
  }
}

// onBeforeUnmount(() => {
// })

onClickOutside(containerRef, () => {
  selected = false
})
const loadData = async () => {
  await nextTick()
  await loadResource(`${options.value.cdnUrl}/libs/echarts/echarts.min.js`)

  const waitForECharts = () => {
    return new Promise((resolve, reject) => {
      let attempts = 0
      const maxAttempts = 40
      const checkECharts = () => {
        if (typeof echarts !== 'undefined') {
          resolve()
        } else if (attempts < maxAttempts) {
          attempts++
          setTimeout(checkECharts, 50)
        } else {
          resolve()
          // reject(new Error('ECharts loading timeout'))
        }
      }
      checkECharts()
    })
  }
  await waitForECharts()
  if (typeof echarts !== 'undefined') {
    const { chartOptions, chartConfig, id, mode } = attrs
    if (chart !== null) {
      chart.dispose()
      chart = null
      chartOption = null
    }
    if (mode === 1) {
      if (chartConfig !== null) {
        const newData = calbaseConfigData(chartConfig.data)
        const resOptions = calbaseConfigOptions(
          newData,
          chartConfig.config,
          options.value,
        )
        if (resOptions !== null) {
          chart = echarts.init(document.getElementById(`chart-${id}`))
          chart.setOption(resOptions)
          chartOption = resOptions
        }
      }
    } else if (chartOptions !== null) {
      chart = echarts.init(document.getElementById(`chart-${id}`))
      chart.setOption(chartOptions)
      chartOption = chartOptions
    }
  }
}

watch(
  () => attrs,
  async (newAttrs, oldAttrs) => {
    if (
      newAttrs !== undefined &&
      oldAttrs !== undefined &&
      newAttrs !== oldAttrs
    ) {
      let isLoad = false
      onResize({
        width: attrs.width,
        height: attrs.height,
      })
      for (const attr1 in oldAttrs) {
        if (attr1 === 'height' || attr1 === 'width' || attr1 === 'src') {
          continue
        }
        if (oldAttrs[attr1] !== newAttrs[attr1]) {
          isLoad = true
          break
        }
      }
      if (isLoad) {
        await loadData()
      }
    }
  },
  { deep: true, immediate: false },
)
</script>

<style lang="less">
.umo-node-view {
  .umo-node-echarts {
    max-width: 100%;
    position: relative;

    .es-drager {
      max-width: 100%;
      max-height: 100%;
      transform: translateX(0px) translateY(0px) rotate(0deg) !important;
    }

    .umo-node-echarts-body {
      display: block;
      min-height: 200px;
      width: 100%;
      height: 100%;
      background-color: #fff;
      outline: solid 1px var(--umo-content-node-border);
    }
  }
}
</style>
