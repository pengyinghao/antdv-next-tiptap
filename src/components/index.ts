import type { App } from 'vue'

import { version } from '../../package.json'
export * from './tiptap'
import Tiptap from './tiptap/src/tiptap.vue'

export default {
    install(app: App) {
        app.component('AEditor', Tiptap)
    },
    version
}
