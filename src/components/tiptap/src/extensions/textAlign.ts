/**
 * 文本对齐功能扩展
 * 支持左对齐、居中对齐、右对齐和两端对齐
 */
import TextAlign from '@tiptap/extension-text-align'

import type { EditorPlugin } from './types'

export const textAlignPlugin: EditorPlugin = {
    name: 'textAlign',
    extensions: [TextAlign.configure({ types: ['heading', 'paragraph'] })],
    toolbar: [
        { divider: true },
        {
            icon: 'ri:align-left',
            title: '左对齐',
            action: (editor) => editor.chain().focus().setTextAlign('left').run(),
            isActive: (editor) => editor.isActive({ textAlign: 'left' })
        },
        {
            icon: 'ri:align-center',
            title: '居中对齐',
            action: (editor) => editor.chain().focus().setTextAlign('center').run(),
            isActive: (editor) => editor.isActive({ textAlign: 'center' })
        },
        {
            icon: 'ri:align-right',
            title: '右对齐',
            action: (editor) => editor.chain().focus().setTextAlign('right').run(),
            isActive: (editor) => editor.isActive({ textAlign: 'right' })
        },
        {
            icon: 'ri:align-justify',
            title: '两端对齐',
            action: (editor) => editor.chain().focus().setTextAlign('justify').run(),
            isActive: (editor) => editor.isActive({ textAlign: 'justify' })
        }
    ]
}
