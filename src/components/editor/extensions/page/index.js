import {
  mergeAttributes,
  findChildrenInRange,
  findParentNode,
  Node
} from '@tiptap/core'
import {
  PAGE,
  EXTEND,
  BULLETLIST,
  CASSIE_BLOCK,
  HEADING,
  LISTITEM,
  ORDEREDLIST,
  PARAGRAPH,
  TABLE,
  TABLE_ROW,
  TEXT_BOX,
  IMAGE,
  IFRAME,
  FILE,
  CODE_BLOCK,
  AUDIO,
  TOC,
  VIDEO,
  HORIZONTALRULE,
  PAGEBREAK,
  TABLEHEADER
} from './node-names'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { Selection, TextSelection } from '@tiptap/pm/state'
import { Slice } from '@tiptap/pm/model'
import { buildComputedHtml, changeComputedHtml, getFlag, getPageOption, removeComputedHtml } from './core'
import { idPlugin, pagePlugin } from './page-plugin'
import { splitBlock } from './split-block'
import { splitListItem } from './split-list-item'
import NodeView from './node-view.vue'
import { ReplaceStep } from '@tiptap/pm/transform'

const types = [
  HEADING,
  PARAGRAPH,
  BULLETLIST,
  LISTITEM,
  ORDEREDLIST,
  TABLE,
  TABLE_ROW,
  CASSIE_BLOCK,
  TEXT_BOX,
  IMAGE,
  IFRAME,
  FILE,
  CODE_BLOCK,
  AUDIO,
  TOC,
  VIDEO,
  HORIZONTALRULE,
  PAGEBREAK,
  TABLEHEADER
]
export default Node.create({
  priority: 2,
  name: `${PAGE}`,
  content: `block*`,
  group: 'block',
  isolating: true,
  selectable: false,
  isLeaf: true,
  addOptions() {
    return {
      SystemAttributes: {},
      nodesComputed: {},
      View: VueNodeViewRenderer(NodeView),
      types: []
    }
  },
  /* 自定义操作 */
  addAttributes() {
    return {
      HTMLAttributes: {},
      pageNumber: {
        default: 1
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'page'
      }
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    return ['page', mergeAttributes(HTMLAttributes), 0]
  },
  addCommands() {
    return {
      splitBlock,
      splitListItem,
      resetPageStore: () => {

        changeComputedHtml()
        return ({ tr, state, dispatch, editor }) => {
          if (dispatch) {
            dispatch(tr.setMeta('splitPage', true))
          }
          return true
        }
      },
      autoPaging: (status = true) => {
        return ({ tr, state, dispatch, editor }) => {
          if (dispatch) {
            tr.setMeta('runState', status)
          }
          return true
        }
      }
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: types.concat(this.options.types || []),
        attributes: {
          id: {
            default: null
          },
          extend: {
            default: false
          }
        }
      }
    ]
  },
  addKeyboardShortcuts() {
    const handleBackspace = () =>
      this.editor.commands.first(({ commands }) => [
        () => commands.undoInputRule(),
        () =>
          commands.command(({ tr }) => {
            const { selection, doc } = tr
            const { empty, $anchor } = selection
            const { pos, parent } = $anchor
            const isAtStart = Selection.atStart(doc).from === pos
            if (
              !empty ||
              !isAtStart ||
              !parent.type.isTextblock ||
              parent.textContent.length
            ) {
              return false
            }
            return commands.clearNodes()
          }),
        () => deleteSelection(commands),
        () => commands.joinBackward(),

        () => commands.selectNodeBackward(),
        () =>
          commands.command(({ editor, tr }) => {
            const { selection, doc } = tr
            const { $anchor } = selection
            const { pos } = $anchor
            if (doc.childCount == 1) return false
            if (Selection.atEnd(doc).from === pos && !$anchor.parentOffset) {
              return commands.deleteNode(PAGE)
            }
            const pageNode = findParentNode((node) => node.type.name === PAGE)(
              selection
            )
            if (pageNode) {
              //获取当前页面节点的 第一个子节点类型
              const curBlockType = pageNode.node.firstChild.type
              //判断当前的光标位置是否是第一个节点的第一个点
              const isAtStart =
                pageNode.start + Selection.atStart(pageNode.node).from === pos
              if (isAtStart) {
                const vm = TextSelection.create(doc, pos - 20, pos - 20)
                const beforePageNode = findParentNode(
                  (node) => node.type.name === PAGE
                )(vm)
                if (beforePageNode) {
                  const pos1 =
                    Selection.atEnd(beforePageNode.node).from +
                    beforePageNode.start
                  const selection1 = TextSelection.create(doc, pos1, pos1)
                  //和上一页的最后一个节点进行对比 如果相等则合并
                  if (curBlockType == beforePageNode.node.lastChild.type) {
                    const parent = selection1.$anchor.parent
                    if (getFlag(parent, editor.schema)) {
                      tr.setSelection(selection1)
                    } else {
                      tr.step(new ReplaceStep(pos1, pos, Slice.empty))
                    }
                    return true
                  }
                  tr.setSelection(selection1)
                }
                return true
              }
            }
            return false
          })
      ])
    const handleDelete = () =>
      this.editor.commands.first(({ commands }) => [
        () => deleteSelection(commands),
        () =>
          commands.command(({ tr }) => {
            const { selection, doc } = tr
            const { $anchor } = selection
            const currentNode = $anchor.node()
            const blockNode = findParentNode(
              (node) => node.type.name === CASSIE_BLOCK
            )(selection)
            if (blockNode) {
              const isBlockStart =
                blockNode.start + Selection.atStart(blockNode.node).from ===
                $anchor.pos
              if (isBlockStart && blockNode.node.childCount == 1) {
                if (currentNode.content.size == 0) {
                  return true
                }
              }
            }
            return commands.joinForward()
          }),
        () => {
          return commands.selectNodeForward()
        },
        () =>
          commands.command(({ tr }) => {
            //以上系统所有默认操作 都没有成功的时候会进入这个分支
            const { selection, doc } = tr
            const { $anchor } = selection
            const { pos } = $anchor
            //如果当前只有一页的情况不做处理
            if (doc.childCount == 1) return false
            //如果是最后一页并且删除的点已经是 整个文档的 最后点位 证明最后一页啥都没了直接删除
            if (Selection.atEnd(doc).from === pos) {
              return commands.deleteNode(PAGE)
            }
            //找到当钱的page
            const pageNode = findParentNode((node) => node.type.name === PAGE)(
              selection
            )
            if (pageNode) {
              //如果光标在在当前页面 的最后一个位置
              const isAtEnd =
                pageNode.start + Selection.atEnd(pageNode.node).from === pos
              if (isAtEnd) {
                const vm = TextSelection.create(doc, pos + 6, pos + 6)
                const afterPageNode = findParentNode(
                  (node) => node.type.name === PAGE
                )(vm)
                //找到上一个page 获取到最后一个点 然后设置 光标选中
                if (afterPageNode) {
                  const pos1 =
                    Selection.atStart(afterPageNode.node).from +
                    afterPageNode.start
                  //EXTEND 是扩展类型 是可以删除并合并的
                  const selection1 = TextSelection.create(doc, pos1, pos1)
                  const curBlock = findParentNode((node) => node.attrs.extend)(
                    selection1
                  )
                  if (curBlock) {
                    tr.step(new ReplaceStep(pos, pos1, Slice.empty))
                    return true
                  }
                }
              }
            }
            return false
          })
      ])
    const handleTab = () =>
      this.editor.commands.first(({ commands }) => [
        () => {
          return true
        }
      ])
    return {
      Backspace: handleBackspace,
      Delete: handleDelete,
      Tab: handleTab
    }
  },
  addProseMirrorPlugins() {
    return [idPlugin(types.concat(this.options.types || []))]
  },
  addNodeView() {
    1
    return this.options.View
  }
})

export function getSplittedAttributes(
  extensionAttributes,
  typeName,
  attributes
) {
  return Object.fromEntries(
    Object.entries(attributes).filter(([name]) => {
      const extensionAttribute = extensionAttributes.find((item) => {
        return item.type === typeName && item.name === name
      })

      if (!extensionAttribute) {
        return false
      }

      return extensionAttribute.attribute.keepOnSplit
    })
  )
}

const deleteSelection = (commands) => {
  return commands.command(({ tr }) => {
    const { selection, doc } = tr
    const nodesInChangedRanges = findChildrenInRange(
      doc,
      {
        from: selection.from,
        to: selection.to
      },
      (node) => node.type.name == CASSIE_BLOCK
    )
    for (let i = 0; i < nodesInChangedRanges.length; i++) {
      const node = nodesInChangedRanges[i]
      const endPos = node.pos + node.node.nodeSize
      if (selection.from < node.pos || selection.to > endPos) {
        return true
      }
    }
    return commands.deleteSelection()
  })
}
