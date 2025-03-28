/*
此服务主要作用
echarts相关的一些公共处理方法 主要用于基础模式
*/

// 基础模式下，对界面数据进行加工处理，根据第一列为空时不作为有效数据
export function calbaseConfigData(data: any) {
  if (!data) {
    return data
  }
  data = JSON.parse(JSON.stringify(data))
  for (let i = data.length - 1; i >= 0; i--) {
    if (i === 0) {
      continue
    }
    if (!data[i].A || data[i].A === '') {
      data.splice(i, 1)
    }
  }
  return data
}
// 计算配置 根据手工设置的配置信息和数据进行 Options 生成，此方法会逐步扩充
export function calbaseConfigOptions(data: any, config: any, options: any) {
  // 声明的最终返回的options
  let resOption: any = {}
  if (!data || !config) {
    return resOption
  }
  // 1.0 标题 title
  if (config.titleText && config.titleText !== '') {
    resOption.title = {}
    resOption.title.text = config.titleText
    resOption.title.left = config.titleleft ? config.titleleft : 'center' // 标题位置
  }
  // 2.0 图例位置 legend
  let colNameList: any = []
  function calbaseConfigOptionsInlegend() {
    resOption.legend = {}
    // 图例显示隐藏
    resOption.legend.show = config.legend ? true : false
    // 图例纵向位置
    resOption.legend[config.legendlocation] = 10
    // 图例横向位置
    resOption.legend.left = config.legendleft
    // 图例布局
    resOption.legend.orient = config.legendorient
    resOption.legend.data = []
    // 目前只支持 26 个图例，图例名称为空时，不展示
    const alphabet = Array.from({ length: 26 }, (_, i) =>
      String.fromCharCode(i + 65),
    )
    colNameList = []
    for (let i = 1; i < alphabet.length; i++) {
      const curColName = alphabet[i]
      if (!data[0][curColName] || data[0][curColName] === '') {
        continue
      }
      resOption.legend.data.push(data[0][curColName])
      colNameList.push(curColName) // 有那些列需要展示到系列中
      if (config.seriesType === 'pie' && colNameList.length === 1) {
        break
        // 饼图只需要显示一个图例
      }
    }
  }
  calbaseConfigOptionsInlegend()

  // 3.0 图例 yAxis xAxis series处理
  function calbaseConfigOptionsInType() {
    // y轴
    if (config.seriesType === 'bar' || config.seriesType === 'line') {
      resOption.yAxis = {
        type: 'value',
      }
      resOption.xAxis = {}
      resOption.xAxis.type = 'category'
      resOption.xAxis.data = []

      for (let i = 1; i < data.length; i++) {
        resOption.xAxis.data.push(data[i]['A'])
      }
    }

    resOption.series = []

    for (let i = 0; i < colNameList.length; i++) {
      const seriesdata = []
      // 从第二行开始
      for (let j = 1; j < data.length; j++) {
        let _value = data[j][colNameList[i]]
        if (isNaN(Number(_value))) {
          _value = 0
        } else _value = Number(_value)
        if (config.seriesType === 'pie') {
          seriesdata.push({ value: _value, name: data[j]['A'] })
        } else {
          seriesdata.push(_value)
        }
      }
      resOption.series.push({
        name: resOption.legend.data[i],
        type: config.seriesType,
        data: seriesdata,
      })
      // 平滑折线
      if (
        config.smooth &&
        resOption.series[resOption.series.length - 1].type === 'line'
      ) {
        resOption.series[resOption.series.length - 1].smooth = true
      }
    }
    if (config.seriesType === 'pie' && resOption.legend.data !== null) {
      delete resOption.legend.data
    }
  }

  calbaseConfigOptionsInType()

  // 4.0 grid 属性设置
  resOption.grid = {
    left: '3%',
    right: '4%',
    top: 30,
    bottom: 30,
    containLabel: true,
  }
  if (resOption?.legend?.show) {
    if (resOption?.legend?.bottom) {
      resOption.grid.bottom = 60
    } else {
      resOption.grid.top = 60
    }
  }

  // 9.0 自定义扩展，可以在外部自定义实现展示效果，扩展个性化样式
  const newOptions = options.onCustomEChartSettings?.(data, config)
  if (newOptions !== null && typeof newOptions === 'object') {
    resOption = newOptions
  }
  //10.0 返回值 必须JSON.parse(JSON.stringify( 一下，个别情况下echart不展示问题
  return JSON.parse(JSON.stringify(resOption))
}
