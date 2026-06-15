import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import VideoView from '../commands/videoView.vue'

export interface VideoAttrs {
    src: string
    /** 宽度 */
    width: string | null
    /** 高度 */
    height: string | null
    /** 是否显示播放控件 */
    controls: boolean
    /** 是否自动播放 */
    autoplay: boolean
    /** 是否静音播放 */
    muted: boolean
    /** 是否循环播放 */
    loop: boolean
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        nativeVideo: {
            setNativeVideo: (
                options: { src: string } & Partial<Omit<VideoAttrs, 'src'>>
            ) => ReturnType
        }
    }
}

const boolAttr = (key: string) => ({
    default: false,
    parseHTML: (el: HTMLElement) => el.hasAttribute(key),
    renderHTML: (attrs: Record<string, unknown>) => (attrs[key] ? { [key]: true } : {})
})

/** 原生 <video> 节点，支持 controls / autoplay / muted / loop / width / height */
export const VideoNode = Node.create({
    name: 'nativeVideo',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            src: { default: null },
            width: { default: null, renderHTML: ({ width }) => (width ? { width } : {}) },
            height: { default: null, renderHTML: ({ height }) => (height ? { height } : {}) },
            controls: { ...boolAttr('controls'), default: true },
            autoplay: boolAttr('autoplay'),
            muted: boolAttr('muted'),
            loop: boolAttr('loop')
        }
    },

    parseHTML() {
        return [{ tag: 'video[src]' }]
    },

    renderHTML({ HTMLAttributes }) {
        return ['video', mergeAttributes(HTMLAttributes)]
    },

    addCommands() {
        return {
            setNativeVideo:
                (options) =>
                ({ commands }) =>
                    commands.insertContent({ type: this.name, attrs: options })
        }
    },

    addNodeView() {
        return VueNodeViewRenderer(VideoView)
    }
})
