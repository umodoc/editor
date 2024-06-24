import i18n from '../i18n'

export const t = i18n.global.t
export const l = (data) => {
  const lang = i18n.global.locale.value.replace('-', '_')
  if (typeof data === 'string') {
    return data
  }
  if (typeof data === 'object') {
    return data[lang]
  }
}
