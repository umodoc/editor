<template>
  <node-view-wrapper
    :id="'chartNode-' + node.attrs.id"
    ref="containerRef"
    class="umo-node-view"
    :style="nodeStyle"
  >
    <div
      class="umo-node-container umo-node-echarts"
      :class="{
        'is-draggable': node.attrs.draggable,
        'umo-hover-shadow': !options.document?.readOnly,
        'umo-select-outline': !node.attrs.draggable,
      }"
    >
      <drager
        :selected="selected"
        :rotatable="false"
        :boundary="false"
        :draggable="
          Boolean(node.attrs.draggable) && !options.document?.readOnly
        "
        :disabled="options.document?.readOnly"
        :angle="0"
        :width="Number(node.attrs.width)"
        :height="Number(node.attrs.height)"
        :min-width="400"
        :min-height="200"
        :max-width="maxWidth"
        :z-index="10"
        @resize="onResize"
        @focus="selected = true"
      >
        <div :id="'chart-' + node.attrs.id" class="umo-node-echarts-body"></div>
      </drager>
    </div>
  </node-view-wrapper>
</template>

<script setup lang="ts">
// tiptap 组件
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
// 拖拽组件
import Drager from 'es-drager'

import {
  calbaseConfigData,
  calbaseConfigOptions,
} from '@/extensions/echarts/cal-service'
// 引入 echart 服务 用此方法初始化加载 cdn echart.js 脚本 否则
import { useEchartsLoader } from '@/extensions/echarts/init-service'

const { node, updateAttributes } = defineProps(nodeViewProps)
const options = inject('options')
const { loadEchartScript } = useEchartsLoader(options.value)
const containerRef = ref(null)
const maxWidth = $ref(0)
let selected = $ref(false)
let myChart: any = null

// 加载数据
onMounted(async () => {
  await loadData()
})

// 初始化样式，需要在 margin 和 nodeAlign 里面增加 name 才可以
const nodeStyle = $computed(() => {
  const { nodeAlign, margin } = node.attrs
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
const onResize = ({ width, height }: { width: number; height: number }) => {
  updateAttributes({
    width: Number(width.toFixed(2)),
    height: Number(height.toFixed(2)),
  })
  if (myChart !== null) {
    myChart.resize()
  }
}

// onBeforeUnmount(() => {
// })

onClickOutside(containerRef, () => {
  selected = false
})
// 数据加载
const loadData = async () => {
  await nextTick()
  // 确保 loadData 在 echarts 加载完毕后调用
  await loadEchartScript()
  // 接下来的使用就跟之前一样，初始化图表，设置配置项
  if (typeof echarts !== 'undefined') {
    const { chartOptions, chartConfig, id, mode } = node.attrs
    // 根据参数不同 实现效果不同
    if (myChart !== null) {
      myChart.dispose()
      myChart = null
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
          myChart = echarts.init(document.getElementById(`chart-${id}`))
          myChart.setOption(resOptions)
        }
      }
    } else if (chartOptions !== null) {
      myChart = echarts.init(document.getElementById(`chart-${id}`))
      myChart.setOption(chartOptions)
    }
  }
}

// 监听 node.attrs 变化并在变化时重新加载数据
watch(
  () => node.attrs,
  async (newAttrs: any, oldAttrs: any) => {
    // 避免初次挂载时重复调用 loadData
    if (
      newAttrs !== undefined &&
      oldAttrs !== undefined &&
      newAttrs !== oldAttrs
    ) {
      // 如果只有高度和宽度变化，则不走重新加载逻辑
      let isLoad = false
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
        await loadData() // 第二次及之后的调用 loadData，在属性变化时
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
    &:not(.is-draggable) .es-drager {
      max-width: 100%;
      max-height: 100%;
      transform: translateX(0px) translateY(0px) rotate(0deg) !important;
    }
    .umo-node-echarts-body {
      display: block;
      min-width: 400px;
      min-height: 200px;
      width: 100%;
      height: 100%;
      border: none;
      /* pointer-events: none; */
      background-color: var(--umo-color-white);
    }
  }
}
</style>
