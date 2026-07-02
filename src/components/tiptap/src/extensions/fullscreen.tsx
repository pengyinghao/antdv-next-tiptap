import type { EditorPlugin } from './types'

import FullscreenButton from '../commands/fullscreenButton.vue'

export const fullscreenPlugin: EditorPlugin = {
    name: 'fullscreen',
    extensions: [],
    toolbar: [
        {
            type: 'component',
            render: (editor) => <FullscreenButton editor={editor} />
        }
    ]
}
