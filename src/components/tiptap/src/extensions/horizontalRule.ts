import HorizontalRule from '@tiptap/extension-horizontal-rule'

import type { TiptapPlugin } from './types'

/**
 * 分割线功能扩展
 * 提供水平分割线插入功能
 */
export const horizontalRulePlugin: TiptapPlugin = {
    name: 'horizontalRule',
    extensions: [HorizontalRule],
    toolbar: [
        {
            icon: 'ri:separator',
            title: '分割线',
            action: (editor) => editor.chain().focus().setHorizontalRule().run()
        }
    ]
}
