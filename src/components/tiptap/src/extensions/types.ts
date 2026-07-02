import type { AnyExtension, Editor } from '@tiptap/vue-3'
import type { VNode } from 'vue'

import type { PluginName } from '../tiptapProps'

export interface ToolbarButton {
    /** 图标 */
    icon: string
    /** 标题 */
    title: string
    /** 图标大小(默认16) */
    size?: string | number
    /** 按钮执行的方法 */
    action: (editor: Editor) => void
    /** 当前扩展是否被激活 */
    isActive?: (editor: Editor) => boolean
    /** 是否禁用 */
    isDisabled?: (editor: Editor) => boolean
}

export interface ToolbarComponent {
    type: 'component'
    /** 自定义渲染 */
    render: (editor: Editor) => VNode
}

export type ToolbarItem = { divider: true } | ToolbarButton | ToolbarComponent

export interface EditorPlugin {
    /** 插件唯一标识，用于 disabledPlugins 过滤 */
    name?: PluginName
    extensions: AnyExtension[]
    toolbar?: ToolbarItem[]
}
