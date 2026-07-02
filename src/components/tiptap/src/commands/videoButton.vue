<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'

import { ref } from 'vue'

import VideoLineIcon from '@/assets/icons/ri--video-line.svg'

import VideoModal, { type VideoFormData } from './videoModal.vue'

const props = defineProps<{ editor?: Editor }>()

const modalOpen = ref(false)

const insertUploadArea = () => {
    props.editor?.chain().focus().insertVideoUpload().run()
}

const handleConfirm = (data: VideoFormData) => {
    if (!props.editor) return
    props.editor
        .chain()
        .focus()
        .setNativeVideo({ ...data })
        .run()
}
</script>

<template>
    <a-dropdown :trigger="['click']" placement="bottomLeft">
        <div class="toolbar-btn">
            <VideoLineIcon />
        </div>
        <template #popupRender>
            <a-menu>
                <a-menu-item key="url" @click="modalOpen = true">插入视频地址</a-menu-item>
                <a-menu-item key="local" @click="insertUploadArea">本地上传</a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>

    <VideoModal v-model:open="modalOpen" title="插入视频" @confirm="handleConfirm" />
</template>

<style lang="scss" scoped>
.toolbar-btn {
    @apply cursor-pointer w-32px h-32px flex-center rounded-6px transition-base flex-shrink-0;
    @apply hover:bg-ant-primary-bg hover:c-ant-primary;
}
</style>
