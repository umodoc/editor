import type { NodeViewRenderer } from '@tiptap/core'
import type { Attrs, Node, NodeType, Schema } from '@tiptap/pm/model'
import type { Transaction } from '@tiptap/pm/state'

import type { SplitContext } from '@/extensions/page/computed'
import { getPageOption } from '@/extensions/page/core'

export type ComputedFn = (
  splitContex: SplitContext,
  node: Node,
  pos: number,
  parent: Node | null,
  dom: HTMLElement,
  startIndex: number,
  forcePageId: string,
  i: number,
) => boolean
export type NodesComputed = Record<string, ComputedFn>

export interface PageOptions {
  SystemAttributes: Record<string, any>
  nodesComputed: NodesComputed
  View: NodeViewRenderer
  types: string[]
  slots: any
}

export interface SplitInfo {
  pos: number
  depth: number
  attributes?: Record<string, any>
}

export interface SplitParams {
  pos: number
  depth?: number
  typesAfter?: ({ type: NodeType; attrs?: Attrs | null } | null)[]
  schema: Schema
  force: boolean
}

export class PageState {
  bodyOptions: any
  deleting: boolean
  inserting: boolean
  splitPage: boolean
  initSplit: boolean
  scrollHeight = 0
  runState: boolean

  constructor(
    deleting: boolean,
    inserting: boolean,
    splitPage: boolean,
    initSplit: boolean,
    scrollHeight: number,
    runState = true,
  ) {
    this.bodyOptions = getPageOption()
    this.deleting = deleting
    this.inserting = inserting
    this.splitPage = splitPage
    this.initSplit = initSplit
    this.scrollHeight = scrollHeight
    this.runState = runState
  }

  transform(tr: Transaction) {
    const splitPage = tr.getMeta('splitPage') || false
    const initSplit = tr.getMeta('initSplit') || false
    const deleting = tr.getMeta('deleting') || false
    let inserting = tr.getMeta('inserting') || false
    let runState = tr.getMeta('runState')
    //如果运行状态从false到true时，需要重新计算
    if (!this.runState && runState === true) {
      inserting = true
    }
    runState = typeof runState === 'undefined' ? this.runState : runState
    const scrollHeight = tr.getMeta('scrollHeight') || this.scrollHeight
    return new PageState(
      deleting,
      inserting,
      splitPage,
      initSplit,
      scrollHeight,
      runState,
    )
  }
}
