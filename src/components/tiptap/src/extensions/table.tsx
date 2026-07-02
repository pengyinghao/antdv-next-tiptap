/**
 * 表格功能扩展
 * 提供可调整大小的表格编辑功能和工具栏组件
 * 包含表格、行、单元格和表头的完整实现
 */
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table'

import type { TiptapPlugin } from './types'

import TableButton from '../commands/tableButton.vue'

const TableRowWithHeight = TableRow.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            height: {
                default: null,
                parseHTML: (el) => el.style.height || el.getAttribute('height') || null,
                renderHTML: ({ height }) => (height ? { style: `height: ${height}` } : {})
            }
        }
    }
})

export const tablePlugin: TiptapPlugin = {
    name: 'table',
    extensions: [Table.configure({ resizable: true }), TableRowWithHeight, TableHeader, TableCell],
    toolbar: [
        { divider: true },
        {
            type: 'component',
            render: (editor) => <TableButton editor={editor} />
        }
    ]
}
