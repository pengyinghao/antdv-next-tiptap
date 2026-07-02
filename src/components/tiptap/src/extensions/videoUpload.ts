/**
 * 视频上传 Tiptap 扩展
 * 用于在编辑器中插入一个视频上传区域节点
 * 用户可以在该区域拖拽或点击上传视频，上传完成后替换为真实视频
 */
import { Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import VideoUploadView from '../commands/videoUploadView.vue'

// 扩展 Tiptap Commands 类型，添加 insertVideoUpload 命令
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        videoUpload: {
            insertVideoUpload: () => ReturnType
        }
    }
}

/**
 * 视频上传节点配置
 * - group: 'block' 作为块级元素
 * - atom: true 作为原子节点，不包含可编辑内容
 * - selectable: true 可以被选中
 * - draggable: false 不可拖拽移动
 */
const VideoUploadNode = Node.create({
    name: 'videoUpload',
    group: 'block',
    atom: true,
    selectable: true,
    draggable: false,

    // 解析 HTML 时的匹配规则
    parseHTML() {
        return [{ tag: 'div[data-video-upload]' }]
    },

    // 渲染 HTML 时的标签
    renderHTML() {
        return ['div', { 'data-video-upload': '' }]
    },

    // 添加 NodeView 渲染 Vue 组件
    addNodeView() {
        return VueNodeViewRenderer(VideoUploadView)
    },

    // 添加自定义命令
    addCommands() {
        return {
            // 在当前光标位置插入视频上传节点
            insertVideoUpload:
                () =>
                ({ commands }) =>
                    // 在当前光标位置插入视频上传节点
                    commands.insertContent({ type: this.name })
        }
    }
})

export const videoUploadPlugin = VideoUploadNode
