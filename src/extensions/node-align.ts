import { Extension } from '@tiptap/core'
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    setNodeAlign: {
      setNodeAlign: (options: any) => ReturnType
    }
    unsetNodeAlign: {
      unsetNodeAlign: () => ReturnType
    }
  }
}
export default Extension.create({
  name: 'nodeAlign',
  addOptions() {
    return {
      defaultAlignment: 'center',
      alignments: ['flex-start', 'center', 'flex-end'],
      types: ['image', 'video', 'audio', 'iframe', 'file', 'echarts', 'table'],
    }
  },
  addGlobalAttributes() {
    const tableType = 'table'
    const otherType = this.options.types.filter(
      (type: string) => type !== tableType,
    )
    return [
      {
        types: otherType,
        attributes: {
          nodeAlign: {
            default: this.options.defaultAlignment,
            parseHTML: (element) => {
              return (
                element.style.justifyContent || this.options.defaultAlignment
              )
            },
            renderHTML: (attributes) => {
              if (attributes.nodeAlign === this.options.defaultAlignment) {
                return {}
              }
              return { style: `justify-content: ${attributes.nodeAlign}` }
            },
          },
        },
      },
      {
        types: [tableType],
        attributes: {
          nodeAlign: {
            default: this.options.defaultAlignment,
            parseHTML: (element) => {
              return (
                element.getAttribute('node-align') ??
                this.options.defaultAlignment
              )
            },
            renderHTML: (attributes) => {
              if (attributes.nodeAlign === this.options.defaultAlignment) {
                return {}
              }
              return { 'node-align': attributes.nodeAlign }
            },
          },
        },
      },
    ]
  },
  onCreate() {
    //初始化后table节点上 nodeAlign生效的处理。
    const { view } = this.editor
    const { state } = view
    const { doc } = state

    // 遍历文档中的所有节点
    doc.descendants((node, pos) => {
      if (node.type.name === 'table') {
        const alignment = node.attrs.nodeAlign || this.options.defaultAlignment
        if (alignment && this.options.alignments.includes(alignment)) {
          // 使用 view.nodeDOM 获取表格的 DOM 节点
          const tableElement = view.nodeDOM(pos) as HTMLElement
          if (tableElement && tableElement.children[0].tagName === 'TABLE') {
            tableElement.children[0].setAttribute('node-align', alignment)
          }
        }
      }
      return true // 继续遍历子节点
    })
  },
  addCommands() {
    return {
      setNodeAlign:
        (alignment) =>
        ({ commands, view, tr }) => {
          if (!this.options.alignments.includes(alignment)) {
            return false
          }
          return this.options.types.every((type: string) => {
            if (type === 'table') {
              commands.updateAttributes(type, { nodeAlign: alignment })
              const { selection } = tr
              const { $from } = selection
              let tablePos = -1
              // 从当前节点开始向上遍历父节点，直到找到表格节点
              for (let { depth } = $from; depth >= 0; depth--) {
                const node = $from.node(depth)
                if (node.type.name === 'table') {
                  tablePos = $from.start(depth)
                }
              }
              if (tablePos !== -1) {
                const { node: domNode } = view.domAtPos(tablePos)
                const tableElement =
                  (domNode as HTMLTableElement)?.tagName === 'TBODY'
                    ? (domNode.parentNode as HTMLTableElement)
                    : (domNode as HTMLTableElement)
                if (tableElement.tagName === 'TABLE') {
                  tableElement.setAttribute('node-align', alignment)
                }
              }
              return true
            } else {
              return commands.updateAttributes(type, { nodeAlign: alignment })
            }
          })
        },
      unsetNodeAlign:
        () =>
        ({ commands }) => {
          return this.options.types.every((type: string) =>
            commands.resetAttributes(type, 'nodeAlign'),
          )
        },
    }
  },
})
