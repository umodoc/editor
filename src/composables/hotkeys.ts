import hotkeys from 'hotkeys-js'

export const useHotkeys = (keys:string, callback:Function) => {
  hotkeys.filter = () => true
  hotkeys(keys, (e) => {
    e.preventDefault()
    callback()
    return false
  })
}
