<script lang="ts" setup>
import { Icon as Iconify } from '@iconify/vue'

interface IconProps {
    /** 图标名称 */
    name: string
    /** 图标大小 */
    size?: number | string
    /** 图标颜色 */
    color?: string
}

withDefaults(defineProps<IconProps>(), {
    size: 16,
    color: undefined
})
</script>

<template>
    <iconify :icon="name" :width="size" :height="size" :color="color" v-bind="$attrs"></iconify>
</template>
