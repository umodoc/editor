export function calbaseConfigData(data) {
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
export function calbaseConfigOptions(data, config, options) {
  let resOption = {}
  if (!data || !config) {
    return resOption
  }
  if (config.titleText && config.titleText !== '') {
    resOption.title = {}
    resOption.title.text = config.titleText
    resOption.title.left = config.titleleft || 'center'
  }
  let colNameList = []
  function calbaseConfigOptionsInlegend() {
    resOption.legend = {}
    resOption.legend.show = config.legend ? true : false
    resOption.legend[config.legendlocation] = 10
    resOption.legend.left = config.legendleft
    resOption.legend.orient = config.legendorient
    resOption.legend.data = []
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
      colNameList.push(curColName)
      if (config.seriesType === 'pie' && colNameList.length === 1) {
        break
      }
    }
  }
  calbaseConfigOptionsInlegend()

  function calbaseConfigOptionsInType() {
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

  const newOptions = options.echarts?.onCustomSettings?.(data, config)
  if (newOptions !== null && typeof newOptions === 'object') {
    resOption = newOptions
  }
  return JSON.parse(JSON.stringify(resOption))
}
