import Heading from '@tiptap/extension-heading'

import type { TiptapPlugin } from './types'

import HeadingSelect from '../commands/headingSelect.vue'

export const headingPlugin: TiptapPlugin = {
    name: 'heading',
    extensions: [Heading.configure({ levels: [1, 2, 3] })],
    toolbar: [
        {
            type: 'component',
            render: (editor) => <HeadingSelect editor={editor} />
        }
    ]
}
