import { type Editor, Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { TextSelection } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    setCurrentNodeSelection: {
      setCurrentNodeSelection: () => ReturnType
    }
    deleteSelectionNode: {
      deleteSelectionNode: () => ReturnType
    }
  }
}
export default Extension.create({
  name: 'selection',
  addProseMirrorPlugins() {
    const { editor } = this

    return [
      new Plugin({
        key: new PluginKey('selection'),
        props: {
          decorations(state) {
            if (state.selection.empty) {
              return null
            }

            // if (editor.isFocused) {
            //   return null
            // }

            return DecorationSet.create(state.doc, [
              Decoration.inline(state.selection.from, state.selection.to, {
                class: 'umo-text-selection',
              }),
            ])
          },
        },
      }),
    ]
  },
  addCommands() {
    return {
      setCurrentNodeSelection:
        () =>
        ({ editor, chain }) => {
          editor.commands.selectParentNode()
          const { $anchor } = editor.state.selection
          return chain()
            .setNodeSelection($anchor.pos - $anchor.depth)
            .run()
        },
      deleteSelectionNode:
        () =>
        ({ editor, commands }) => {
          const node = getSelectionNode(editor)
          if (!node) {
            return false
          }
          // if (node.attrs.vnode) {
          //   if (
          //     editor.isActive('image') ||
          //     editor.isActive('video') ||
          //     editor.isActive('audio') ||
          //     editor.isActive('file')
          //   ) {
          //     const { options } = editor.storage
          //     const { id, src } = node.attrs
          //     options.onFileDelete?.(id, src)
          //   }
          // }
          if (commands.deleteSelection()) {
            return true
          }
          return commands.deleteNode(node.type.name)
        },
    }
  },
})
export function getSelectionNode(editor: Editor) {
  // @ts-ignore
  const { $anchor, node } = editor.state.selection
  if (node?.type?.isAtom) {
    return node
  }
  editor.commands.selectParentNode()
  return $anchor.node(1) || node
}
export function getSelectionText(editor: Editor) {
  const { from, to, empty } = editor.state.selection
  if (empty) {
    return ''
  }
  return editor.state.doc.textBetween(from, to, '')
}

// 设置选中区域 包含选中效果
export function setSelectionText(
  editor: Editor,
  prevDocLength: number,
  from: number,
  to: number,
) {
  const state = editor?.state
  // 计算新的文档长度
  const newDocLength = state.doc.content.size
  // 计算插入内容后的实际结束位置
  const newTo = to + (newDocLength - prevDocLength)
  if (newTo <= from) {
    return false
  }
  const selection = TextSelection.create(state.doc, from, newTo)
  const { tr } = editor.view.state
  if (tr && selection) {
    tr.setSelection(selection)
    editor.view.dispatch(tr)
    editor?.commands.focus()
  }
}
