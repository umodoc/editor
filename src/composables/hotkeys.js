export function useHotkeys(container, editor, shortcuts) {
  useEventListener(container, 'keydown', (event) => {
    const { target } = event
    const currentEditor = editor.value
    if (
      event.isComposing ||
      event.altKey ||
      !currentEditor ||
      currentEditor.isDestroyed ||
      !(target instanceof Element) ||
      target.closest('.umo-editor-container') !== container.value
    ) {
      return
    }

    // ProseMirror 会阻止撤销、重做和 Esc 的浏览器默认行为。
    if (event.defaultPrevented && target !== currentEditor.view.dom) {
      return
    }

    const control = target.closest('input, textarea, select, [contenteditable]')
    if (control && control !== currentEditor.view.dom) {
      return
    }

    const key = event.key.toLowerCase()
    const modified = event.ctrlKey || event.metaKey
    if (key === 'escape' ? modified || event.shiftKey : !modified) {
      return
    }

    const shortcut = shortcuts[event.shiftKey ? `shift+${key}` : key]
    if (shortcut && shortcut() !== false) {
      event.preventDefault()
      event.stopPropagation()
    }
  })
}
