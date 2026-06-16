<p align="center">
  <img src="https://img.shields.io/badge/Antdv%20Next-Tiptap-1677ff?style=for-the-badge&logo=antdesign&logoColor=white" alt="Antdv Next Tiptap" />
</p>

<h1 align="center">Antdv Next Tiptap</h1>

<p align="center">
  基于 Vue 3、Tiptap 和 Antdv Next 的富文本编辑器组件。
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/antdv-next-tiptap">
    <img src="https://img.shields.io/npm/v/antdv-next-tiptap?color=1677ff&label=npm&logo=npm" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/package/antdv-next-tiptap">
    <img src="https://img.shields.io/npm/dm/antdv-next-tiptap?color=52c41a&label=downloads" alt="npm downloads" />
  </a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-13c2c2" alt="MIT license" />
  </a>
  <img src="https://img.shields.io/badge/Vue-3-42b883?logo=vuedotjs&logoColor=white" alt="Vue 3" />
  <img src="https://img.shields.io/badge/TypeScript-ready-3178c6?logo=typescript&logoColor=white" alt="TypeScript ready" />
</p>

## 简介

`antdv-next-tiptap` 是一个面向 Vue 3 项目的所见即所得富文本编辑器。它将 Tiptap 的可扩展编辑能力和 Antdv Next 的交互组件整合在一起，适合内容管理、后台表单、知识库编辑、公告发布等需要稳定编辑体验的场景。

## 特性

| 能力          | 说明                                                                       |
| ------------- | -------------------------------------------------------------------------- |
| 插件化扩展    | 内置标题、字体、颜色、列表、代码块、表格、图片、视频、全屏、打印等常用能力 |
| Antdv Next UI | 工具栏、弹窗、下拉菜单等交互控件与 Antdv Next 体系保持一致                 |
| TypeScript    | 暴露 `TiptapProps`、`PluginName`、`OutputFormat` 等类型                    |
| 内容格式      | 支持 HTML 字符串和 Tiptap JSON 文档格式输出                                |
| 媒体上传      | 图片支持上传函数或 base64 内嵌；视频支持地址嵌入和自定义上传               |
| 字符计数      | 支持仅展示计数，也支持配置最大字符数                                       |
| 只读模式      | 可通过 `editable` 控制编辑器是否允许输入                                   |

## 安装

```bash
pnpm add antdv-next-tiptap antdv-next vue
```

也可以使用 npm：

```bash
npm install antdv-next-tiptap antdv-next vue
```

## 快速开始

### 全局注册

```ts
import { createApp } from 'vue'
import AntdvNext from 'antdv-next'
import AntdvNextTiptap from 'antdv-next-tiptap'
import 'antdv-next-tiptap/index.css'
import App from './App.vue'

const app = createApp(App)

app.use(AntdvNext)
app.use(AntdvNextTiptap)

app.mount('#app')
```

注册后可以直接使用：

```vue
<template>
  <Tiptap v-model="content" :height="420" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const content = ref('<h2>欢迎使用 Antdv Next Tiptap</h2><p>开始编辑内容。</p>')
</script>
```

### 按需引入

```vue
<template>
  <Tiptap v-model="content" :height="420" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Tiptap } from 'antdv-next-tiptap'
import 'antdv-next-tiptap/index.css'

const content = ref('')
</script>
```

## API

### Props

| 参数              | 类型               | 默认值      | 说明                                           |
| ----------------- | ------------------ | ----------- | ---------------------------------------------- |
| `modelValue`      | `string`           | `''`        | 编辑器内容，配合 `v-model` 使用                |
| `height`          | `number`           | `300`       | 内容区域高度，单位为 px                        |
| `editable`        | `boolean`          | `true`      | 是否允许编辑                                   |
| `outputFormat`    | `'html' \| 'json'` | `'html'`    | `modelValue` 的输出格式                        |
| `disabledPlugins` | `PluginName[]`     | `[]`        | 需要禁用的插件名称列表                         |
| `uploadImage`     | `UploadFn`         | `undefined` | 自定义图片上传函数；未提供时图片以 base64 内嵌 |
| `uploadVideo`     | `UploadFn`         | `undefined` | 自定义视频上传函数；未提供时仅支持输入视频地址 |
| `wordCount`       | `true \| number`   | `undefined` | 字符计数；传入数字时同时限制最大字符数         |

