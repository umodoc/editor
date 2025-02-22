import type { DialogOptions, MessageOptions } from 'tdesign-vue-next'
import { DialogPlugin, MessagePlugin } from 'tdesign-vue-next'

export const useAlert = (
  parmas: Omit<DialogOptions, 'placement' | 'cancelBtn'>,
) => {
  return DialogPlugin.alert({
    placement: 'center',
    ...parmas,
  })
}
export const useConfirm = (parmas: DialogOptions) => {
  return DialogPlugin.confirm({
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
  )?.(options)
}

export { DialogPlugin, MessagePlugin }
