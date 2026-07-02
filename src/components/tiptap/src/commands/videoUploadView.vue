<script setup lang="ts">
/**
 * 视频上传 NodeView 组件
 * 当用户在编辑器中点击视频按钮时，会插入一个上传区域
 * 用户可以通过拖拽或点击选择视频文件进行上传
 * 上传完成后，该节点会被替换为真实的视频节点
 */
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { inject, ref } from 'vue'

import DeleteBinLine from '@/assets/icons/ri--delete-bin-line.svg'
import VideoLineIcon from '@/assets/icons/ri--video-line.svg'

import { uploadVideoKey } from '../injectionKeys'

const props = defineProps(nodeViewProps)

// 注入上传函数，如果没有配置则使用 FileReader 转 Base64
const uploadVideo = inject(uploadVideoKey, undefined)

// 上传状态
const uploading = ref(false)
const progress = ref(0)

// 支持的视频格式
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
const ALLOWED_VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.avi', '.mkv']

/**
 * 视频格式校验
 * 在上传前检查文件类型和扩展名
 */
const beforeUpload = (file: File) => {
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type)
    const ext = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
    const isExtAllowed = ALLOWED_VIDEO_EXTENSIONS.includes(ext)

    if (!isVideo && !isExtAllowed) {
        return false
    }
    return true
}

/**
 * 将上传节点替换为真实的视频节点
 * @param src - 视频地址
 */
const replaceWithVideo = (src: string) => {
    const pos = props.getPos()
    if (typeof pos !== 'number' || !props.editor) return
    const videoType = props.editor.state.schema.nodes['video']
    if (!videoType) return
    props.editor.view.dispatch(
        props.editor.state.tr.replaceWith(pos, pos + props.node.nodeSize, videoType.create({ src }))
    )
}

/**
 * 自定义上传处理函数
 * 供 a-upload-dragger 的 custom-request 使用
 */
const handleCustomUpload = ({ file, onProgress, onSuccess, onError }: any) => {
    const f = file as File
    uploading.value = true
    progress.value = 0

    const finish = () => {
        uploading.value = false
    }

    // 如果配置了自定义上传函数则使用，否则使用 Base64
    if (uploadVideo) {
        uploadVideo(f, (pct) => {
            progress.value = pct
            onProgress({ percent: pct })
        })
            .then((src) => {
                onSuccess(src)
                replaceWithVideo(src)
            })
            .catch((err) => {
                onError(err)
                finish()
            })
    } else {
        // 使用 FileReader 读取为 Base64
        const reader = new FileReader()
        reader.onload = (ev) => {
            const src = ev.target!.result as string
            onSuccess(src)
            replaceWithVideo(src)
            finish()
        }
        reader.onerror = () => {
            onError(reader.error)
            finish()
        }
        reader.readAsDataURL(f)
    }
}
</script>

<template>
    <NodeViewWrapper class="video-upload-node" contenteditable="false">
        <div class="upload-wrapper">
            <a-upload-dragger
                :show-upload-list="false"
                accept="video/*"
                :custom-request="handleCustomUpload"
                :before-upload="beforeUpload"
                :disabled="uploading"
                :multiple="false"
            >
                <div class="upload-inner">
                    <div class="upload-icon-wrap">
                        <VideoLineIcon class="file-icon" />
                    </div>
                    <p class="upload-title">点击或拖动文件到此区域上传</p>
                    <p v-if="uploading" class="upload-hint">
                        <a-progress :percent="progress" size="small" />
                    </p>
                    <p v-else class="upload-hint">支持 MP4, WEBM, MOV, AVI, MKV</p>
                </div>
            </a-upload-dragger>
            <!-- 删除按钮 -->
            <div class="upload-toolbar">
                <div class="toolbar-btn" @click.stop="deleteNode()">
                    <DeleteBinLine />
                </div>
            </div>
        </div>
    </NodeViewWrapper>
</template>

<style lang="scss" scoped>
.video-upload-node {
    @apply my-8px;

    :deep(.ant-upload.ant-upload-drag) {
        @apply rounded-8px;
    }
}

.upload-wrapper {
    @apply relative;
}

.upload-toolbar {
    @apply absolute top-0 right-0 flex;
    transform: translate(30%, -30%);

    .toolbar-btn {
        @apply w-24px h-24px flex-center rounded-full bg-white shadow-md cursor-pointer;

        svg {
            @apply w-14px h-14px text-gray hover:c-red;
        }
    }
}

.upload-inner {
    @apply py-24px flex flex-col items-center gap-8px;
}

.upload-icon-wrap {
    @apply w-48px h-48px rounded-full bg-primary flex-center;

    svg {
        @apply w-24px h-24px text-white fill-white;
    }
}

.upload-title {
    @apply m-0 text-14px text-text;
}

.upload-hint {
    @apply m-0 text-12px text-text-secondary min-w-200px;
}
</style>
