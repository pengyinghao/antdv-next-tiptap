<script lang="ts" setup>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { computed, inject, ref } from 'vue'

import Icon from '@/components/icon/icon.vue'

import type { VideoFormData } from './videoModal.vue'

import { editableKey } from '../injectionKeys'
import VideoModal from './videoModal.vue'

const props = defineProps(nodeViewProps)

const editable = inject(editableKey)
const modalOpen = ref(false)

const initialValues = computed<Partial<VideoFormData>>(() => ({
    src: props.node.attrs.src ?? '',
    width: props.node.attrs.width ?? null,
    height: props.node.attrs.height ?? null,
    controls: props.node.attrs.controls ?? true,
    autoplay: props.node.attrs.autoplay ?? false,
    muted: props.node.attrs.muted ?? false,
    loop: props.node.attrs.loop ?? false
}))

// 纯数字补 px，百分比/带单位字符串直接用
const toSize = (val: string | null) => {
    if (!val) return undefined
    return /^\d+$/.test(val.trim()) ? `${val}px` : val
}

const videoStyle = computed(() => {
    const w = toSize(props.node.attrs.width)
    const h = toSize(props.node.attrs.height)
    if (!w && !h) return { width: '100%', display: 'block' }
    if (w && h) return { width: w, height: h, display: 'block' }
    return {
        ...(w ? { width: w, maxWidth: '100%' } : {}),
        ...(h ? { height: h } : {}),
        display: 'block'
    }
})

const handleConfirm = (data: VideoFormData) => {
    props.updateAttributes({
        src: data.src,
        width: data.width || null,
        height: data.height || null,
        controls: data.controls,
        autoplay: data.autoplay,
        muted: data.muted,
        loop: data.loop
    })
}
</script>

<template>
    <NodeViewWrapper class="video-view">
        <a-popover trigger="hover" :arrow="false" placement="top">
            <template v-if="editable" #content>
                <div class="video-toolbar">
                    <a-tooltip title="编辑" placement="top">
                        <div class="video-toolbar__btn" @click.stop="modalOpen = true">
                            <Icon name="ri:pencil-line" size="14" />
                        </div>
                    </a-tooltip>
                    <div class="video-toolbar__divider" />
                    <a-tooltip title="删除" placement="top">
                        <div
                            class="video-toolbar__btn video-toolbar__btn--danger"
                            @click.stop="deleteNode()"
                        >
                            <Icon name="ri:delete-bin-line" size="14" />
                        </div>
                    </a-tooltip>
                </div>
            </template>

            <div class="video-view__body" :class="{ selected }">
                <video
                    :src="node.attrs.src"
                    :style="videoStyle"
                    :controls="node.attrs.controls"
                    :autoplay="node.attrs.autoplay"
                    :muted="node.attrs.muted"
                    :loop="node.attrs.loop"
                />
            </div>
        </a-popover>

        <VideoModal
            v-model:open="modalOpen"
            title="编辑视频"
            :initial-values="initialValues"
            @confirm="handleConfirm"
        />
    </NodeViewWrapper>
</template>

<style lang="scss">
.video-view {
    @apply block my-8px;

    &__body {
        @apply inline-block cursor-pointer box-border rounded-4px;
        outline: none;

        video {
            @apply block rounded-4px max-w-100%;
        }
    }
}

.video-toolbar {
    @apply flex items-center gap-2px;

    &__btn {
        @apply cursor-pointer w-32px h-32px flex-center rounded-6px transition-base flex-shrink-0;
        @apply text-text hover:bg-ant-primary-bg hover:text-primary;

        &--danger {
            @apply hover:bg-ant-error-bg hover:text-error;
        }
    }

    &__divider {
        @apply w-1px h-16px bg-ant-border-secondary mx-2px flex-shrink-0;
    }
}
</style>
