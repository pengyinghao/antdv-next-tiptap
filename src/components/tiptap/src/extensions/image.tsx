import Image from '@tiptap/extension-image'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import type { TiptapPlugin } from './types'

import ImageButton from '../commands/imageButton.vue'
import ImageView from '../commands/imageView.vue'

/** 扩展基础 Image，添加 width/height 属性及 NodeView */
const ResizableImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: null,
                parseHTML: (el) => {
                    const w = el.getAttribute('width')
                    return w ? Number(w) : null
                },
                renderHTML: ({ width }) => (width ? { width } : {})
            },
            height: {
                default: null,
                parseHTML: (el) => {
                    const h = el.getAttribute('height')
                    return h ? Number(h) : null
                },
                renderHTML: ({ height }) => (height ? { height } : {})
            },
            display: {
                default: 'inline',
                parseHTML: (el) => {
                    const dp = el.getAttribute('data-display')
                    if (dp && ['inline', 'block', 'left', 'right'].includes(dp)) return dp
                    const { cssFloat, display } = (el as HTMLElement).style
                    if (cssFloat === 'left') return 'left'
                    if (cssFloat === 'right') return 'right'
                    if (display === 'block') return 'block'
                    return 'inline'
                },
                renderHTML: ({ display }) => (display ? { 'data-display': display } : {})
            }
        }
    },
    addNodeView() {
        return VueNodeViewRenderer(ImageView)
    }
})

export const imagePlugin: TiptapPlugin = {
    name: 'image',
    extensions: [ResizableImage.configure({ inline: true, allowBase64: true })],
    toolbar: [
        { divider: true },
        {
            type: 'component',
            render: (editor) => <ImageButton editor={editor} />
        }
    ]
}
