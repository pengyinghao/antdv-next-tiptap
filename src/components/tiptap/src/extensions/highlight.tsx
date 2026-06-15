import Highlight from '@tiptap/extension-highlight'

import type { TiptapPlugin } from './types'

import ColorButton from '../commands/colorButton.vue'

/**
 * 文本高亮功能扩展
 * 提供文本背景高亮色选择功能
 * 支持多色彩高亮显示
 */
export const highlightPlugin: TiptapPlugin = {
    name: 'highlight',
    extensions: [Highlight.configure({ multicolor: true })],
    toolbar: [
        {
            type: 'component',
            render: (editor) => (
                <ColorButton
                    editor={editor}
                    icon="ri:paint-fill"
                    title="高亮"
                    getColor={() =>
                        (editor.getAttributes('highlight').color as string | undefined) ?? '#fff'
                    }
                    apply={(color: string) =>
                        color
                            ? editor.chain().focus().setHighlight({ color }).run()
                            : editor.chain().focus().unsetHighlight().run()
                    }
                />
            )
        }
    ]
}
