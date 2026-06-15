import { UndoRedo } from '@tiptap/extensions'

import type { TiptapPlugin } from './types'

/**
 * 撤销重做功能扩展
 * 提供撤销和重做操作功能
 */
export const undoRedoPlugin: TiptapPlugin = {
    name: 'undoRedo',
    extensions: [UndoRedo],
    toolbar: [
        { divider: true },
        {
            icon: 'ri:arrow-go-back-line',
            title: '撤销',
            action: (editor) => editor.chain().focus().undo().run()
        },
        {
            icon: 'ri:arrow-go-forward-line',
            title: '重做',
            action: (editor) => editor.chain().focus().redo().run()
        }
    ]
}
