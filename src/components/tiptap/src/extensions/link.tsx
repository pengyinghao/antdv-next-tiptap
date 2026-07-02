import { Link } from '@tiptap/extension-link'

import type { EditorPlugin } from './types'

import LinkButton from '../commands/linkButton.vue'

/**
 * 链接功能扩展
 * 提供超链接插入、编辑和删除功能
 */
export const linkPlugin: EditorPlugin = {
    name: 'link',
    extensions: [Link.configure({ openOnClick: false })],
    toolbar: [
        { divider: true },
        {
            type: 'component',
            render: (editor) => <LinkButton editor={editor} />
        }
    ]
}
