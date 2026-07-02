<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{ editor?: Editor }>()

/** 字号选项 - 从12px到48px的常用字号 */
const SIZE_OPTIONS = ['12', '14', '16', '18', '20', '24', '28', '32', '36', '48'].map((s) => ({
    label: s,
    value: `${s}px`
}))

const currentSize = computed(() =>
    props.editor
        ? ((props.editor.getAttributes('textStyle').fontSize as string | undefined) ?? undefined)
        : undefined
)

const applySize = (value: string | undefined) => {
    if (!props.editor) return
    if (!value) {
        props.editor.chain().focus().unsetFontSize().run()
    } else {
        props.editor.chain().focus().setFontSize(value).run()
    }
}
</script>

<template>
    <a-select
        size="small"
        :value="currentSize"
        :options="SIZE_OPTIONS"
        placeholder="字号"
        style="width: 72px"
        allow-clear
        @change="applySize"
    />
</template>
