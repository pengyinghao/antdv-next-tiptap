import { TextStyle } from '@tiptap/extension-text-style'

import type { EditorPlugin } from './types'

/**
 * 文本样式功能扩展
 * 提供基础文本样式支持，为字体、颜色等功能提供底层支持
 * 注意：此扩展无工具栏，作为其他样式扩展的基础
 */
export const textStylePlugin: EditorPlugin = {
    extensions: [TextStyle]
}
