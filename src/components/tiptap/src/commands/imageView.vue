<script lang="ts" setup>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'

import AlignCenterIcon from '@/assets/icons/ri--align-center.svg'
import AlignJustifyIcon from '@/assets/icons/ri--align-justify.svg'
import AlignLeftIcon from '@/assets/icons/ri--align-left.svg'
import AlignRightIcon from '@/assets/icons/ri--align-right.svg'
import DeleteBinLine from '@/assets/icons/ri--delete-bin-line.svg'
import PencilLineIcon from '@/assets/icons/ri--pencil-line.svg'

import { editableKey } from '../injectionKeys'
import ImageModal, { type ImageFormData } from './imageModal.vue'

const props = defineProps(nodeViewProps)

const modalOpen = ref(false)

const initialValues = computed<Partial<ImageFormData>>(() => ({
    src: props.node.attrs.src ?? '',
    alt: props.node.attrs.alt ?? '',
    width: props.node.attrs.width ?? null,
    height: props.node.attrs.height ?? null
}))

const handleConfirm = (data: ImageFormData) => {
    props.updateAttributes({
        src: data.src,
        alt: data.alt || null,
        width: data.width || null,
        height: data.height || null
    })
}

const displayModes = [
    { key: 'block', icon: AlignJustifyIcon, label: '独行' },
    { key: 'inline', icon: AlignCenterIcon, label: '行内' },
    { key: 'left', icon: AlignLeftIcon, label: '左浮动' },
    { key: 'right', icon: AlignRightIcon, label: '右浮动' }
]

const viewClass = computed(() => {
    const display = props.node.attrs.display ?? 'inline'
    return ['image-view', `image-view--${display}`]
})

const imageStyle = computed(() => {
    const { width, height } = props.node.attrs
    return {
        ...(width ? { width: `${width}px` } : {}),
        ...(height ? { height: `${height}px` } : {})
    }
})
const editable = inject(editableKey)
</script>

<template>
    <NodeViewWrapper as="span" :class="viewClass">
        <a-popover trigger="click" :arrow="false">
            <template #content v-if="editable">
                <div class="image-toolbar">
                    <a-tooltip
                        v-for="mode in displayModes"
                        :key="mode.key"
                        :title="mode.label"
                        placement="top"
                    >
                        <div
                            class="image-toolbar__btn"
                            :class="{
                                'image-toolbar__btn--active':
                                    (node.attrs.display ?? 'inline') === mode.key
                            }"
                            @click.stop="updateAttributes({ display: mode.key })"
                        >
                            <component :is="mode.icon"></component>
                        </div>
                    </a-tooltip>

                    <div class="image-toolbar__divider" />
                    <a-tooltip title="编辑" placement="top">
                        <div class="image-toolbar__btn" @click.stop="modalOpen = true">
                            <PencilLineIcon></PencilLineIcon>
                        </div>
                    </a-tooltip>
                    <div class="image-toolbar__divider" />
                    <a-tooltip title="删除" placement="top">
                        <div
                            class="image-toolbar__btn image-toolbar__btn--danger"
                            @click.stop="deleteNode()"
                        >
                            <DeleteBinLine></DeleteBinLine>
                        </div>
                    </a-tooltip>
                </div>
            </template>
            <div class="image-view__body" :class="{ selected }">
                <img
                    :src="node.attrs.src"
                    :alt="node.attrs.alt ?? undefined"
                    :style="imageStyle"
                    :draggable="false"
                />
            </div>
        </a-popover>
    </NodeViewWrapper>

    <ImageModal
        v-model:open="modalOpen"
        title="编辑图片"
        :initial-values="initialValues"
        @confirm="handleConfirm"
    />
</template>

<style lang="scss" scoped>
.image-view {
    @apply leading-0;

    &--inline {
        @apply inline-block my-4px;
    }

    &--block {
        @apply block my-8px;
        text-align: center;
    }

    &--left {
        float: left;
        @apply inline-block my-4px mr-8px;
    }

    &--right {
        float: right;
        @apply inline-block my-4px ml-8px;
    }

    &__body {
        @apply inline-block leading-0 cursor-pointer;

        :deep(img) {
            @apply max-w-full align-bottom box-border;
        }
    }
}

.image-toolbar {
    @apply flex items-center gap-2px;

    &__btn {
        @apply cursor-pointer w-32px h-32px flex-center rounded-6px transition-base flex-shrink-0;
        @apply text-text hover:bg-ant-primary-bg hover:text-primary;

        &--active {
            @apply bg-ant-primary-bg text-primary;
        }

        &--danger {
            @apply hover:bg-ant-error-bg hover:text-error;
        }
    }

    &__divider {
        @apply w-1px h-16px bg-ant-border-secondary mx-2px flex-shrink-0;
    }
}
</style>
