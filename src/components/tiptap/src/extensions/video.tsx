import type { EditorPlugin } from './types'

import VideoButton from '../commands/videoButton.vue'
import { VideoNode } from './videoNode'
import { videoUploadPlugin } from './videoUpload'

export const videoPlugin: EditorPlugin = {
    name: 'video',
    extensions: [VideoNode, videoUploadPlugin],
    toolbar: [
        {
            type: 'component',
            render: (editor) => <VideoButton editor={editor} />
        }
    ]
}
