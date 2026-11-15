const pendingResources = new Map()

/**
 * 资源加载方法（支持 JS 和 CSS）
 * @param {string} url - 资源地址
 * @param {'script'|'css'} [type='script'] - 资源类型，'script' | 'css'（默认 'script'）
 * @param {string} [id=''] - 资源 ID
 * @returns {Promise<void>} 加载成功 resolve，失败 reject
 */
export const loadResource = (url, type = 'script', id = '') => {
  const filename = url.split('/').pop()
  const resourceId = id === '' ? `${type || 'script'}-${filename}` : id
  const pending = pendingResources.get(resourceId)
  if (pending) {
    return pending
  }

  const loading = new Promise((resolve, reject) => {
    if (document.getElementById(resourceId)) {
      resolve()
      return
    }
    let element
    let errorMessage

    if (type === 'script') {
      // 加载 JS 脚本
      element = document.createElement('script')
      element.src = url
      element.type = 'text/javascript'
      errorMessage = `JS 脚本加载失败: ${url}`
    } else if (type === 'css') {
      // 加载 CSS 样式
      element = document.createElement('link')
      element.rel = 'stylesheet'
      element.href = url
      errorMessage = `CSS 样式加载失败: ${url}`
    } else {
      reject(new Error(`不支持的类型: ${type}`))
      return
    }

    element.id = resourceId
    element.onload = () => resolve()
    element.onerror = () => {
      element.remove()
      reject(new Error(errorMessage))
    }
    document.head.appendChild(element)
  }).finally(() => pendingResources.delete(resourceId))

  pendingResources.set(resourceId, loading)
  return loading
}
