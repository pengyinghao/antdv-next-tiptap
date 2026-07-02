<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'

import LayoutGridLine from '@/assets/icons/ri--layout-grid-line.svg'

const props = defineProps<{ editor?: Editor }>()

const GRID_SIZE = 10

const open = ref(false)
const selRows = ref(0)
const selCols = ref(0)

const onHover = (row: number, col: number) => {
    selRows.value = row
    selCols.value = col
}

const onLeave = () => {
    selRows.value = 0
    selCols.value = 0
}

const closeGrid = () => {
    open.value = false
    selRows.value = 0
    selCols.value = 0
}

const onCreate = () => {
    if (!props.editor || !selRows.value || !selCols.value) return
    props.editor.commands.insertTable({
        rows: selRows.value,
        cols: selCols.value,
        withHeaderRow: true
    })
    closeGrid()
}
</script>

<template>
    <a-popover
        v-model:open="open"
        placement="bottom"
        trigger="click"
        :arrow="false"
        @open-change="(v: boolean) => !v && closeGrid()"
    >
        <template #content>
            <div class="table-grid-selector" @mouseleave="onLeave">
                <div v-for="row in GRID_SIZE" :key="row" class="grid-row">
                    <div
                        v-for="col in GRID_SIZE"
                        :key="col"
                        class="grid-cell"
                        :class="{ selected: row <= selRows && col <= selCols }"
                        @mouseover="onHover(row, col)"
                        @click="onCreate"
                    />
                </div>
                <div class="grid-label">{{ selRows || '-' }} × {{ selCols || '-' }}</div>
            </div>
        </template>
        <div title="插入表格" class="toolbar-btn">
            <LayoutGridLine></LayoutGridLine>
        </div>
    </a-popover>
</template>

<style lang="scss" scoped>
.toolbar-btn {
    @apply cursor-pointer w-32px h-32px flex-center rounded-6px transition-base flex-shrink-0;
    @apply hover:bg-ant-primary-bg hover:c-ant-primary;
}

.table-grid-selector {
    @apply p-8px select-none;

    .grid-row {
        @apply flex gap-2px mb-2px;
    }

    .grid-cell {
        @apply w-16px h-16px rounded-2px cursor-pointer transition-base;
        background: var(--ant-color-bg-container);
        border: 1px solid var(--ant-color-border-secondary);

        &.selected {
            @apply bg-ant-primary-bg border-ant-primary;
        }
    }

    .grid-label {
        @apply text-center text-12px text-text-secondary mt-6px;
    }
}
</style>
