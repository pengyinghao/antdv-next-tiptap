/**
 * 斜体功能扩展
 * 提供文本斜体格式化和工具栏按钮
 */
import Italic from '@tiptap/extension-italic'

import ItalicIcon from '@/assets/icons/ri--italic.svg'

import type { EditorPlugin } from './types'

export const italicPlugin: EditorPlugin = {
    name: 'italic',
    extensions: [Italic],
    toolbar: [
        {
            icon: ItalicIcon,
            title: '斜体',
            action: (editor) => editor.chain().focus().toggleItalic().run(),
            isActive: (editor) => editor.isActive('italic')
        }
    ]
}
