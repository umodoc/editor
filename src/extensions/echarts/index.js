import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import NodeView from './node-view.vue'

export default Node.create({
  name: 'echarts',
  inline: false,
  group: 'block',
  atom: true,
  addAttributes() {
    return {
      vnode: {
        default: true,
      },
      id: {
        default: null,
      },
      name: {
        default: null,
      },
      width: {
        default: null,
      },
      height: {
        default: 300,
      },
      mode: {
        default: 1,
      },
      chartOptions: {
        default: null,
        parseHTML: (element) => {
          const _data = element.hasAttribute('chart-options')
            ? element.getAttribute('chart-options')
            : null
          return _data ? JSON.parse(_data) : null
        },
        renderHTML: (attributes) => ({
          'chart-options': attributes.chartOptions
            ? JSON.stringify(attributes.chartOptions)
            : null,
        }),
      },
      chartConfig: {
        default: null,
        parseHTML: (element) => {
          const _data = element.hasAttribute('chart-config')
            ? element.getAttribute('chart-config')
            : null
          return _data ? JSON.parse(_data) : null
        },
        renderHTML: (attributes) => ({
          'chart-config': attributes.chartConfig
            ? JSON.stringify(attributes.chartConfig)
            : null,
        }),
      },
      src: '',
      describe: {
        default: null,
      },
    }
  },
  parseHTML() {
    return [{ tag: 'echarts' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['echarts', mergeAttributes(HTMLAttributes)]
  },
  addNodeView() {
    return VueNodeViewRenderer(NodeView)
  },
  addCommands() {
    return {
      setEcharts:
        (options) =>
        ({ commands, editor }) => {
          return commands.insertContentAt(editor.state.selection.anchor, {
            type: this.name,
            attrs: options,
          })
        },
      updateEcharts:
        (options) =>
        ({ commands, editor, tr }) => {
          editor.commands.selectParentNode()
          const { selection } = editor.state
          tr.setSelection(selection)
          const { doc } = tr
          const { from, to } = selection
          doc.nodesBetween(from, to, (node, pos) => {
            if (node.type.name === this.name) {
              commands.updateAttributes(this.name, options)
              return false
            }
            return true
          })
          return true
        },
    }
  },
})
