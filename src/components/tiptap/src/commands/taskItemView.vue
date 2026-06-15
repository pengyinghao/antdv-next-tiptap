<script lang="ts" setup>
import type { NodeViewProps } from '@tiptap/core'

import { NodeViewContent, NodeViewWrapper } from '@tiptap/vue-3'
import { computed } from 'vue'

const props = defineProps<NodeViewProps>()

const checked = computed({
    get: () => props.node.attrs.checked as boolean,
    set: (val: boolean) => props.updateAttributes({ checked: val })
})
</script>

<template>
    <NodeViewWrapper as="li" class="task-item">
        <a-checkbox v-model:checked="checked" />
        <NodeViewContent as="span" class="task-content" :class="{ 'is-checked': checked }" />
    </NodeViewWrapper>
</template>

<style lang="scss" scoped>
.task-item {
    @apply flex items-baseline gap-8px;
}

.task-content {
    @apply flex-1;

    &.is-checked {
        @apply line-through opacity-50;
    }
}
</style>
