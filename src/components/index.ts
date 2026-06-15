import type { App } from 'vue'

import { version } from '../../package.json'
import Tiptap from './tiptap/src/tiptap.vue'

export default {
    install(app: App) {
        app.component('Tiptap', Tiptap)
    },
    version
}

export { Tiptap, version }
export type { TiptapProps } from './tiptap/src/tiptapProps'
