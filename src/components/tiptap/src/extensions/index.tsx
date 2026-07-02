import type { EditorPlugin } from './types'

import ListSelect from '../commands/listSelect.vue'
import { basePlugin } from './base'
import { blockquotePlugin } from './blockquote'
import { boldPlugin } from './bold'
import { bulletListPlugin } from './bulletList'
import { clearFormatPlugin } from './clearFormat'
import { codePlugin } from './code'
import { codeBlockPlugin } from './codeBlock'
import { colorPlugin } from './color.tsx'
import { fontFamilyPlugin } from './fontFamily.tsx'
import { fontSizePlugin } from './fontSize.tsx'
import { fullscreenPlugin } from './fullscreen'
import { headingPlugin } from './heading.tsx'
import { highlightPlugin } from './highlight.tsx'
import { horizontalRulePlugin } from './horizontalRule'
import { imagePlugin } from './image.tsx'
import { italicPlugin } from './italic'
import { linkPlugin } from './link.tsx'
import { orderedListPlugin } from './orderedList'
import { printPlugin } from './print'
import { strikePlugin } from './strike'
import { tablePlugin } from './table.tsx'
import { taskListPlugin } from './taskList'
import { textAlignPlugin } from './textAlign'
import { textStylePlugin } from './textStyle'
import { underlinePlugin } from './underline'
import { undoRedoPlugin } from './undoRedo'
import { videoPlugin } from './video'

export type { EditorPlugin, ToolbarItem, ToolbarButton, ToolbarComponent } from './types'

// 列表合并 dropdown toolbar（不注册额外 extension，只提供工具栏入口）
const listToolbarPlugin: EditorPlugin = {
    name: 'list',
    extensions: [],
    toolbar: [
        { divider: true },
        {
            type: 'component',
            render: (editor) => <ListSelect editor={editor} />
        }
    ]
}

export const defaultPlugins: EditorPlugin[] = [
    basePlugin,
    textStylePlugin,
    // 字体
    fontFamilyPlugin,
    // 字体大小
    fontSizePlugin,
    // 字体格式化
    headingPlugin,
    // 加粗
    boldPlugin,
    // 斜体
    italicPlugin,
    // 下划线
    underlinePlugin,
    // 删除线
    strikePlugin,

    // 文本颜色
    colorPlugin,
    // 文本背景色
    highlightPlugin,
    // 连接
    linkPlugin,

    // 文本对齐方式
    textAlignPlugin,

    // 有序、无序、任务 列表
    bulletListPlugin,
    orderedListPlugin,
    taskListPlugin,
    listToolbarPlugin,

    // 引用
    blockquotePlugin,
    // 行内代码
    codePlugin,
    // 代码块
    codeBlockPlugin,
    // 分割线
    horizontalRulePlugin,

    // 图片上传
    imagePlugin,
    // 视频上传
    videoPlugin,

    // 插入表格
    tablePlugin,

    // 清除格式
    clearFormatPlugin,
    // 撤销、重做
    undoRedoPlugin,

    // 打印
    printPlugin,
    // 全屏、退出全屏
    fullscreenPlugin
]
