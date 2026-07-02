<script setup lang="ts">
/**
 * 图片上传 NodeView 组件
 * 当用户在编辑器中点击图片按钮时，会插入一个上传区域
 * 用户可以通过拖拽或点击选择图片文件进行上传
 * 上传完成后，该节点会被替换为真实的图片节点
 */
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { inject, ref } from 'vue'

import DeleteBinLine from '@/assets/icons/ri--delete-bin-line.svg'
import ImageLineIcon from '@/assets/icons/ri--image-line.svg'

import { uploadImageKey } from '../injectionKeys'

const props = defineProps(nodeViewProps)

// 支持的图片格式
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp']

/**
 * 图片格式校验
 * 在上传前检查文件类型和扩展名
 */
const beforeUpload = (file: File) => {
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type)
    const ext = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
    const isExtAllowed = ALLOWED_IMAGE_EXTENSIONS.includes(ext)

    if (!isImage && !isExtAllowed) {
        return false
    }
    return true
}

// 注入上传函数，如果没有配置则使用 FileReader 转 Base64
const uploadImage = inject(uploadImageKey, undefined)

// 上传状态
const uploading = ref(false)
const progress = ref(0)

/**
 * 将上传节点替换为真实的图片节点
 * @param src - 图片地址
 */
const replaceWithImage = (src: string) => {
    const pos = props.getPos()
    if (typeof pos !== 'number' || !props.editor) return
    const imageType = props.editor.state.schema.nodes['image']
    if (!imageType) return
    props.editor.view.dispatch(
        props.editor.state.tr.replaceWith(pos, pos + props.node.nodeSize, imageType.create({ src }))
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
    if (uploadImage) {
        uploadImage(f, (pct) => {
            progress.value = pct
            onProgress({ percent: pct })
        })
            .then((src) => {
                onSuccess(src)
                replaceWithImage(src)
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
            replaceWithImage(src)
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
    <NodeViewWrapper class="image-upload-node" contenteditable="false">
        <div class="upload-wrapper">
            <a-upload-dragger
                :show-upload-list="false"
                accept="image/*"
                :custom-request="handleCustomUpload"
                :before-upload="beforeUpload"
                :disabled="uploading"
                :multiple="false"
            >
                <div class="upload-inner">
                    <div class="upload-icon-wrap">
                        <ImageLineIcon class="file-icon" />
                    </div>
                    <p class="upload-title">点击或拖动文件到此区域上传</p>
                    <p v-if="uploading" class="upload-hint">
                        <a-progress :percent="progress" size="small" />
                    </p>
                    <p v-else class="upload-hint">支持 PNG, JPG, GIF, WEBP</p>
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
.image-upload-node {
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
