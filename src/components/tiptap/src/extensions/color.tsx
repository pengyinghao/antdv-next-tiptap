/**
 * 文字颜色功能扩展
 * 提供自定义文字颜色选择器和工具栏组件
 */
import { Color } from '@tiptap/extension-color'

import type { EditorPlugin } from './types'

import ColorButton from '../commands/colorButton.vue'

export const colorPlugin: EditorPlugin = {
    name: 'color',
    /** 注册颜色扩展 */
    extensions: [Color],
    toolbar: [
        { divider: true },
        {
            type: 'component',
            render: (editor) => (
                <ColorButton
                    editor={editor}
                    icon="ri:font-family"
                    title="文字颜色"
                    getColor={() =>
                        (editor.getAttributes('textStyle').color as string | undefined) ?? '#000000'
                    }
                    apply={(color: string) =>
                        color
                            ? editor.chain().focus().setColor(color).run()
                            : editor.chain().focus().unsetColor().run()
                    }
                />
            )
        }
    ]
}
