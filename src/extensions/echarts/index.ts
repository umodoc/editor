import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import NodeView from './node-view.vue'
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    //新增图表
    setEcharts: {
      setEcharts: (options: any) => ReturnType
    },
    //更新命令的类型定义
    updateEcharts: {
      updateEcharts: (options: any) => ReturnType
    }
  }
}
//组件扩展于echarts 适配标准echarts 也可以自定义属性进行转换
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
      id: {//图形唯一标识 若生成图片，这就是唯一标识
        default: null,
      },
      name: {//名称
        default: null,
      },
      width: {
        default: 500,
      },
      height: {
        default: 300,
      },
      draggable: {
        default: false,
      },
      mode: {//图表设置时，默认打开的模式 0 表示直接使用echarts的options json  源码模式   1：可视化模式，可以通过配置创建图表
        default: 1,
      },
      chartOptions: { //展示配置，echarts的options mode==0时使用
        default: null,
      },
      chartConfig: {//基础配置 后续适配自定义的数据集合和配置信息 mode==1时使用
        default: null,
      },
      src: "",//图片地址路径，也记录图片唯一标识
      describe: {//描述信息
        default: null
      }
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
      // 新增更新命令
      updateEcharts:
        (options) =>
          ({ commands, editor, tr }) => {
            // 获取当前选中的节点
            editor.commands.selectParentNode()
            const { selection } = editor.state;
            tr.setSelection(selection)
            const { doc } = tr
            const { from, to } = selection
            doc.nodesBetween(from, to, (node, pos) => {
              if (node.type.name === this.name) {
                // 更新选中节点的属性
                commands.updateAttributes(this.name, options)
                return false
              }
              return true
            })
            return true;
          }
    }
  },
})
