import Blockquote from '@tiptap/extension-blockquote'

import type { TiptapPlugin } from './types'

/**
 * 引用块功能扩展
 * 提供文本引用格式化和工具栏按钮
 */
export const blockquotePlugin: TiptapPlugin = {
    name: 'blockquote',
    extensions: [Blockquote],
    toolbar: [
        { divider: true },
        {
            icon: 'ri:double-quotes-l',
            title: '引用',
            action: (editor) => editor.chain().focus().toggleBlockquote().run(),
            isActive: (editor) => editor.isActive('blockquote')
        }
    ]
}
