<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'

import { ref } from 'vue'

import ImageLineIcon from '@/assets/icons/ri--image-line.svg'

import ImageModal, { type ImageFormData } from './imageModal.vue'

const props = defineProps<{ editor?: Editor }>()

const modalOpen = ref(false)

const insertUploadArea = () => {
    props.editor?.chain().focus().insertImageUpload().run()
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
    <a-dropdown :trigger="['click']" placement="bottomLeft">
        <div class="toolbar-btn">
            <ImageLineIcon />
        </div>
        <template #popupRender>
            <a-menu>
                <a-menu-item key="url" @click="modalOpen = true">插入图片地址</a-menu-item>
                <a-menu-item key="local" @click="insertUploadArea">本地上传</a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>

    <ImageModal v-model:open="modalOpen" title="插入图片" @confirm="handleConfirm" />
</template>

<style lang="scss" scoped>
.toolbar-btn {
    @apply cursor-pointer w-32px h-32px flex-center rounded-6px transition-base flex-shrink-0;
    @apply hover:bg-ant-primary-bg hover:c-primary;
}
</style>
