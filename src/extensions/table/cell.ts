import TableCell from '@tiptap/extension-table-cell'

const TableCellOptions = {
  addAttributes(): any {
    return {
      // @ts-ignore
      ...this.parent?.(),
      align: {
        default: null,
        parseHTML: (element: any) => element.getAttribute('align') ?? null,
        renderHTML: ({ align }: any) => ({ align }),
      },
      background: {
        default: null,
        parseHTML: (element: any) => {
          const style = element.getAttribute('style') ?? ''
          const match = style.match(/background(?:-color)?:\s*([^;]+)/i)
          return match ? match[1].trim() : null
        },
        renderHTML: ({ background }: any) => {
          return background ? { style: `background-color: ${background}` } : {}
        },
      },
      color: {
        default: null,
        parseHTML: (element: any) => {
          const style = element.getAttribute('style') ?? ''
          const match = style.match(/(?<!background-)color:\s*([^;]+)/i)
          if (style.includes('background-color')) return null
          return match ? match[1].trim() : null
        },
        renderHTML: ({ color }: any) => {
          return color ? { style: `color: ${color}` } : {}
        },
      },
    }
  },
}

export default TableCell.extend(TableCellOptions)
export { TableCellOptions }
