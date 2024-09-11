import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import NodeView from './node-view.vue'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    setCodeBlock: {
      setCodeBlock: (options: any) => ReturnType
    }
  }
}

export default Node.create({
  name: 'codeBlock',
  group: 'block',
  atom: true,
  addAttributes() {
    return {
      vnode: {
        default: true,
      },
      code: {
        default: '',
      },
      language: {
        default: 'plaintext',
      },
      theme: {
        default: 'light',
      },
      lineNumbers: {
        default: true,
      },
      wordWrap: {
        default: false,
      },
    }
  },
  parseHTML() {
    return [{ tag: 'pre' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['pre', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },
  addNodeView() {
    return VueNodeViewRenderer(NodeView)
  },
  addCommands() {
    return {
      setCodeBlock:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
    }
  },
  addKeyboardShortcuts() {
    return {
      'Mod-Alt-c': () => this.editor.commands.setCodeBlock(),
    }
  },
})
