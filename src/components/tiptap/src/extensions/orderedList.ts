import OrderedList from '@tiptap/extension-ordered-list'

import type { TiptapPlugin } from './types'

export const orderedListPlugin: TiptapPlugin = {
    name: 'orderedList',
    extensions: [OrderedList]
}
