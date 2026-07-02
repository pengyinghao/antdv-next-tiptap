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

    fontFamilyPlugin,
    fontSizePlugin,

    headingPlugin,

    boldPlugin,
    italicPlugin,
    underlinePlugin,
    strikePlugin,

    colorPlugin,
    highlightPlugin,

    linkPlugin,

    textAlignPlugin,

    bulletListPlugin,
    orderedListPlugin,
    taskListPlugin,
    listToolbarPlugin,

    blockquotePlugin,
    codePlugin,
    codeBlockPlugin,
    horizontalRulePlugin,

    imagePlugin,
    videoPlugin,

    tablePlugin,

    clearFormatPlugin,
    undoRedoPlugin,

    printPlugin,
    fullscreenPlugin
]
