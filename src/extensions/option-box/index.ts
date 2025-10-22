import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import NodeView from './node-view.vue'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    insertOptionBox: {
      insertOptionBox: (options: any) => ReturnType
    }
    updateOptionBox: {
      updateOptionBox: (options: any) => ReturnType
    }
  }
}

export default Node.create({
  name: 'optionBox',
  group: 'inline',
  inline: true,
  atom: true,
  addAttributes() {
    return {
      boxType: {
        default: 'checkbox', // 'checkbox' 或 'radio'
      },
      boxOptions: {
        default: [
          { label: '选项1', checked: false, key: '1' },
          { label: '选项2', checked: false, key: '2' },
        ],
        parseHTML: (element) => {
          const _data = element.hasAttribute('box-options')
            ? element.getAttribute('box-options')
            : null
          return _data ? JSON.parse(_data) : null
        },
        renderHTML: (attributes) => ({
          // 在渲染 HTML 时，确保 chartOptions 被序列化为字符串
          'box-options': attributes.boxOptions
            ? JSON.stringify(attributes.boxOptions)
            : null,
        }),
      },
      boxShowCheckAll: {
        default: false,
      },
      boxChecked: {
        default: true,
      },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-type="option-box"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    const showText = HTMLAttributes['box-options'] ?? ''

    return [
      'span',
      mergeAttributes(HTMLAttributes, { 'data-type': 'option-box' }),
      showText,
    ]
  },
  addNodeView() {
    return VueNodeViewRenderer(NodeView)
  },

  addCommands() {
    return {
      insertOptionBox:
        (options) =>
        ({ chain, editor }) => {
          const { to } = editor?.state.selection ?? {}
          return chain()
            .insertContentAt(to - 1, {
              type: this.name,
              attrs: options,
            })
            .run()
        },
      updateOptionBox:
        (options) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, options)
        },
    }
  },
})
