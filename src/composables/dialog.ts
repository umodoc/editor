import type { DialogOptions, MessageOptions } from 'tdesign-vue-next'
import { DialogPlugin, MessagePlugin } from 'tdesign-vue-next'
const { container } = useStore()

export const useAlert = (
  parmas: Omit<DialogOptions, 'attach' | 'placement' | 'cancelBtn'>,
) => {
  return DialogPlugin.alert({
    attach: container,
    placement: 'center',
    ...parmas,
  })
}
export const useConfirm = (parmas: DialogOptions) => {
  return DialogPlugin.confirm({
    attach: container,
    placement: 'center',
    preventScrollThrough: false,
    cancelBtn: t('dialog.cancel'),
    ...parmas,
  })
}
export const useMessage = (type: string, parmas: string | MessageOptions) => {
  const options = typeof parmas === 'string' ? { content: parmas } : parmas
  return (
    MessagePlugin[type as keyof typeof MessagePlugin] as
      | CallableFunction
      | undefined
  )?.({
    attach: container,
    ...options,
  })
}

export { DialogPlugin, MessagePlugin }
