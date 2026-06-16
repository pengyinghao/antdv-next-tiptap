<script lang="ts" setup>
import { reactive, watch } from 'vue'

import type { VideoAttrs } from '../extensions/videoNode'

export type VideoFormData = Omit<VideoAttrs, 'src'> & { src: string }

const props = defineProps<{
    title: string
    initialValues?: Partial<VideoFormData>
}>()

const open = defineModel<boolean>('open', { required: true })
const emit = defineEmits<{ confirm: [data: VideoFormData] }>()

const form = reactive<VideoFormData>({
    src: '',
    width: null,
    height: null,
    controls: true,
    autoplay: false,
    muted: false,
    loop: false
})

watch(open, (val) => {
    if (!val) return
    form.src = props.initialValues?.src ?? ''
    form.width = props.initialValues?.width ?? null
    form.height = props.initialValues?.height ?? null
    form.controls = props.initialValues?.controls ?? true
    form.autoplay = props.initialValues?.autoplay ?? false
    form.muted = props.initialValues?.muted ?? false
    form.loop = props.initialValues?.loop ?? false
})

const handleConfirm = () => {
    if (!form.src.trim()) return
    emit('confirm', { ...form, src: form.src.trim() })
    open.value = false
}

const handleAutoPlayChange = (value: boolean) => {
    if (value) {
        form.muted = true
    }
}
</script>

<template>
    <a-modal v-model:open="open" :title="title" width="480px" :z-index="9999">
        <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" class="form">
            <a-form-item label="视频地址">
                <a-input
                    v-model:value="form.src"
                    placeholder="请输入视频文件直链（MP4、WebM 等）"
                    allow-clear
                    @press-enter="handleConfirm"
                />
            </a-form-item>
            <a-form-item label="宽度">
                <a-input v-model:value="form.width" placeholder="如 100% 或 640" allow-clear />
            </a-form-item>
            <a-form-item label="高度">
                <a-input v-model:value="form.height" placeholder="如 360" allow-clear />
            </a-form-item>
            <a-form-item label="播放控件">
                <a-switch v-model:checked="form.controls" />
            </a-form-item>
            <a-form-item label="自动播放">
                <a-switch v-model:checked="form.autoplay" @change="handleAutoPlayChange" />
                <span v-if="form.autoplay" class="tip">自动播放需同时开启静音</span>
            </a-form-item>
            <a-form-item label="静音播放">
                <a-switch v-model:checked="form.muted" />
            </a-form-item>
            <a-form-item label="循环播放">
                <a-switch v-model:checked="form.loop" />
            </a-form-item>
        </a-form>
        <template #footer>
            <a-button @click="open = false">取消</a-button>
            <a-button type="primary" @click="handleConfirm">确定</a-button>
        </template>
    </a-modal>
</template>

<style lang="scss" scoped>
.form {
    @apply pt-16px pb-8px;
}

.tip {
    @apply ml-8px text-12px text-warning;
}
</style>
