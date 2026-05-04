export const getShortcut = (shortcut) => {
  if (!shortcut) {
    return ''
  }
  const isMacOS = /macintosh|mac os x/gi.test(navigator.userAgent)
  let keys = shortcut
  if (isMacOS) {
    keys = keys
      .replace(/ctrl/gi, '⌘')
      .replace(/shift/gi, '⇧')
      .replace(/alt/gi, '⌥')
      .replace(/Enter/gi, 'Return')
      .replace(/Backspace/gi, 'Delete')
  }
  return keys
}
