import Document from '@tiptap/extension-document'
import HardBreak from '@tiptap/extension-hard-break'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { Dropcursor, Gapcursor } from '@tiptap/extensions'

import type { TiptapPlugin } from './types'

export const basePlugin: TiptapPlugin = {
    extensions: [Document, Paragraph, Text, HardBreak, Dropcursor, Gapcursor]
}
