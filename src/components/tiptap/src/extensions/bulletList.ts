import { BulletList } from '@tiptap/extension-bullet-list'
import ListItem from '@tiptap/extension-list-item'

import type { EditorPlugin } from './types'

export const bulletListPlugin: EditorPlugin = {
    name: 'bulletList',
    extensions: [BulletList, ListItem]
}
