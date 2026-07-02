import Document from '@tiptap/extension-document'
import HardBreak from '@tiptap/extension-hard-break'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { Dropcursor, Gapcursor } from '@tiptap/extensions'

import type { EditorPlugin } from './types'

export const basePlugin: EditorPlugin = {
    extensions: [Document, Paragraph, Text, HardBreak, Dropcursor, Gapcursor]
}
