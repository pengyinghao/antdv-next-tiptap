<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'

import ArrowDownSLine from '@/assets/icons/ri--arrow-down-s-line.svg'
import ListCheck2Icon from '@/assets/icons/ri--list-check-2.svg'
import ListOrderedIcon from '@/assets/icons/ri--list-ordered.svg'
import ListUnorderedIcon from '@/assets/icons/ri--list-unordered.svg'

const props = defineProps<{ editor: Editor }>()

const items = [
    {
        key: 'bulletList',
        icon: ListUnorderedIcon,
        label: '无序列表',
        action: (e: Editor) => e.chain().focus().toggleBulletList().run()
    },
    {
        key: 'orderedList',
        icon: ListOrderedIcon,
        label: '有序列表',
        action: (e: Editor) => e.chain().focus().toggleOrderedList().run()
    },
    {
        key: 'taskList',
        icon: ListCheck2Icon,
        label: '任务列表',
        action: (e: Editor) => e.chain().focus().toggleTaskList().run()
    }
]

const activeKey = computed(() => items.find((i) => props.editor.isActive(i.key))?.key ?? null)
const activeIcon = computed(
    () => items.find((i) => i.key === activeKey.value)?.icon ?? ListUnorderedIcon
)
</script>

<template>
    <a-dropdown :trigger="['hover']" placement="bottomLeft">
        <div :class="['toolbar-btn', { active: activeKey !== null }]">
            <component :is="activeIcon"></component>
            <ArrowDownSLine class="ml-1px"></ArrowDownSLine>
        </div>
        <template #popupRender>
            <a-menu>
                <a-menu-item v-for="item in items" :key="item.key" @click="item.action(editor)">
                    <div :class="['list-item', { active: activeKey === item.key }]">
                        <component :is="item.icon"></component>
                        <span>{{ item.label }}</span>
                    </div>
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
</template>

<style lang="scss" scoped>
.toolbar-btn {
    @apply cursor-pointer h-32px px-6px flex-center rounded-6px transition-base flex-shrink-0 gap-2px;
    @apply text-text hover:bg-ant-primary-bg hover:text-primary;

    &.active {
        @apply bg-ant-primary-bg text-primary;
    }
}

.list-item {
    @apply flex items-center gap-8px px-4px py-2px min-w-100px;
    color: var(--ant-color-text);

    &.active {
        color: var(--ant-color-primary);
    }
}
</style>
