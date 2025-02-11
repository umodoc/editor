const { container, editor } = useStore()

export const useNodePostion = () => {
  const currentNode = document.querySelector(
    `${container} .umo-page-node-content .umo-node-focused, ${container} .umo-page-node-content .ProseMirror-gapcursor`,
  ) as HTMLElement
  if (currentNode === null) {
    return { offsetTop: null, offsetLeft: null }
  }

  // 当前元素距离页面顶部的距离
  let { offsetTop, offsetLeft } = currentNode

  // 微修正菜单位置
  offsetTop = currentNode.tagName === 'DIV' ? offsetTop - 8 : offsetTop - 5

  if (
    editor.value.isActive('horizontalRule') ||
    editor.value.isActive('table') ||
    currentNode.classList.contains('ProseMirror-gapcursor')
  ) {
    offsetTop = offsetTop + 5
  }
  if (editor.value.isActive('pageBreak')) {
    offsetTop = offsetTop - 3
  }
  return { offsetTop, offsetLeft }
}
