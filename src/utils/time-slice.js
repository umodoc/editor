// 让出主线程，使浏览器有机会响应输入并绘制
export const yieldToMain = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 0)
  })

// 返回一个函数：距离上次让出超过 budget 毫秒时才真正让出主线程
export const createTimeSlicer = (budget = 24) => {
  let sliceStart = performance.now()
  return async () => {
    if (performance.now() - sliceStart < budget) {
      return
    }
    await yieldToMain()
    sliceStart = performance.now()
  }
}
