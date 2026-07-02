import Heading from '@tiptap/extension-heading'

import type { EditorPlugin } from './types'

import HeadingSelect from '../commands/headingSelect.vue'

export const headingPlugin: EditorPlugin = {
    name: 'heading',
    extensions: [Heading.configure({ levels: [1, 2, 3] })],
    toolbar: [
        {
            type: 'component',
            render: (editor) => <HeadingSelect editor={editor} />
        }
    ]
}
