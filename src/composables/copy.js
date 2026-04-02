export function useCopy(source, successMessage, container) {
  const { copy, copied, isSupported } = useClipboard({ legacy: true, source })
  if (!isSupported.value) {
    useMessage('error', {
      attach: container,
      content: t('copy.notSupported'),
    })
    return false
  }
  copy()
  if (copied.value) {
    useMessage('success', {
      attach: container,
      content: successMessage,
    })
    return true
  }
  useMessage('error', {
    attach: container,
    content: t('copy.copyFailed'),
  })
  return false
}
