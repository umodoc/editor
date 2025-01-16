import hotkeys from 'hotkeys-js'

export const useHotkeys = (keys: string, callback: CallableFunction) => {
  hotkeys.filter = () => true
  hotkeys(keys, (e: Event) => {
    e.preventDefault()
    callback()
    return false
  })
}

export const removeAllHotkeys = () => {
  hotkeys.unbind()
}
