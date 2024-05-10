import hotkeys from 'hotkeys-js'

export const useHotkeys = (keys, callback) => {
  hotkeys.filter = () => true
  hotkeys(keys, (e) => {
    e.preventDefault()
    callback()
    return false
  })
}
