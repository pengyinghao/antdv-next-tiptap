<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'

import { isTextSelection } from '@tiptap/core'
import { BubbleMenu } from '@tiptap/vue-3/menus'

import BoldIcon from '@/assets/icons/ri--bold.svg'
import FontColorIcon from '@/assets/icons/ri--font-color.svg'
import ItalicIcon from '@/assets/icons/ri--italic.svg'
import PaintFillIcon from '@/assets/icons/ri--paint-fill.svg'
import StrikethroughIcon from '@/assets/icons/ri--strikethrough.svg'
import UnderlineIcon from '@/assets/icons/ri--underline.svg'

import ColorButton from './colorButton.vue'

const props = defineProps<{ editor: Editor }>()

const hasExt = (name: string) =>
    props.editor.extensionManager.extensions.some((e) => e.name === name)

const showColor = computed(() => hasExt('color'))
const showHighlight = computed(() => hasExt('highlight'))

const buttons = [
    {
        icon: BoldIcon,
        title: '加粗',
        action: () => props.editor.chain().focus().toggleBold().run(),
        isActive: () => props.editor.isActive('bold'),
        ext: 'bold'
    },
    {
        icon: ItalicIcon,
        title: '斜体',
        action: () => props.editor.chain().focus().toggleItalic().run(),
        isActive: () => props.editor.isActive('italic'),
        ext: 'italic'
    },
    {
        icon: UnderlineIcon,
        title: '下划线',
        action: () => props.editor.chain().focus().toggleUnderline().run(),
        isActive: () => props.editor.isActive('underline'),
        ext: 'underline'
    },
    {
        icon: StrikethroughIcon,
        title: '删除线',
        action: () => props.editor.chain().focus().toggleStrike().run(),
        isActive: () => props.editor.isActive('strike'),
        ext: 'strike'
    }
]

const visibleButtons = computed(() => buttons.filter((b) => hasExt(b.ext)))

const showDivider = computed(
    () => visibleButtons.value.length > 0 && (showColor.value || showHighlight.value)
)

const applyColor = (color: string) =>
    color
        ? props.editor.chain().focus().setColor(color).run()
        : props.editor.chain().focus().unsetColor().run()

const applyHighlight = (color: string) =>
    color
        ? props.editor.chain().focus().setHighlight({ color }).run()
        : props.editor.chain().focus().unsetHighlight().run()

const shouldShow = ({ state, view }: { state: any; view: any }) => {
    const { selection } = state
    if (!view.hasFocus() || selection.empty) return false
    if (!isTextSelection(selection)) return false
    if (props.editor.isActive('codeBlock')) return false
    return true
}

const getColor = (type: 'textStyle' | 'highlight', defaultColor: string = '#000') => {
    return props.editor.getAttributes(type).color ?? defaultColor
}
</script>

<template>
    <BubbleMenu
        :editor="editor"
        :should-show="shouldShow"
        :tippy-options="{ duration: 100, placement: 'top' }"
    >
        <div class="text-bubble-menu">
            <template v-for="btn in visibleButtons" :key="btn.icon">
                <a-tooltip :title="btn.title" placement="top">
                    <div
                        class="bubble-btn"
                        :class="{ 'bubble-btn--active': btn.isActive() }"
                        @click="btn.action()"
                    >
                        <component :is="btn.icon"></component>
                    </div>
                </a-tooltip>
            </template>
            <div v-if="showDivider" class="bubble-divider" />
            <ColorButton
                v-if="showColor"
                :editor="editor"
                :icon="FontColorIcon"
                title="文字颜色"
                :get-color="() => getColor('textStyle')"
                :apply="applyColor"
            />
            <ColorButton
                v-if="showHighlight"
                :editor="editor"
                :icon="PaintFillIcon"
                title="背景颜色"
                :get-color="() => getColor('highlight', '#fff')"
                :apply="applyHighlight"
            />
        </div>
    </BubbleMenu>
</template>

<style lang="scss" scoped>
.text-bubble-menu {
    @apply flex items-center gap-2px px-6px py-4px rounded-8px shadow-md bg-ant-elevated;
    border: 1px solid var(--ant-color-border-secondary);
}

.bubble-btn {
    @apply cursor-pointer w-32px h-32px flex-center rounded-6px transition-base flex-shrink-0;
    @apply text-text hover:bg-ant-primary-bg hover:text-primary;

    &--active {
        @apply bg-ant-primary-bg text-primary;
    }
}

.bubble-divider {
    @apply w-1px h-16px mx-2px self-center bg-ant-border-secondary flex-shrink-0;
}
</style>
