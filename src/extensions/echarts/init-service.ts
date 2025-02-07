/*
//**此服务主要作用** 
onMounted 钩子在初次加载时容易出现  echarts-script 已经存在，但onload 未完成的情况，
导致第二次进入时判断已存在但实际echart还未加载完成，导致只加载出了第一个图表，后续图表都没加载上
loadEchartScript :解决同时加载多个图表时只有第一个图表展示问题。
*/

const echartsLoadPromise = ref<Promise<void> | null>(null)
// npm包引入echarts会导致整个打包的包变大，为了解决这个问题，现使用sdn方式引入
const defaultcdnUrl = 'https://cdn.jsdelivr.net/npm/echarts/'
const defaultFilePath = 'dist/echarts.min.js'

export function useEchartsLoader() {
  return {
    //调用此方法，实现初始化加载js脚本
    loadEchartScript:  () => {
      const { options } = useStore()
      if (!options.value.toolbar?.disableMenuItems.includes('echarts')) {
        if (!echartsLoadPromise.value) {
          echartsLoadPromise.value = new Promise<void>((resolve, reject) => {
            const existingScript = document.querySelector('#echarts-script')
            if (!existingScript) {
              const script = document.createElement('script')
              let _cdnUrl = defaultcdnUrl
              let _filePath = defaultFilePath
              if (
                options.value.echarts?.isRelative &&
                options.value.echarts?.filePath !== ''
              ) {
                //相对路径
                script.src = options.value.echarts?.filePath
              } else {
                if (options.value.echarts?.cdnUrl !== '') {
                  _cdnUrl = options.value.echarts.cdnUrl
                }
                if (options.value.echarts?.filePath !== '') {
                  _filePath = options.value.echarts.filePath
                }
                script.src = _cdnUrl + _filePath
              }
              script.id = 'echarts-script'
              script.type = 'text/javascript'
              script.onload = () => resolve()
              script.onerror = (error) => reject(new Error(`load Echarts ERROR`))
              document.querySelector('head')!.append(script)
            } else {
              // 如果脚本已存在，则立即解析 Promise
              resolve()
            }
          })
        }
        return echartsLoadPromise.value
      } else {
        return null
      }
    },
  }
}
