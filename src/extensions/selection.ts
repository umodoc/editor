import { type Editor, Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
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

            if (editor.isFocused) {
              return null
            }

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
        ({ editor, chain }) => {
          const node = getSelectionNode(editor)
          if (!node) {
            return false
          }
          if (node.attrs.vnode) {
            if (
              editor.isActive('image') ||
              editor.isActive('video') ||
              editor.isActive('audio') ||
              editor.isActive('file')
            ) {
              const { options } = useStore()
              const { id, src } = node.attrs
              options.value.onFileDelete?.(id, src)
            }
            chain().focus().deleteSelection().run()
            return true
          }
          if (editor.isActive('table')) {
            chain().focus().deleteTable().run()
            return true
          }
          return chain().focus().deleteNode(node.type.name).run()
        },
    }
  },
})
export function getSelectionNode(editor: Editor) {
  editor.commands.selectParentNode()
  // @ts-ignore
  const { $anchor, node } = editor.state.selection
  return $anchor.node(1) || node
}
export function getSelectionText(editor: Editor) {
  const { from, to, empty } = editor.state.selection
  if (empty) {
    return ''
  }
  return editor.state.doc.textBetween(from, to, '')
}
