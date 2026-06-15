import Underline from '@tiptap/extension-underline'

import type { TiptapPlugin } from './types'

/**
 * 下划线功能扩展
 * 提供文本下划线格式化和工具栏按钮
 */
export const underlinePlugin: TiptapPlugin = {
    name: 'underline',
    extensions: [Underline],
    toolbar: [
        {
            icon: 'ri:underline',
            title: '下划线',
            action: (editor) => editor.chain().focus().toggleUnderline().run(),
            isActive: (editor) => editor.isActive('underline')
        }
    ]
}
