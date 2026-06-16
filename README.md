<p align="center">
  <img alt="npm" src="https://img.shields.io/npm/v/antdv-next-tiptap">
  <img alt="npm peer dependency version" src="https://img.shields.io/badge/vue-%5E3.0.0-vue">
  <img alt="GitHub" src="https://img.shields.io/github/license/pengyinghao/antdv-next-tiptap">
</p>

<h3 align="center">Antdv Next Tiptap 富文本编辑器</h3>

<p align="center"><strong>现代化、轻量级、易扩展的 Vue 3 富文本编辑器</strong></p>

基于 [Tiptap](https://github.com/ueberdosis/tiptap) 和 [antdv-next](https://github.com/antdv-next/antdv-next) 为 Vue 3 打造的现代化富文本编辑器，专为构建高质量内容管理系统而设计。

### ✨ 核心特色

- **🔌 插件化架构** - 20+ 开箱即用的扩展插件，可按需启用
- **🎨 精美 UI** - 深度集成 Ant Design Vue，符合现代交互规范 
- **📱 响应式设计** - 支持多端自适应，移动友好
- **⚡ 高性能** - 基于现代编辑器框架，流畅的编辑体验
- **🔧 高度可定制** - 灵活的插件配置和内容输出格式
- **📝 多格式支持** - 支持 HTML 和 JSON 内容输出
- **🖼️ 媒体处理** - 完善的图片、视频上传机制
- **🎯 TypeScript** - 完整的类型定义，更好的开发体验

### 🎯 设计理念

为 Vue 3 开发者提供最优雅、最易用的富文本编辑解决方案，让内容创作与编辑变得简单而愉快。

## 📦 安装

```shell
pnpm add antdv-next-tiptap
```

```shell
npm install antdv-next-tiptap
```

#### 全局注册

```js
import { createApp } from 'vue'
import App from './App.vue'
import AntdvNext from 'antdv-next'
import AntdvNextTiptap from 'antdv-next-tiptap'
import 'antdv-next-tiptap/index.css'

const app = createApp(App)

app.use(AntdvNext)
app.use(AntdvNextTiptap)
// 全局可直接使用 <Tiptap>

app.mount('#app')
```

#### 按需引入

```vue
<template>
  <Tiptap v-model="content" />
</template>

<script setup>
import { Tiptap } from 'antdv-next-tiptap'
import 'antdv-next-tiptap/index.css'
</script>
```

## 🚀 基本用法

```vue
<template>
  <Tiptap v-model="content" :height="400" />
</template>

<script setup>
import { ref } from 'vue'
import { Tiptap } from 'antdv-next-tiptap'
import 'antdv-next-tiptap/index.css'

const content = ref('<h1>标题</h1><p>这个编辑器很棒！</p>')
</script>
```

## 📔 Props

### `modelValue`

类型：`string`

默认值：`''`

编辑器内容，配合 `v-model` 使用。

### `height`

类型：`number`

默认值：`300`

内容区域高度，单位为像素。

### `editable`

类型：`boolean`

默认值：`true`

是否可编辑。设为 `false` 时编辑器进入只读模式。

```html
<Tiptap :editable="false" />
```

### `outputFormat`

类型：`'html' | 'json'`

默认值：`'html'`

`modelValue` 的输出格式。

- `'html'`：输出 HTML 字符串
- `'json'`：输出 JSON 字符串（Tiptap 文档格式）

```html
<Tiptap output-format="json" />
```

### `disabledPlugins`

类型：`PluginName[]`

默认值：`[]`

需要禁用的插件名称列表，默认启用全部插件。

```html
<Tiptap :disabled-plugins="['image', 'video', 'table']" />
```

可用插件名称：

| 插件名           | 说明                 |
| ---------------- | -------------------- |
| `undoRedo`       | 撤销 / 重做          |
| `heading`        | 标题级别             |
| `bold`           | 加粗                 |
| `italic`         | 斜体                 |
| `underline`      | 下划线               |
| `strike`         | 删除线               |
| `code`           | 行内代码             |
| `codeBlock`      | 代码块（含语法高亮） |
| `blockquote`     | 引用块               |
| `bulletList`     | 无序列表             |
| `orderedList`    | 有序列表             |
| `taskList`       | 任务清单             |
| `list`           | 列表工具             |
| `textAlign`      | 文本对齐             |
| `horizontalRule` | 分割线               |
| `clearFormat`    | 清除格式             |
| `color`          | 文字颜色             |
| `highlight`      | 文字高亮             |
| `link`           | 超链接               |
| `image`          | 图片插入与上传       |
| `video`          | 视频嵌入             |
| `table`          | 表格                 |
| `fontFamily`     | 字体                 |
| `fontSize`       | 字号                 |
| `print`          | 打印                 |
| `fullscreen`     | 全屏模式             |

### `uploadImage`

类型：`(file: File) => Promise<string>`

默认值：`undefined`

自定义图片上传函数，返回图片最终 URL。未提供时图片以 base64 格式内嵌。

```html
<Tiptap :upload-image="handleUpload" />
```

```ts
const handleUpload = async (file: File): Promise<string> => {
  const url = await uploadToOSS(file)
  return url
}
```

### `uploadVideo`

类型：`(file: File) => Promise<string>`

默认值：`undefined`

自定义视频上传函数，返回视频最终 URL。提供后工具栏会出现"本地上传"入口；未提供时仅支持输入视频地址。

```html
<Tiptap :upload-video="handleVideoUpload" />
```

```ts
const handleVideoUpload = async (file: File): Promise<string> => {
  const url = await uploadToOSS(file)
  return url
}
```

### `wordCount`

类型：`true | number`

默认值：`undefined`

字符计数。传 `true` 仅展示计数；传 `number` 同时限制最大字符数。

```html
<!-- 仅展示计数 -->
<Tiptap :word-count="true" />

<!-- 计数并限制最多 500 字符 -->
<Tiptap :word-count="500" />
```

## 👽 事件

### `change`

内容更新时触发，参数为当前输出字符串。

```vue
<template>
  <Tiptap @change="onChange" />
</template>

<script setup>
const onChange = (value: string) => {
  console.log(value)
}
</script>
```

### `blur`

编辑器失去焦点时触发，参数为当前输出字符串。

```vue
<Tiptap @blur="onBlur" />
```

## 🎰 插槽

### `word-count`

自定义字符计数区域的 UI。

```vue
<Tiptap :word-count="500">
  <template #word-count="{ count, limit }">
    <span>{{ count }} / {{ limit }}</span>
  </template>
</Tiptap>
```

插槽参数：

| 参数    | 类型             | 说明                       |
| ------- | ---------------- | -------------------------- |
| `count` | `number`         | 当前字符数                 |
| `limit` | `true \| number` | `word-count` prop 的传入值 |

## 🙏 致谢

本项目受 [element-tiptap](https://github.com/Leecason/element-tiptap) 启发，感谢 [Tiptap](https://github.com/ueberdosis/tiptap) 和 [Ant Design Vue](https://antdv-next.antfu.me/) 的开源支持。

## 🚀 快速启动

想快速体验本项目的魅力？我们为您准备了在线演示：

[![在线演示](https://img.shields.io/badge/在线演示-Antdv_Tiptap-4a90e2)](https://github.com/pengyinghao/antdv-next-tiptap)
