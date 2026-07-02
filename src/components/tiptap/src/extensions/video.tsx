import type { EditorPlugin } from './types'

import VideoButton from '../commands/videoButton.vue'
import { VideoNode } from './videoNode'

export const videoPlugin: EditorPlugin = {
    name: 'video',
    extensions: [VideoNode],
    toolbar: [
        {
            type: 'component',
            render: (editor) => <VideoButton editor={editor} />
        }
    ]
}
