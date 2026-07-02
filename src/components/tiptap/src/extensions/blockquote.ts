import Blockquote from '@tiptap/extension-blockquote'

import DoubleQuotesIcon from '@/assets/icons/ri--double-quotes-l.svg'

import type { EditorPlugin } from './types'
/**
 * 引用块功能扩展
 * 提供文本引用格式化和工具栏按钮
 */
export const blockquotePlugin: EditorPlugin = {
    name: 'blockquote',
    extensions: [Blockquote],
    toolbar: [
        { divider: true },
        {
            icon: DoubleQuotesIcon,
            title: '引用',
            action: (editor) => editor.chain().focus().toggleBlockquote().run(),
            isActive: (editor) => editor.isActive('blockquote')
        }
    ]
}
