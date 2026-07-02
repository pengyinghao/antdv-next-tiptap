import OrderedList from '@tiptap/extension-ordered-list'

import type { EditorPlugin } from './types'

export const orderedListPlugin: EditorPlugin = {
    name: 'orderedList',
    extensions: [OrderedList]
}
