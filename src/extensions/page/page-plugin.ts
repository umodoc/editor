import { Plugin, PluginKey, EditorState } from '@tiptap/pm/state'
import { EditorView } from '@tiptap/pm/view'
import { Node } from '@tiptap/pm/model'
import {
  PAGE,
  TABLE,
  IMAGE,
  IFRAME,
  CODE_BLOCK,
  TOC,
  VIDEO,
} from './node-names'
import {
  buildComputedHtml,
  removeAbsentHtmlH,
  UnitConversion,
  findParentDomRefOfType,
  getId,
  getDomHeight,
  getPageOption,
} from './core'
import { defaultNodesComputed, PageComputedContext } from './computed'
import { findParentNode, Editor } from '@tiptap/core'
import { NodesComputed, PageState } from '@/extensions/page/types'

let composition = false

function getTotalChildrenHeight(parentElement: Element) {
  let totalHeight = 0

  // 遍历所有的子元素
  const children = parentElement.children
  for (let i = 0; i < children.length; i++) {
    const child = children[i]

    // 获取子元素的高度
    // @ts-ignore
    const { height } = getDomHeight(child)
    // 累加高度
    totalHeight += height
  }

  // 返回所有子元素的高度总和
  return totalHeight
}

class PageDetector {
  #editor: Editor
  #pageClass: string
  #checkPoints = [IMAGE, IFRAME, CODE_BLOCK, TOC, VIDEO]

  constructor(editor: Editor, pageClass = '.umo-page-node-content') {
    this.#editor = editor
    this.#pageClass = pageClass
  }

  isOverflown(childrenHeight: number) {
    const { bodyHeight } = getPageOption()
    return childrenHeight > bodyHeight
  }

  checkCriticalPoint(node: Node) {
    const { childCount, firstChild } = node
    if (
      childCount == 1 &&
      firstChild?.type.name == 'table' &&
      firstChild.childCount == 1
    )
      return true
    if (
      firstChild &&
      childCount == 1 &&
      this.#checkPoints.includes(firstChild.type.name)
    )
      return true
    return false
  }

  update(view: EditorView, prevState: EditorState) {
    if (composition) return
    const { selection, schema, tr } = view.state
    if (view.state.doc.eq(prevState.doc)) return

    const domAtPos = view.domAtPos.bind(view)
    const scrollHeight = paginationPluginKey.getState(prevState).scrollHeight
    let deleting = false
    const pageDOM = findParentDomRefOfType(
      schema.nodes[PAGE],
      domAtPos,
    )(selection)

    if (!pageDOM) return
    const pageBody = (pageDOM as HTMLElement).querySelector(this.#pageClass)
    if (pageBody) {
      let childrenHeight = getTotalChildrenHeight(pageBody)
      deleting =
        view.state.doc.nodeSize < prevState.doc.nodeSize
          ? scrollHeight > childrenHeight
          : false
      tr.setMeta('scrollHeight', childrenHeight)
      const inserting = this.isOverflown(childrenHeight)
      if (inserting) {
        const curPage = findParentNode((n) => n.type.name == PAGE)(selection)
        if (curPage && this.checkCriticalPoint(curPage.node)) return
      }
      if (inserting || deleting) {
        if (inserting) tr.setMeta('inserting', inserting)
        if (deleting) {
          tr.setMeta('deleting', true)
        }
      }
      view.dispatch(tr)
    }
  }
}

export const paginationPluginKey = new PluginKey('pagination')
export const pagePlugin = (editor: Editor, nodesComputed: NodesComputed) => {
  buildComputedHtml()
  const plugin = new Plugin({
    key: paginationPluginKey,
    view: () => {
      return new PageDetector(editor)
    },
    state: {
      init: () => {
        return new PageState(false, false, false, false, 0, true)
      },
      /*判断标志位是否存在  如果存在 则修改 state 值
       * Meta数据是一个事务级别的 一个事务结束 meta消失
       * state则在整个生命周期里都存在的
       * */
      apply: (tr, prevState) => {
        return prevState.transform(tr)
      },
    },
    appendTransaction([newTr], _prevState, state) {
      removeAbsentHtmlH()
      const page = new PageComputedContext(
        editor,
        { ...defaultNodesComputed, ...nodesComputed },
        this.getState(state),
        state,
      )
      return page.run()
    },
    props: {
      handleDOMEvents: {
        compositionstart(view, event) {
          composition = true
        },

        compositionend(view, event) {
          composition = false
        },
      },
      transformPasted(slice, view) {
        slice.content.descendants((node) => {
          // @ts-ignore
          node.attrs.id = getId()
        })
        return slice
      },
    },
  })
  return plugin
}
export const idPluginKey = new PluginKey('attrkey')
export const idPlugin = (types: string[]) => {
  const plugin = new Plugin({
    key: idPluginKey,
    state: {
      init: () => {
        return false
      },
      apply: (tr, prevState) => {
        let data = tr.getMeta('initSplit')
        return data
      },
    },
    appendTransaction(transactions, _prevState, nextState) {
      const tr = nextState.tr
      let modified = false
      let init = idPluginKey.getState(nextState)
      if (init || transactions.some((transaction) => transaction.docChanged)) {
        nextState.doc.descendants((node, pos) => {
          const attrs = node.attrs
          if (types.includes(node.type.name) && !attrs.id) {
            tr.setNodeMarkup(pos, undefined, { ...attrs, id: getId() })
            modified = true
          }
        })
      }
      return modified ? tr : null
    },
  })

  return plugin
}
