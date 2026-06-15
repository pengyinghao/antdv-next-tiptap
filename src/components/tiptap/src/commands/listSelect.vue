<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'

import Icon from '@/components/icon/icon.vue'

const props = defineProps<{ editor: Editor }>()

const items = [
    {
        key: 'bulletList',
        icon: 'ri:list-unordered',
        label: '无序列表',
        action: (e: Editor) => e.chain().focus().toggleBulletList().run()
    },
    {
        key: 'orderedList',
        icon: 'ri:list-ordered',
        label: '有序列表',
        action: (e: Editor) => e.chain().focus().toggleOrderedList().run()
    },
    {
        key: 'taskList',
        icon: 'ri:list-check-2',
        label: '任务列表',
        action: (e: Editor) => e.chain().focus().toggleTaskList().run()
    }
]

const activeKey = computed(() => items.find((i) => props.editor.isActive(i.key))?.key ?? null)
const activeIcon = computed(
    () => items.find((i) => i.key === activeKey.value)?.icon ?? 'ri:list-unordered'
)
</script>

<template>
    <a-dropdown :trigger="['hover']" placement="bottomLeft">
        <div :class="['toolbar-btn', { active: activeKey !== null }]">
            <Icon :name="activeIcon" size="16" />
            <Icon name="ri:arrow-down-s-line" size="10" class="ml-1px" />
        </div>
        <template #popupRender>
            <a-menu>
                <a-menu-item v-for="item in items" :key="item.key" @click="item.action(editor)">
                    <div :class="['list-item', { active: activeKey === item.key }]">
                        <Icon :name="item.icon" size="16" />
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
