import FontFamily from '@tiptap/extension-font-family'

import type { EditorPlugin } from './types'

import FontFamilySelect from '../commands/fontFamilySelect.vue'

/**
 * 字体系列功能扩展
 * 提供多种字体选择功能
 */
export const fontFamilyPlugin: EditorPlugin = {
    name: 'fontFamily',
    extensions: [FontFamily],
    toolbar: [
        {
            type: 'component',
            render: (editor) => <FontFamilySelect editor={editor} />
        }
    ]
}
