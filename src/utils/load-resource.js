/**
 * Load external resources (JS and CSS).
 * @param {string} url - Resource URL
 * @param {'script'|'css'} [type='script'] - Resource type
 * @param {string} [id=''] - Resource element ID
 * @returns {Promise<void>}
 */
export const loadResource = (url, type = 'script', id = '') => {
  const filename = url.split('/').pop()
  const resourceId = id === '' ? `${type || 'script'}-${filename}` : id

  return new Promise((resolve, reject) => {
    if (document.getElementById(resourceId)) {
      resolve()
      return
    }
    let element

    if (type === 'script') {
      element = document.createElement('script')
      element.src = url
      element.id = resourceId
      element.type = 'text/javascript'
      // element.async = true

      element.onload = () => resolve()
      element.onerror = () => reject(new Error(`Failed to load script: ${url}`))
    } else if (type === 'css') {
      element = document.createElement('link')
      element.rel = 'stylesheet'
      element.href = url
      element.id = resourceId

      element.onload = () => resolve()
      element.onerror = () => reject(new Error(`Failed to load stylesheet: ${url}`))
    } else {
      reject(new Error(`Unsupported resource type: ${type}`))
      return
    }

    document.head.appendChild(element)
  })
}
