import Code from '@tiptap/extension-code'

import CodeLineIcon from '@/assets/icons/ri--code-line.svg'

import type { EditorPlugin } from './types'

/**
 * 行内代码功能扩展
 * 提供单行代码格式化和工具栏按钮
 */
export const codePlugin: EditorPlugin = {
    name: 'code',
    extensions: [Code],
    toolbar: [
        {
            icon: CodeLineIcon,
            title: '行内代码',
            action: (editor) => editor.chain().focus().toggleCode().run(),
            isActive: (editor) => editor.isActive('code')
        }
    ]
}
