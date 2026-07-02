import type { EditorPlugin } from './types'

/**
 * 清除格式功能扩展
 * 提供清除所有文本格式化的功能
 * 支持清除节点格式和标记格式
 */
export const clearFormatPlugin: EditorPlugin = {
    name: 'clearFormat',
    extensions: [],
    toolbar: [
        { divider: true },
        {
            icon: 'ri:eraser-line',
            title: '清除格式',
            action: (editor) => editor.chain().focus().clearNodes().unsetAllMarks().run()
        }
    ]
}
