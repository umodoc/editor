import { Extension, findParentNode } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { LIST_TYPE } from '@/components/editor/extensions/page/node-names'

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

            if (editor.isFocused === true) {
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
      getSelectionText:
        () =>
        ({ editor }) => {
          const { from, to, empty } = editor.state.selection
          if (empty) {
            return ''
          }
          return editor.state.doc.textBetween(from, to, '')
        },
      getSelectionNode:
        () =>
        ({ editor, chain }) => {
          const { node } = editor.state.selection
          if (node) {
            return node
          }
          let parentNode = findParentNode((node) =>
            LIST_TYPE.includes(node.type.name),
          )(editor.state.selection)
          const { $anchor } = editor.state.selection
          if (parentNode) {
            return $anchor.node(parentNode.depth)
          }
          editor.commands.selectParentNode()
          return editor.state.selection.node
        },
      setCurrentNodeSelection:
        () =>
        ({ editor, chain }) => {
          debugger
          let parentNode = findParentNode((node) =>
            LIST_TYPE.includes(node.type.name),
          )(editor.state.selection)
          if (parentNode) {
            return chain().setNodeSelection(parentNode.pos).run()
          }
          return editor.commands.selectParentNode()
        },
      deleteSelectionNode:
        () =>
        ({ editor, chain }) => {
          const node = editor.commands.getSelectionNode()
          if (!node) {
            return
          }
          if (node.attrs.vnode) {
            if (
              editor.isActive('image') ||
              editor.isActive('video') ||
              editor.isActive('audio') ||
              editor.isActive('file')
            ) {
              const { options } = useStore()
              const { id, src } = node
              options.value.onFileDelete(id, src)
            }
            chain().focus().deleteSelection().run()
            return
          }
          if (editor.isActive('table')) {
            chain().focus().deleteTable().run()
            return
          }
          chain().focus().deleteNode(node.type.name).run()
        },
    }
  },
})
