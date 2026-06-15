import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'

import type { TiptapPlugin } from './types'

const lowlight = createLowlight(common)

/**
 * 代码块功能扩展
 * 使用 lowlight (highlight.js) 提供语法高亮
 */
export const codeBlockPlugin: TiptapPlugin = {
    name: 'codeBlock',
    extensions: [CodeBlockLowlight.configure({ lowlight })],
    toolbar: [
        {
            icon: 'ri:code-box-line',
            title: '代码块',
            action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
            isActive: (editor) => editor.isActive('codeBlock')
        }
    ]
}
