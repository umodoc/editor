/**
 * 资源加载方法（支持 JS 和 CSS）
 * @param url 资源地址
 * @param type 资源类型，'script' | 'css'（默认 'script'）
 * @returns Promise<void> 加载成功 resolve，失败 reject
 */
export const loadResource = (
  url: string,
  type: 'script' | 'css' = 'script',
  id = '',
): Promise<void> => {
  const filename = url.split('/').pop() ?? ''
  const resourceId = id === '' ? `${type ?? 'script'}-${filename}` : id

  return new Promise((resolve, reject) => {
    if (document.getElementById(resourceId)) {
      resolve()
      return
    }
    let element: HTMLScriptElement | HTMLLinkElement

    if (type === 'script') {
      // 加载 JS 脚本
      element = document.createElement('script')
      element.src = url
      element.id = resourceId
      element.type = 'text/javascript'
      // element.async = true

      element.onload = () => resolve()
      element.onerror = () => reject(new Error(`JS 脚本加载失败: ${url}`))
    } else if (type === 'css') {
      // 加载 CSS 样式
      element = document.createElement('link')
      element.rel = 'stylesheet'
      element.href = url
      element.id = resourceId

      element.onload = () => resolve()
      element.onerror = () => reject(new Error(`CSS 样式加载失败: ${url}`))
    } else {
      reject(new Error(`不支持的类型: ${type}`))
      return
    }

    document.head.appendChild(element)
  })
}
