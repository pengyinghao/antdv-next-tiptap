import Strike from '@tiptap/extension-strike'

import type { TiptapPlugin } from './types'

/**
 * 删除线功能扩展
 * 提供文本删除线格式化和工具栏按钮
 */
export const strikePlugin: TiptapPlugin = {
    name: 'strike',
    extensions: [Strike],
    toolbar: [
        {
            icon: 'ri:strikethrough',
            title: '删除线',
            action: (editor) => editor.chain().focus().toggleStrike().run(),
            isActive: (editor) => editor.isActive('strike')
        }
    ]
}
