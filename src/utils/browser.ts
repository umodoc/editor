const nav = typeof navigator !== 'undefined' ? navigator : null
const doc = typeof document !== 'undefined' ? document : null
export const agent = nav?.userAgent ?? ''

export const ie_edge = /Edg\/(\d+)/.exec(agent)
export const ie_upto10 = /MSIE \d/.exec(agent)
export const ie_11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(agent)

export const ie = !!(ie_upto10 ?? ie_11up ?? ie_edge)
export const ie_version = ie_upto10
  ? Reflect.get(document, 'documentMode')
  : ie_11up
    ? +ie_11up[1]
    : ie_edge
      ? +ie_edge[1]
      : 0
export const gecko = !ie && /gecko\/(\d+)/i.test(agent)
export const gecko_version =
  gecko && +(/Firefox\/(\d+)/.exec(agent) ?? [0, 0])[1]

export const chrome = Boolean(!ie && /Chrome\/(\d+)/.test(agent))
export const chrome_version: number = chrome
  ? Number.parseInt(/Chrome\/(\d+)/.exec(agent)?.[1] ?? '0', 10)
  : 0
export const safari = !ie && !!nav && nav.vendor.includes('Apple Computer')
// Is true for both iOS and iPadOS for convenience
export const ios =
  safari && (/Mobile\/\w+/.test(agent) || (!!nav && nav.maxTouchPoints > 2))
export const mac = ios || (nav ? nav.platform.includes('Mac') : false)
export const windows = nav ? nav.platform.includes('Win') : false
export const android = /Android \d/.test(agent)
export const webkit =
  !!doc && 'webkitFontSmoothing' in doc.documentElement.style
export const webkit_version = webkit
  ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) ?? [0, 0])[1]
  : 0
