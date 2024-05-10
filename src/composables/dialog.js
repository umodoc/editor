import { DialogPlugin, MessagePlugin } from 'tdesign-vue-next'
const { container } = useStore()

export const useAlert = (parmas) => {
  return DialogPlugin.alert({
    attach: container,
    placement: 'center',
    ...parmas,
  })
}
export const useConfirm = (parmas) => {
  return DialogPlugin.confirm({
    attach: container,
    placement: 'center',
    preventScrollThrough: false,
    ...parmas,
  })
}
export const useMessage = (type, parmas) => {
  const options = typeof parmas === 'string' ? { content: parmas } : parmas
  return MessagePlugin[type]({
    attach: container,
    ...options,
  })
}
