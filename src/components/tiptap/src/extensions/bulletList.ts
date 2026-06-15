import { BulletList } from '@tiptap/extension-bullet-list'
import ListItem from '@tiptap/extension-list-item'

import type { TiptapPlugin } from './types'

export const bulletListPlugin: TiptapPlugin = {
    name: 'bulletList',
    extensions: [BulletList, ListItem]
}
