import type { TiptapPlugin } from './types'

import FullscreenButton from '../commands/fullscreenButton.vue'

export const fullscreenPlugin: TiptapPlugin = {
    name: 'fullscreen',
    extensions: [],
    toolbar: [
        {
            type: 'component',
            render: (editor) => <FullscreenButton editor={editor} />
        }
    ]
}
