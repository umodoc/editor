import hotkeys from 'hotkeys-js'

export const useHotkeys = (keys: string, callback: CallableFunction) => {
  hotkeys.filter = () => true
  hotkeys(keys, (e) => {
    e.preventDefault()
    callback()
    return false
  })
}
