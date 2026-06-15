import FontFamily from '@tiptap/extension-font-family'

import type { TiptapPlugin } from './types'

import FontFamilySelect from '../commands/fontFamilySelect.vue'

/**
 * 字体系列功能扩展
 * 提供多种字体选择功能
 */
export const fontFamilyPlugin: TiptapPlugin = {
    name: 'fontFamily',
    extensions: [FontFamily],
    toolbar: [
        {
            type: 'component',
            render: (editor) => <FontFamilySelect editor={editor} />
        }
    ]
}
