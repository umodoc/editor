//@ts-nocheck
const { container, editor } = useStore()

export const useNodePostion = () => {
  const currentNode: Element | null = document.querySelector(
    `${container} .umo-page-node-content .umo-node-focused`,
  )
  if (currentNode === null) {
    return { offsetTop: null, offsetLeft: null }
  }

  // 当前元素距离页面顶部的距离
  let { offsetTop, offsetLeft } = currentNode

  // 微修正菜单位置
  offsetTop = currentNode.tagName === 'DIV' ? offsetTop - 8 : offsetTop - 5
  let offsetY = 0
  if (
    editor.value.isActive('horizontalRule') ||
    editor.value.isActive('table')
  ) {
    offsetY = 5
  }
  if (editor.value.isActive('pagination')) {
    offsetY = -4
  }
  return { offsetTop, offsetLeft }
}
