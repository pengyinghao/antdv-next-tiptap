/**
 * 加粗功能扩展
 * 提供文本加粗格式化和工具栏按钮
 */
import Bold from '@tiptap/extension-bold'

import type { TiptapPlugin } from './types'

export const boldPlugin: TiptapPlugin = {
    name: 'bold',
    extensions: [Bold],
    /**
     * 工具栏配置:
     * - 分隔线: 用于视觉分组
     * - 加粗按钮: 切换文本加粗状态
     */
    toolbar: [
        { divider: true },
        {
            icon: 'ri:bold',
            title: '加粗',                   // 按钮提示文本
            action: (editor) => editor.chain().focus().toggleBold().run(),    // 点击操作
            isActive: (editor) => editor.isActive('bold')  // 判断当前是否激活状态
        }
    ]
}
