<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'

import { BubbleMenu } from '@tiptap/vue-3/menus'
import { onMounted, onUnmounted } from 'vue'

import ArrowDownLineIcon from '@/assets/icons/ri--arrow-down-line.svg'
import ArrowLeftLineICon from '@/assets/icons/ri--arrow-left-line.svg'
import ArrowRightLineIcon from '@/assets/icons/ri--arrow-right-line.svg'
import ArrowUpLineIcon from '@/assets/icons/ri--arrow-up-line.svg'
import DeleteBinLineIcon from '@/assets/icons/ri--delete-bin-line.svg'
import DragMoveLineIcon from '@/assets/icons/ri--drag-move-line.svg'
import FullScreenExitLineIcon from '@/assets/icons/ri--fullscreen-exit-line.svg'
import FullScreenLineIcon from '@/assets/icons/ri--fullscreen-line.svg'
import SubtractLineIcon from '@/assets/icons/ri--subtract-line.svg'

const props = defineProps<{ editor: Editor }>()

const actions = [
    {
        icon: ArrowLeftLineICon,
        title: '向前插入列',
        action: () => props.editor.chain().focus().addColumnBefore().run(),
        isDisabled: () => !props.editor.can().addColumnBefore()
    },
    {
        icon: ArrowRightLineIcon,
        title: '向后插入列',
        action: () => props.editor.chain().focus().addColumnAfter().run(),
        isDisabled: () => !props.editor.can().addColumnAfter()
    },
    {
        icon: SubtractLineIcon,
        title: '删除列',
        action: () => props.editor.chain().focus().deleteColumn().run(),
        isDisabled: () => !props.editor.can().deleteColumn(),
        danger: true
    },
    { divider: true },
    {
        icon: ArrowUpLineIcon,
        title: '向前插入行',
        action: () => props.editor.chain().focus().addRowBefore().run(),
        isDisabled: () => !props.editor.can().addRowBefore()
    },
    {
        icon: ArrowDownLineIcon,
        title: '向后插入行',
        action: () => props.editor.chain().focus().addRowAfter().run(),
        isDisabled: () => !props.editor.can().addRowAfter()
    },
    {
        icon: SubtractLineIcon,
        title: '删除行',
        action: () => props.editor.chain().focus().deleteRow().run(),
        isDisabled: () => !props.editor.can().deleteRow(),
        danger: true,
        rotate: 90
    },
    { divider: true },
    {
        icon: FullScreenExitLineIcon,
        title: '合并单元格',
        action: () => props.editor.chain().focus().mergeCells().run(),
        isDisabled: () => !props.editor.can().mergeCells()
    },
    {
        icon: FullScreenLineIcon,
        title: '拆分单元格',
        action: () => props.editor.chain().focus().splitCell().run(),
        isDisabled: () => !props.editor.can().splitCell()
    },
    { divider: true },
    {
        icon: DeleteBinLineIcon,
        title: '删除表格',
        action: () => props.editor.chain().focus().deleteTable().run(),
        isDisabled: () => !props.editor.can().deleteTable(),
        danger: true
    }
]

// mousedown 时提前判断是否点在单元格外，避免 ProseMirror 表格插件
// 将选区短暂归位到第一单元格导致工具栏闪烁
const clickedInsideCell = ref(false)

const onMousedown = (e: MouseEvent) => {
    clickedInsideCell.value = !!(e.target as HTMLElement).closest('td, th')
}

onMounted(() => document.addEventListener('mousedown', onMousedown))
onUnmounted(() => document.removeEventListener('mousedown', onMousedown))

const shouldShow = ({ state }: { state: any }) => {
    if (!clickedInsideCell.value) return false
    const { $from } = state.selection
    for (let d = $from.depth; d > 0; d--) {
        if ($from.node(d).type.name === 'table') return true
    }
    return false
}

const rowHeight = ref<number | null>(null)

// 光标移动时同步当前行的行高值
watch(
    () => props.editor.state.selection,
    () => {
        const { $from } = props.editor.state.selection
        for (let d = $from.depth; d > 0; d--) {
            const node = $from.node(d)
            if (node.type.name === 'tableRow') {
                const h = node.attrs.height
                rowHeight.value = h ? parseInt(h) : null
                return
            }
        }
        rowHeight.value = null
    }
)

const applyRowHeight = (val: number | null) => {
    const { state, view } = props.editor
    const { $from } = state.selection
    // 找到当前 tableRow 节点的位置
    for (let d = $from.depth; d > 0; d--) {
        const node = $from.node(d)
        if (node.type.name === 'tableRow') {
            const pos = $from.before(d)
            const tr = state.tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                height: val ? `${val}px` : null
            })
            view.dispatch(tr)
            return
        }
    }
}
</script>

<template>
    <BubbleMenu
        v-if="editor"
        :editor="editor"
        :should-show="shouldShow"
        :update-delay="0"
        :tippy-options="{ duration: 0, placement: 'bottom' }"
    >
        <div class="table-toolbar">
            <template v-for="(item, i) in actions" :key="i">
                <div v-if="'divider' in item" class="table-toolbar-divider" />
                <a-tooltip v-else :title="item.title">
                    <span class="table-toolbar-btn-wrap">
                        <button
                            :class="[
                                'table-toolbar-btn',
                                { danger: item.danger, disabled: item.isDisabled() }
                            ]"
                            :disabled="item.isDisabled()"
                            @click="item.action"
                        >
                            <component
                                :is="item.icon"
                                :style="item.rotate ? `transform: rotate(${item.rotate}deg)` : ''"
                            ></component>
                        </button>
                    </span>
                </a-tooltip>
            </template>
            <div class="table-toolbar-divider" />
            <a-tooltip title="设置行高">
                <div class="table-toolbar-row-height">
                    <DragMoveLineIcon class="row-height-icon"></DragMoveLineIcon>
                    <a-input-number
                        :value="rowHeight"
                        :min="20"
                        :max="600"
                        :controls="false"
                        placeholder="行高"
                        size="small"
                        @change="applyRowHeight"
                    />
                </div>
            </a-tooltip>
        </div>
    </BubbleMenu>
</template>

<style lang="scss" scoped>
.table-toolbar {
    @apply flex items-center gap-2px px-6px py-4px rounded-8px shadow-md bg-ant-elevated;
    // @apply border-1p
    border: 1px solid var(--ant-color-border-secondary);

    &-divider {
        @apply w-1px h-16px mx-2px self-center bg-ant-border-secondary;
    }

    &-row-height {
        @apply flex items-center gap-4px px-4px;
        color: var(--ant-color-text-secondary);

        .row-height-icon {
            @apply flex-shrink-0;
        }

        :deep(.ant-input-number) {
            width: 52px;
            height: 22px;
            font-size: 12px;

            .ant-input-number-input {
                height: 22px;
                padding: 0 4px;
                text-align: center;
            }
        }
    }

    &-btn-wrap {
        @apply inline-flex;
    }

    &-btn {
        @apply w-26px h-26px flex-center rounded-4px transition-base cursor-pointer border-none outline-none;
        background: transparent;
        color: var(--ant-color-text);

        &:hover:not(.disabled) {
            background: var(--ant-color-primary-bg);
            color: var(--ant-color-primary);
        }

        &.danger:hover:not(.disabled) {
            background: var(--ant-color-error-bg);
            color: var(--ant-color-error);
        }

        &.disabled {
            @apply opacity-30 cursor-not-allowed;
        }
    }
}
</style>
