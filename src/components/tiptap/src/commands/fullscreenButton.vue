<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'

import { onMounted, onUnmounted, ref } from 'vue'

import Icon from '@/components/icon/icon.vue'

const props = defineProps<{ editor: Editor }>()

const isFullscreen = ref(false)

const toggle = () => {
    const el = props.editor.view.dom.closest('.editor') as HTMLElement | null
    if (!el) return
    if (!document.fullscreenElement) {
        el.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
}

const onFullscreenChange = () => {
    isFullscreen.value = !!document.fullscreenElement
}

onMounted(() => document.addEventListener('fullscreenchange', onFullscreenChange))
onUnmounted(() => document.removeEventListener('fullscreenchange', onFullscreenChange))
</script>

<template>
    <a-tooltip :title="isFullscreen ? '退出全屏' : '全屏'" placement="bottom">
        <div class="toolbar-btn" @click="toggle">
            <Icon
                :name="isFullscreen ? 'ri:fullscreen-exit-line' : 'ri:fullscreen-line'"
                size="16"
            />
        </div>
    </a-tooltip>
</template>

<style lang="scss" scoped>
.toolbar-btn {
    @apply cursor-pointer w-32px h-32px flex-center rounded-6px transition-base flex-shrink-0;
    @apply text-text hover:bg-ant-primary-bg hover:text-primary;
}
</style>
