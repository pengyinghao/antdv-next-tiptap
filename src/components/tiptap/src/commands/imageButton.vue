<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'

import { inject, ref } from 'vue'

import ImageLineIcon from '@/assets/icons/ri--image-line.svg'

import { uploadImageKey } from '../injectionKeys'
import ImageModal, { type ImageFormData } from './imageModal.vue'

const props = defineProps<{ editor?: Editor }>()

const uploadImage = inject(uploadImageKey, undefined)

const fileInputRef = ref<HTMLInputElement>()
const modalOpen = ref(false)
const uploading = ref(false)
const progress = ref(0)

const triggerFileInput = () => {
    if (uploading.value) return
    fileInputRef.value?.click()
}

const handleFileChange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file || !props.editor) return
    const editor = props.editor

    if (uploadImage) {
        uploading.value = true
        progress.value = 0
        uploadImage(file, (percent) => {
            progress.value = percent
        })
            .then((src) => {
                editor.chain().focus().setImage({ src }).run()
            })
            .finally(() => {
                uploading.value = false
                progress.value = 0
            })
    } else {
        const reader = new FileReader()
        reader.onload = (ev) => {
            const src = ev.target?.result as string
            editor.chain().focus().setImage({ src }).run()
        }
        reader.readAsDataURL(file)
    }
    ;(e.target as HTMLInputElement).value = ''
}

const handleConfirm = (data: ImageFormData) => {
    if (!props.editor) return
    props.editor
        .chain()
        .focus()
        .setImage({ src: data.src, alt: data.alt || undefined })
        .run()
}
</script>

<template>
    <a-dropdown :trigger="['click']" placement="bottomLeft" :disabled="uploading">
        <a-tooltip
            :title="uploading ? `上传中 ${progress}%` : '插入图片'"
            :open="uploading ? undefined : false"
            placement="bottom"
        >
            <div class="toolbar-btn" :class="{ 'is-uploading': uploading }">
                <a-progress
                    v-if="uploading"
                    type="circle"
                    :percent="progress"
                    :size="20"
                    :stroke-width="12"
                />
                <ImageLineIcon v-else />
            </div>
        </a-tooltip>
        <template #popupRender>
            <a-menu>
                <a-menu-item key="url" @click="modalOpen = true">插入图片地址</a-menu-item>
                <a-menu-item key="local" @click="triggerFileInput">本地上传</a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>

    <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        style="display: none"
        @change="handleFileChange"
    />

    <ImageModal v-model:open="modalOpen" title="插入图片" @confirm="handleConfirm" />
</template>

<style lang="scss" scoped>
.toolbar-btn {
    @apply cursor-pointer w-32px h-32px flex-center rounded-6px transition-base flex-shrink-0;
    @apply text-ant-text hover:bg-ant-primary-bg hover:text-ant-primary;

    &.is-uploading {
        @apply cursor-not-allowed opacity-80;
    }
}
</style>