```ts
type UploadFn = (file: File, onProgress: (percent: number) => void) => Promise<string>
```

### Events

| 事件     | 回调参数                  | 说明                 |
| -------- | ------------------------- | -------------------- |
| `change` | `(value: string) => void` | 内容更新时触发       |
| `blur`   | `(value: string) => void` | 编辑器失去焦点时触发 |

### Slots

| 插槽         | 参数                                       | 说明               |
| ------------ | ------------------------------------------ | ------------------ |
| `word-count` | `{ count: number; limit: true \| number }` | 自定义字符计数区域 |

```vue
<Tiptap :word-count="500">
  <template #word-count="{ count, limit }">
    <span>{{ count }} / {{ limit }}</span>
  </template>
</Tiptap>
```

## 插件配置

默认会启用全部内置插件。可以通过 `disabledPlugins` 禁用不需要的功能：

```vue
<Tiptap :disabled-plugins="['image', 'video', 'table']" />
```

可用插件名：

| 插件名           | 说明                 |
| ---------------- | -------------------- |
| `undoRedo`       | 撤销 / 重做          |
| `heading`        | 标题级别             |
| `bold`           | 加粗                 |
| `italic`         | 斜体                 |
| `underline`      | 下划线               |
| `strike`         | 删除线               |
| `code`           | 行内代码             |
| `codeBlock`      | 代码块，支持语法高亮 |
| `blockquote`     | 引用块               |
| `bulletList`     | 无序列表             |
| `orderedList`    | 有序列表             |
| `taskList`       | 任务清单             |
| `list`           | 列表工具入口         |
| `textAlign`      | 文本对齐             |
| `horizontalRule` | 分割线               |
| `clearFormat`    | 清除格式             |
| `color`          | 文字颜色             |
| `highlight`      | 文字高亮             |
| `link`           | 超链接               |
| `image`          | 图片插入与上传       |
| `video`          | 视频嵌入与上传       |
| `table`          | 表格                 |
| `fontFamily`     | 字体                 |
| `fontSize`       | 字号                 |
| `print`          | 打印                 |
| `fullscreen`     | 全屏模式             |

## 常用示例

### JSON 输出

```vue
<Tiptap v-model="content" output-format="json" />
```

### 只读模式

```vue
<Tiptap v-model="content" :editable="false" />
```

### 图片上传

```vue
<template>
  <Tiptap v-model="content" :upload-image="uploadImage" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const content = ref('')

const uploadImage = async (file: File, onProgress: (percent: number) => void) => {
  onProgress(20)
  const url = await uploadToOSS(file)
  onProgress(100)
  return url
}
</script>
```

### 视频上传

```vue
<template>
  <Tiptap v-model="content" :upload-video="uploadVideo" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const content = ref('')

const uploadVideo = async (file: File, onProgress: (percent: number) => void) => {
  onProgress(20)
  const url = await uploadToOSS(file)
  onProgress(100)
  return url
}
</script>
```

## 本地开发

```bash
pnpm install
pnpm dev
```

构建组件库：

```bash
pnpm build
```

类型检查：

```bash
pnpm type-check
```

## 相关链接

| 名称       | 地址                                                    |
| ---------- | ------------------------------------------------------- |
| Tiptap     | https://github.com/ueberdosis/tiptap                    |
| Antdv Next | https://github.com/antdv-next/antdv-next                |
| Issues     | https://github.com/pengyinghao/antdv-next-tiptap/issues |

## 致谢

本项目受 [element-tiptap](https://github.com/Leecason/element-tiptap) 启发，感谢 Tiptap、Antdv Next 以及相关开源生态。

## License

[MIT](./LICENSE)
