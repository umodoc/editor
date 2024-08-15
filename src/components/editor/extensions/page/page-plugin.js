import { Plugin, PluginKey } from '@tiptap/pm/state'
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
import { findParentNode } from '@tiptap/core'

let composition = false

function getTotalChildrenHeight(parentElement) {
  let totalHeight = 0

  // 遍历所有的子元素
  const children = parentElement.children
  for (let i = 0; i < children.length; i++) {
    const child = children[i]

    // 获取子元素的高度
    const { height } = getDomHeight(child)
    // 累加高度
    totalHeight += height
  }

  // 返回所有子元素的高度总和
  return totalHeight
}

class PageDetector {
  #editor
  #pageClass
  #checkPoints = [IMAGE, IFRAME, CODE_BLOCK, TOC, VIDEO]

  constructor(editor, pageClass = '.page-node-content') {
    this.#editor = editor
    this.#pageClass = pageClass
  }

  isOverflown(childrenHeight) {
    const { bodyHeight } = getPageOption()
    return childrenHeight > bodyHeight
  }

  checkCriticalPoint(node) {
    const { childCount, firstChild } = node
    if (
      childCount == 1 &&
      firstChild?.type.name == 'table' &&
      firstChild.childCount == 1
    )
      return true
    if (childCount == 1 && this.#checkPoints.includes(firstChild.type.name))
      return true
    return false
  }

  update(view, prevState) {
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
    const pageBody = pageDOM.querySelector(this.#pageClass)
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

class PageState {
  bodyOptions
  deleting
  inserting
  splitPage
  scrollHeight
  runState

  constructor(deleting, inserting, splitPage, scrollHeight, runState = true) {
    this.bodyOptions = getPageOption()
    this.deleting = deleting
    this.inserting = inserting
    this.splitPage = splitPage
    this.scrollHeight = scrollHeight
    this.runState = runState
  }

  transform(tr) {
    const splitPage = tr.getMeta('splitPage') || false
    let deleting = tr.getMeta('deleting') || false
    let inserting = tr.getMeta('inserting') || false
    let runState = tr.getMeta('runState')
    //如果运行状态从false到true时，需要重新计算
    if (this.runState == false && runState == true) inserting = true
    runState = typeof runState == 'undefined' ? this.runState : runState
    const scrollHeight = tr.getMeta('scrollHeight') || this.scrollHeight
    return new PageState(deleting, inserting, splitPage, scrollHeight, runState)
  }
}

export const paginationPluginKey = new PluginKey('pagination')
export const pagePlugin = (editor, nodesComputed) => {
  buildComputedHtml()
  const plugin = new Plugin({
    key: paginationPluginKey,
    view: () => {
      return new PageDetector(editor)
    },
    state: {
      init: () => {
        return new PageState(false, false, false, false, true)
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
        let lazy = false
        slice.content.descendants((node) => {
          if (node.type.name == 'image') lazy = true
          node.attrs.id = getId()
        })
        if (lazy) {
          editor.value.commands.autoPaging(false)
        }
        return slice
      },
    },
  })

  var observer = new MutationObserver(function (mutations) {
    var allLoaded = true
    var images = document.images
    for (var i = 0; i < images.length; i++) {
      if (!images[i].complete) {
        allLoaded = false
        break
      }
    }
    if (allLoaded) {
      setTimeout(() => {
        editor.value.commands.autoPaging()
      }, 100)
    }
  })
  observer.observe(document.getElementsByClassName('editor-container')[0], {
    childList: true,
    subtree: true,
  })

  return plugin
}
export const idPluginKey = new PluginKey('attrkey')
export const idPlugin = (types) => {
  const plugin = new Plugin({
    key: idPluginKey,
    state: {
      init: () => {
        return false
      },
      apply: (tr, prevState) => {
        let data = tr.getMeta('splitPage')
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
