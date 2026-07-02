<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'

import ArrowDownSLine from '@/assets/icons/ri--arrow-down-s-line.svg'
import H1Icon from '@/assets/icons/ri--h1.svg'
import H2Icon from '@/assets/icons/ri--h2.svg'
import H3Icon from '@/assets/icons/ri--h3.svg'

const props = defineProps<{ editor: Editor }>()

const items = [
    { level: 1, icon: H1Icon, label: '标题 1' },
    { level: 2, icon: H2Icon, label: '标题 2' },
    { level: 3, icon: H3Icon, label: '标题 3' }
] as const

const activeLevel = computed(() => {
    for (const item of items) {
        if (props.editor.isActive('heading', { level: item.level })) return item.level
    }
    return null
})

const activeIcon = computed(() => items.find((i) => i.level === activeLevel.value)?.icon ?? H1Icon)

const toggle = (level: (typeof items)[number]['level']) => {
    props.editor.chain().focus().toggleHeading({ level }).run()
}
</script>

<template>
    <a-dropdown :trigger="['hover']" placement="bottomLeft">
        <div :class="['toolbar-btn', { active: activeLevel !== null }]">
            <component :is="activeIcon"></component>
            <ArrowDownSLine class="ml-1px"></ArrowDownSLine>
        </div>
        <template #popupRender>
            <a-menu>
                <a-menu-item
                    v-for="item in items"
                    :key="`${item.level}`"
                    @click="toggle(item.level)"
                >
                    <div :class="['heading-item', { active: activeLevel === item.level }]">
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
    @apply ml-8px cursor-pointer h-32px px-6px flex-center rounded-6px transition-base flex-shrink-0 gap-2px;
    @apply text-text hover:bg-ant-primary-bg hover:text-primary;

    &.active {
        @apply bg-ant-primary-bg text-primary;
    }
}

.heading-item {
    @apply flex items-center gap-8px px-4px py-2px min-w-100px text-text;
    &.active {
        @apply text-primary;
    }
}
</style>
