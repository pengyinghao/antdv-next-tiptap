<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'

import { inject, ref } from 'vue'

import Icon from '@/components/icon/icon.vue'

import { uploadVideoKey } from '../injectionKeys'
import VideoModal, { type VideoFormData } from './videoModal.vue'

const props = defineProps<{ editor?: Editor }>()

const uploadVideo = inject(uploadVideoKey, undefined)

const fileInputRef = ref<HTMLInputElement>()
const modalOpen = ref(false)
const uploading = ref(false)
const progress = ref(0)

const handleOpen = () => {
    if (uploading.value) return
    modalOpen.value = true
}

const handleConfirm = (data: VideoFormData) => {
    if (!props.editor) return
    props.editor
        .chain()
        .focus()
        .setNativeVideo({ ...data })
        .run()
}

const triggerFileInput = () => {
    if (uploading.value) return
    fileInputRef.value?.click()
}

const handleFileChange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file || !props.editor || !uploadVideo) return
    const editor = props.editor

    uploading.value = true
    progress.value = 0

    uploadVideo(file, (percent) => {
        progress.value = percent
    })
        .then((src) => {
            editor.chain().focus().setNativeVideo({ src }).run()
        })
        .finally(() => {
            uploading.value = false
            progress.value = 0
        })

    ;(e.target as HTMLInputElement).value = ''
}
</script>

<template>
    <template v-if="uploadVideo">
        <a-dropdown :trigger="['click']" placement="bottomLeft" :disabled="uploading">
            <a-tooltip
                :title="uploading ? `上传中 ${progress}%` : '插入视频'"
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
                    <Icon v-else name="ri:video-line" size="16" />
                </div>
            </a-tooltip>
            <template #popupRender>
                <a-menu>
                    <a-menu-item key="url-video" @click="handleOpen">插入视频地址</a-menu-item>
                    <a-menu-item key="local-video" @click="triggerFileInput">本地上传</a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>
    </template>
    <template v-else>
        <div title="插入视频" class="toolbar-btn" @click="handleOpen">
            <Icon name="ri:video-line" size="16" />
        </div>
    </template>

    <input
        ref="fileInputRef"
        type="file"
        accept="video/*"
        style="display: none"
        @change="handleFileChange"
    />

    <VideoModal v-model:open="modalOpen" title="插入视频" @confirm="handleConfirm" />
</template>

<style lang="scss" scoped>
.toolbar-btn {
    @apply cursor-pointer w-32px h-32px flex-center rounded-6px transition-base flex-shrink-0;
    @apply text-text hover:bg-ant-primary-bg hover:text-primary;

    &.is-uploading {
        @apply cursor-not-allowed opacity-80;
    }
}
</style>
