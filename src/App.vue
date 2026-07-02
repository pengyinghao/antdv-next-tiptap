<script setup lang="ts">
import { theme } from 'antdv-next'
import { ref, watchEffect } from 'vue'

const isDark = ref(false)
const value = ref(`<h2 style="text-align: center">Welcome To Antv Next Tiptap Editor Demo
</h2>
<p>🔥
  <strong>Antv Next Tiptap Editor </strong>🔥is a WYSIWYG rich-text editor using&nbsp;
  <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/scrumpy/tiptap">tiptap</a>&nbsp;and
  <a target="_blank" rel="noopener noreferrer nofollow" href="https://www.antdv-next.cn/index-cn">antdv-next</a>&nbsp;for Vue3,
  <img src="https://i.ibb.co/nbRN3S2/undraw-upload-87y9.png" alt="" title="" width="200" height="200" data-display="right"> that's easy to use, friendly to developers, fully extensible and clean in design.
</p>
<p>
</p>
<p style="text-align: right">👉Click on the image to get started image features 👉
</p>
<p>
</p>
<p>You can switch to
  <strong>Code View </strong>💻 mode and toggle
  <strong>Fullscreen</strong> 📺 in this demo.
</p>
<p>
</p>
<p>
  <strong>Got questions or need help or feature request?</strong>
</p>
<p>🚀
  <strong>welcome to submit an </strong>
  <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/pengyinghao/antdv-next-tiptap/issues"><strong>issue</strong></a> 😊
</p>
<p>I'm continuously working to add in new features.
</p>
<p>
</p>
<blockquote>
  <p>This demo is simple, switch tab for more features.
  </p>
  <p>All demos source code:
    <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/pengyinghao/antdv-next-tiptap">source code 🔗</a>
  </p>
</blockquote>`)

watchEffect(() => {
    document.documentElement.classList.toggle('dark', isDark.value)
})

// demo 用的 mock，模拟上传进度，实际使用时替换为真实上传接口
const mockUpload = (file: File, onProgress: (p: number) => void): Promise<string> => {
    return new Promise((resolve) => {
        let p = 0
        const timer = setInterval(() => {
            p = Math.min(p + 10, 100)
            onProgress(p)
            if (p >= 100) {
                clearInterval(timer)
                resolve(URL.createObjectURL(file))
            }
        }, 200)
    })
}

const handleUploadImage = mockUpload
const handleUploadVideo = mockUpload
</script>

<template>
    <a-config-provider
        :theme="{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }"
    >
        <div class="h-100vh w-100vw flex-center bg-ant-bg-layout transition-base">
            <div class="w-1000px flex flex-col gap-12px">
                <div class="flex justify-end">
                    <a-switch
                        v-model:checked="isDark"
                        checked-children="🌙"
                        un-checked-children="☀️"
                    />
                </div>
                <a-editor
                    v-model="value"
                    :height="500"
                    :editable="true"
                    :word-count="1000"
                    :upload-image="handleUploadImage"
                    :upload-video="handleUploadVideo"
                />
            </div>
        </div>
    </a-config-provider>
</template>

<style scoped></style>
