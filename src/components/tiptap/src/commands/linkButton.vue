<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'
import type { FormInstance, InputRef } from 'antdv-next'
import type { Rule } from 'antdv-next/dist/form/types'

import { computed, nextTick, reactive, ref } from 'vue'

import Icon from '@/components/icon/icon.vue'

const props = defineProps<{ editor?: Editor }>()

const visible = ref(false)
const formRef = ref<FormInstance>()
const hrefInputRef = ref<InputRef>()
const formData = reactive({ href: '', openInNewTab: false })

const rules: Record<string, Rule[]> = {
    href: [{ required: true, message: '请输入链接地址', trigger: ['blur', 'change'] }]
}

const isActive = computed(() => !!props.editor?.isActive('link'))

const openModal = () => {
    if (!props.editor) return
    const attrs = props.editor.getAttributes('link')
    formData.href = (attrs.href as string) ?? ''
    formData.openInNewTab = attrs.target === '_blank'
    visible.value = true
}

const handleConfirm = async () => {
    if (!props.editor) return
    await formRef.value?.validate()
    props.editor
        .chain()
        .focus()
        .setLink({ href: formData.href.trim(), target: formData.openInNewTab ? '_blank' : null })
        .setUnderline()
        .setColor('var(--ant-color-primary)')
        .run()
    handleCancel()
}

const handleRemoveLink = () => {
    if (!props.editor) return
    props.editor.chain().focus().unsetLink().run()
    visible.value = false
}

const handleCancel = () => {
    formRef.value?.resetFields()
    visible.value = false
}
</script>

<template>
    <div title="链接" :class="['toolbar-btn', { active: isActive }]" @click="openModal">
        <Icon name="ri:links-line" />
    </div>
    <a-modal
        v-model:open="visible"
        title="插入链接"
        width="420px"
        :keyboard="false"
        destroy-on-hidden
        @cancel="handleCancel"
        @after-open-change="(open: boolean) => open && nextTick(() => hrefInputRef?.focus())"
    >
        <a-form ref="formRef" :model="formData" :rules="rules" layout="vertical" class="link-form">
            <a-form-item label="链接地址" name="href">
                <a-input
                    ref="hrefInputRef"
                    v-model:value="formData.href"
                    placeholder="https://..."
                    allow-clear
                />
            </a-form-item>
            <a-form-item name="openInNewTab">
                <a-checkbox v-model:checked="formData.openInNewTab">在新标签页中打开</a-checkbox>
            </a-form-item>
            <a-form-item v-if="isActive">
                <a-button danger @click="handleRemoveLink">移除链接</a-button>
            </a-form-item>
        </a-form>
        <template #footer>
            <a-button @click="handleCancel">取消</a-button>
            <a-button type="primary" @click="handleConfirm">确定</a-button>
        </template>
    </a-modal>
</template>

<style lang="scss" scoped>
.toolbar-btn {
    @apply cursor-pointer w-32px h-32px flex-center rounded-6px transition-base flex-shrink-0;
    @apply text-ant-text hover:bg-ant-primary-bg hover:text-ant-primary;

    &.active {
        @apply bg-ant-primary-bg text-primary-text;
    }
}

.link-form {
    @apply pt-16px;
}
</style>
