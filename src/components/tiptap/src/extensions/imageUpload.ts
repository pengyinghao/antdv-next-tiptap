/**
 * 图片上传 Tiptap 扩展
 * 用于在编辑器中插入一个图片上传区域节点
 * 用户可以在该区域拖拽或点击上传图片，上传完成后替换为真实图片
 */
import { Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import ImageUploadView from '../commands/imageUploadView.vue'

// 扩展 Tiptap Commands 类型，添加 insertImageUpload 命令
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        imageUpload: {
            insertImageUpload: () => ReturnType
        }
    }
}

/**
 * 图片上传节点配置
 * - group: 'block' 作为块级元素
 * - atom: true 作为原子节点，不包含可编辑内容
 * - selectable: true 可以被选中
 * - draggable: false 不可拖拽移动
 */
const ImageUploadNode = Node.create({
    name: 'imageUpload',
    group: 'block',
    atom: true,
    selectable: true,
    draggable: false,

    // 解析 HTML 时的匹配规则
    parseHTML() {
        return [{ tag: 'div[data-image-upload]' }]
    },

    // 渲染 HTML 时的标签
    renderHTML() {
        return ['div', { 'data-image-upload': '' }]
    },

    // 添加 NodeView 渲染 Vue 组件
    addNodeView() {
        return VueNodeViewRenderer(ImageUploadView)
    },

    // 添加自定义命令
    addCommands() {
        return {
            insertImageUpload:
                () =>
                ({ commands }) =>
                    // 在当前光标位置插入图片上传节点
                    commands.insertContent({ type: this.name })
        }
    }
})

export const imageUploadPlugin = ImageUploadNode
