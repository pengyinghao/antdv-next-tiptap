import { FontSize } from '@tiptap/extension-text-style'

import type { TiptapPlugin } from './types'

import FontSizeSelect from '../commands/fontSizeSelect.vue'

/**
 * 字体大小功能扩展
 * 提供多种字号选择功能
 */
export const fontSizePlugin: TiptapPlugin = {
    name: 'fontSize',
    extensions: [FontSize],
    toolbar: [
        {
            type: 'component',
            render: (editor) => <FontSizeSelect editor={editor} />
        }
    ]
}
