<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'

import type { ToolbarButton, ToolbarComponent } from './extensions/types'

const props = defineProps<{
    item: ToolbarButton | ToolbarComponent
    editor?: Editor
}>()

const isComponent = (i: typeof props.item): i is ToolbarComponent =>
    'type' in i && i.type === 'component'

const isActive = computed(
    () => !isComponent(props.item) && !!props.editor && !!props.item.isActive?.(props.editor)
)
const isDisabled = computed(
    () => !isComponent(props.item) && !!props.editor && !!props.item.isDisabled?.(props.editor)
)

const componentItem = computed(() => {
    return props.item as ToolbarComponent
})

const buttonItem = computed(() => {
    return props.item as ToolbarButton
})
</script>

<template>
    <component v-if="isComponent(item) && editor" :is="() => componentItem.render(editor!)" />
    <a-tooltip v-else-if="!isComponent(item)" :title="buttonItem.title" placement="bottom">
        <div
            :class="['toolbar-btn', { active: isActive, disabled: isDisabled }]"
            @click="!isDisabled && editor && buttonItem.action(editor)"
        >
            <component :is="buttonItem.icon"></component>
        </div>
    </a-tooltip>
</template>

<style lang="scss" scoped>
.toolbar-btn {
    @apply cursor-pointer w-32px h-32px flex-center rounded-6px transition-base flex-shrink-0;
    @apply text-text hover:bg-ant-primary-bg hover:text-primary;

    &.active {
        @apply bg-ant-primary-bg text-primary-text;
    }

    &.disabled {
        @apply opacity-30 cursor-not-allowed pointer-events-none;
    }
}
</style>
