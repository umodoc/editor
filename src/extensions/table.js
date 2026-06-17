import { Table } from '@tiptap/extension-table'
import { TableCell } from '@tiptap/extension-table/cell'
import { TableHeader } from '@tiptap/extension-table/header'
import { TableRow } from '@tiptap/extension-table/row'

// 扩展表格能力
const CustomTable = Table.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: 'umo-node-table',
      },
      allowTableNodeSelection: true,
      resizable: true,
    }
  },
})

// 扩展单元格
const TableCellOptions = {
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: null,
        parseHTML: (element) => element.getAttribute('align') || null,
        renderHTML: ({ align }) => ({ align }),
      },
      background: {
        default: null,
        parseHTML: (element) => {
          const style = element.getAttribute('style') || ''
          const match = style.match(/background(?:-color)?:\s*([^;]+)/i)
          return match ? match[1].trim() : null
        },
        renderHTML: ({ background }) => {
          return background ? { style: `background-color: ${background}` } : {}
        },
      },
      color: {
        default: null,
        parseHTML: (element) => {
          const style = element.getAttribute('style') || ''
          const match = style.match(/(?<!background-)color:\s*([^;]+)/i)
          if (style.includes('background-color')) return null
          return match ? match[1].trim() : null
        },
        renderHTML: ({ color }) => {
          return color ? { style: `color: ${color}` } : {}
        },
      },
      borderColor: {
        default: null,
        parseHTML: (element) => {
          const style = element.getAttribute('style') || ''
          const match = style.match(/border(?:-color)?:\s*([^;]+)/i)
          return match ? match[1].trim() : null
        },
        renderHTML: ({borderColor }) => {
          return borderColor ? { style: `border-color: ${borderColor}` } : {}
        },
      },
    }
  },
}

const CustomTableHeader = TableHeader.extend(TableCellOptions)
const CustomTableCell = TableCell.extend(TableCellOptions)

export {
  CustomTable as Table,
  CustomTableCell as TableCell,
  CustomTableHeader as TableHeader,
  TableRow,
}
