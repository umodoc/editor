/* 记录历史记录的公共组*/
// {
// done: [],        // 能撤销的记录数组
// undone: [],          // 能重做的记录数组
// isUndoRedo: false  // 标记是否正在执行撤销/重做操作
// }

// export interface IHistoryRecord{
//     type:string // 类型 editor 是编辑器的默认操作 page是页面设置
// proType:string //细分类型
//     newData?:string
//     oldData?:string
// }
export const addHistory = (records, stepType, data) => {
  if (records.value.isUndoRedo) {
    return
  }
  if (!data) {
    return
  }
  if (stepType === 'editor') {
    addHistoryEditor(records, stepType, data)
  } else {
    addHistoryPage(records, stepType, data)
  }
}
// 增加编辑器的标准操作记录
const addHistoryEditor = (records, stepType, data) => {
  // 基本原则
  const uneventCount = data?.undone?.eventCount ?? 0
  if (uneventCount > 0) {
    // 表示有撤销，此时不做任何处理
    return
  }
  const eventCount = data?.done?.eventCount ?? 0
  if (eventCount === 0) {
    return
  }
  const curCount = records.value.done.filter(
    (item) => item.type === stepType,
  ).length
  if (curCount < eventCount) {
    for (let i = curCount; i < eventCount; i++) {
      records.value.done.push({ type: stepType })
    }
  }
  records.value.undone = []
}

const addHistoryPage = (records, stepType, data) => {
  if (!data || !stepType) {
    return
  }
  if (!data.proType || !data.newData || !data.oldData) {
    return
  }
  // 值相同 不需要记录
  if (isEqual(data.newData, data.oldData)) {
    return
  }
  records.value.done.push({ type: stepType, ...data })
  // 重置后续步骤
  records.value.undone = []
}
const isEqual = (a: any, b: any): boolean => {
  // 基本类型直接比较
  if (a === b) return true

  // 处理null情况
  if (a === null || b === null) return a === b

  // 不同类型直接返回false
  if (typeof a !== typeof b) return false

  // 处理对象和数组
  if (typeof a === 'object') {
    // 数组情况
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false
      return a.every((item: any, index: number) => isEqual(item, b[index]))
    }

    // 对象情况
    const keysA = Object.keys(a)
    const keysB = Object.keys(b)

    if (keysA.length !== keysB.length) return false

    return keysA.every((key) => {
      if (!keysB.includes(key)) return false
      return isEqual(a[key], b[key])
    })
  }
  return false
}
// 撤销一条数据
export const undoHistoryRecord = (records, method) => {
  if (records.value.done.length === 0) {
    return
  }
  records.value.isUndoRedo = true
  // 删除最后一条记录 并返回删除的几率
  const lastRecord = records.value.done.pop()
  try {
    method(lastRecord)
  } catch (e) {}

  records.value.undone.unshift(lastRecord)
  // 延迟重置 isUndoRedo，确保 watch 回调能捕获到 true 值
  setTimeout(() => {
    records.value.isUndoRedo = false
  }, 0)
}
/* 重做*/
export const redoHistoryRecord = (records, method) => {
  if (records.value.undone.length === 0) {
    return
  }
  records.value.isUndoRedo = true
  // 删除最后一条记录 并返回删除的几率
  const firstRecord = records.value.undone.shift()
  try {
    method(firstRecord)
  } catch (e) {}

  records.value.done.push(firstRecord)
  // 延迟重置 isUndoRedo，确保 watch 回调能捕获到 true 值
  setTimeout(() => {
    records.value.isUndoRedo = false
  }, 0)
}
