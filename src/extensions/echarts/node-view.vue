<template>
    <node-view-wrapper :id="'chartNode-'+node.attrs.id" ref="containerRef" class="umo-node-view" :style="nodeStyle">
        <div class="umo-node-container umo-hover-shadow umo-select-outline umo-node-echarts">
            <drager :selected="selected" :rotatable="false" :width="node.attrs.width" :height="node.attrs.height"
                :min-width="400" :min-height="200" :max-width="maxWidth" @resize="onResize" @click="dragerClick">
                <div :id="'chart-'+node.attrs.id" class="umo-node-echarts-body">
                </div>
            </drager>
        </div>
    </node-view-wrapper>
</template>

<script setup lang="ts">
    //tiptap组件
    import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
    import { NodeSelection } from '@tiptap/pm/state'
    //拖拽组件
    import Drager from 'es-drager'
    // 引入echart服务 用此方法初始化加载cdn echart.js脚本 否则
    import { useEchartsLoader } from '@/extensions/echarts/init-service'
    import { calbaseConfigData, calbaseConfigOptions } from '@/extensions/echarts/cal-service'
    const { loadEchartScript } = useEchartsLoader()

    const { node, updateAttributes } = defineProps(nodeViewProps)
    const { options, editor } = useStore()
    const containerRef = ref(null)
    let maxWidth = $ref(0)
    let selected = $ref(false)
    let myChart = $ref(null)

    //钩子 加载数据
    onMounted(async () => {
        await loadData()
    })

    //初始化样式 需要在 margin 和 nodeAlign里面增加name才可以
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
        updateAttributes({ width, height })
        if (myChart != null) {
            myChart.resize()
        }
    }

    // onBeforeUnmount(() => {
    // })

    onClickOutside(containerRef, () => {
        selected = false
    })
    //数据加载
    async function loadData() {
        await nextTick()
        // 确保 loadData 在 echarts 加载完毕后调用
        await loadEchartScript()
        // 接下来的使用就跟之前一样，初始化图表，设置配置项
        if (typeof echarts !== 'undefined') {
            const { chartOptions, chartConfig, id, mode } = node.attrs
            //  根据参数不同 实现效果不同
            if (myChart != null) {
                myChart.dispose()
                myChart = null
            }
            if (mode == 1) {
                if (chartConfig != null) {
                    let newData = calbaseConfigData(chartConfig.data)
                    let resOptions = calbaseConfigOptions(newData, chartConfig.config)
                    if (resOptions != null) {
                        myChart = echarts.init(document.getElementById("chart-" + id))
                        myChart.setOption(resOptions)
                    }
                }
            }
            else if (chartOptions != null) {
                myChart = echarts.init(document.getElementById("chart-" + id))
                myChart.setOption(chartOptions)
            }
        }
    }

    async function dragerClick() {
        selected = true
        await nextTick()
        let curId = node.attrs?.id
        if (curId != null && curId != "") {
            const element = editor.value?.view.dom.querySelector("#chart-" + curId)
            if (element) {
                const pos = editor.value?.view.posAtDOM(element, 0)
                if (pos != null) {
                    const tr = editor.value?.state.tr.setSelection(NodeSelection.create(editor.value.state.doc, pos))
                    if (tr != null) {
                        // 应用交易以更新编辑器状态
                        editor.value?.view.dispatch(tr)
                        // 确保编辑器获得焦点
                        editor.value?.focus?.()
                    }
                }
            }
        }

    }
    // 监听 node.attrs 变化并在变化时重新加载数据
    watch(
        () => node.attrs,
        async (newAttrs: any, oldAttrs: any) => {
            // 避免初次挂载时重复调用 loadData
            if (oldAttrs !== undefined && newAttrs != oldAttrs) {
                await loadData() // 第二次及之后的调用 loadData，在属性变化时
            }
        },
        { deep: true, immediate: false }
    )
</script>

<style lang="less">
    .umo-node-view {
        .umo-node-echarts {
            max-width: 100%;

            .es-drager {
                &:not(.selected) {
                    outline: solid 1px var(--umo-content-node-border);
                }
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