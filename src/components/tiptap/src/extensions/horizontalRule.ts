import HorizontalRule from '@tiptap/extension-horizontal-rule'

import SeparatorIcon from '@/assets/icons/ri--separator.svg'

import type { EditorPlugin } from './types'

/**
 * 分割线功能扩展
 * 提供水平分割线插入功能
 */
export const horizontalRulePlugin: EditorPlugin = {
    name: 'horizontalRule',
    extensions: [HorizontalRule],
    toolbar: [
        {
            icon: SeparatorIcon,
            title: '分割线',
            action: (editor) => editor.chain().focus().setHorizontalRule().run()
        }
    ]
}
