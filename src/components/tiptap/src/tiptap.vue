<script lang="ts" setup>
import type { EditorView } from '@tiptap/pm/view'

import { CharacterCount } from '@tiptap/extensions/character-count'
import { type Editor, EditorContent, useEditor } from '@tiptap/vue-3'
import { onUnmounted, provide, ref, toRef, watch } from 'vue'

import { useHighlighter } from '@/composables/useHighlight'

import type { TiptapProps } from './tiptapProps'

import TableToolbar from './commands/tableToolbar.vue'
import TextBubbleMenu from './commands/textBubbleMenu.vue'
import { defaultPlugins } from './extensions'
import { editableKey, uploadImageKey, uploadVideoKey } from './injectionKeys'
import ToolbarItem from './toolbarItem.vue'
import './tiptap.scss'

const emit = defineEmits<{
    change: [value: string]
    blur: [value: string]
}>()

defineSlots<{
    'word-count'(props: { count: number; limit: true | number }): unknown
}>()

const modelValue = defineModel('modelValue', { type: String })
const props = withDefaults(defineProps<TiptapProps>(), {
    height: 300,
    editable: true,
    outputFormat: 'html'
})

useHighlighter()

// 仅在传入时注入，避免子组件收到 undefined 的 key
if (props.uploadImage) provide(uploadImageKey, props.uploadImage)
if (props.uploadVideo) provide(uploadVideoKey, props.uploadVideo)
provide(editableKey, toRef(props, 'editable'))

const activePlugins = defaultPlugins.filter(
    (p) => !p.name || !props.disabledPlugins?.includes(p.name)
)
/** table 扩展是否可用 */
const tableEnabled = activePlugins.some((p) => p.name === 'table')

const getOutput = (e: Editor) => {
    if (!e) return ''
    return props.outputFormat === 'json' ? JSON.stringify(e.getJSON()) : e.getHTML()
}

const parseInput = (value: string | undefined) => {
    if (!value) return ''
    if (props.outputFormat === 'json') {
        try {
            return JSON.parse(value)
        } catch {
            return value
        }
    }
    return value
}
const wordCountLimit = typeof props.wordCount === 'number' ? props.wordCount : null

/** 可以用的扩展 */
const extensions = [
    ...activePlugins.flatMap((p) => p.extensions),
    ...(props.wordCount !== undefined ? [CharacterCount.configure({ limit: wordCountLimit })] : [])
]
/** 工具栏 */
const toolbarItems = activePlugins.flatMap((p) => p.toolbar ?? [])

/**
 * 将 File 对象作为图片插入编辑器。
 * 若外部提供了 uploadImage，则上传后取 URL；否则转 base64 直接嵌入。
 */
const insertImageFromFile = (view: EditorView, file: File, pos?: number) => {
    const doInsert = (src: string) => {
        const node = view.state.schema.nodes.image?.create({ src })
        if (!node) return
        const tr =
            pos !== undefined
                ? view.state.tr.insert(pos, node)
                : view.state.tr.replaceSelectionWith(node)
        view.dispatch(tr)
    }
    if (props.uploadImage) {
        props.uploadImage(file, () => {}).then(doInsert)
    } else {
        const reader = new FileReader()
        reader.onload = (e) => doInsert(e.target?.result as string)
        reader.readAsDataURL(file)
    }
}

const editor = useEditor({
    content: parseInput(modelValue.value),
    extensions,
    editable: props.editable,
    editorProps: {
        // 粘贴时拦截图片文件，优先走自定义上传逻辑
        handlePaste(view, event) {
            const imageItem = Array.from(event.clipboardData?.items ?? []).find((i) =>
                i.type.startsWith('image/')
            )
            if (!imageItem) return false
            const file = imageItem.getAsFile()
            if (!file) return false
            event.preventDefault()
            insertImageFromFile(view, file)
            return true
        },
        // 拖拽外部图片文件到编辑器时插入到落点位置；moved=true 表示编辑器内部拖拽，跳过
        handleDrop(view, event, _slice, moved) {
            if (moved) return false
            const imageFile = Array.from(event.dataTransfer?.files ?? []).find((f) =>
                f.type.startsWith('image/')
            )
            if (!imageFile) return false
            event.preventDefault()
            const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos
            insertImageFromFile(view, imageFile, pos)
            return true
        }
    },
    onCreate: ({ editor: e }) => {
        if (props.wordCount !== undefined) {
            charCount.value = e.storage.characterCount?.characters() ?? 0
        }
    },
    onUpdate: (e) => {
        const output = getOutput(e.editor as Editor)
        modelValue.value = output
        emit('change', output)
        if (props.wordCount !== undefined) {
            charCount.value = e.editor.storage.characterCount?.characters() ?? 0
        }
    },
    onBlur: (e) => {
        emit('blur', getOutput(e.editor as Editor))
    }
})

const charCount = ref(0)

onUnmounted(() => editor.value?.destroy())

watch(modelValue, (value) => {
    if (!editor.value) return
    if (getOutput(editor.value) === value) return
    editor.value.commands.setContent(parseInput(value))
})

watch(
    () => props.editable,
    (value) => {
        editor.value?.setEditable(value)
    }
)
</script>

<template>
    <a-app>
        <div class="editor">
            <div class="editor-toolbar">
                <template v-for="(item, i) in toolbarItems" :key="i">
                    <a-divider v-if="'divider' in item" orientation="vertical" />
                    <ToolbarItem v-else-if="editor" :item="item" :editor="editor" />
                </template>
            </div>
            <EditorContent
                :editor="editor"
                class="editor-content"
                :style="{ height: `${props.height}px` }"
            />
            <template v-if="props.wordCount !== undefined">
                <slot name="word-count" :count="charCount" :limit="props.wordCount">
                    <div class="editor-word-count">
                        <span>输入字符数：</span>
                        {{ charCount }}
                        {{ typeof props.wordCount === 'number' ? ` / ${props.wordCount}` : '' }}
                    </div>
                </slot>
            </template>
            <TableToolbar v-if="editor && tableEnabled" :editor="editor" />
            <TextBubbleMenu v-if="editor && props.editable" :editor="editor" />
        </div>
    </a-app>
</template>
