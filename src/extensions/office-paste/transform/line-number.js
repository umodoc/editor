import { unwrapNode } from '../utils'

export const transformRemoveLineNumberWrapper = (doc) => {
  doc
    .querySelectorAll(`[class*="MsoLineNumber"]`)
    .forEach((node) => unwrapNode(node))
}
