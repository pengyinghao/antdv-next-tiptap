export type PluginName =
    | 'undoRedo'
    | 'heading'
    | 'bold'
    | 'italic'
    | 'underline'
    | 'strike'
    | 'code'
    | 'codeBlock'
    | 'blockquote'
    | 'bulletList'
    | 'orderedList'
    | 'taskList'
    | 'list'
    | 'textAlign'
    | 'horizontalRule'
    | 'clearFormat'
    | 'color'
    | 'highlight'
    | 'link'
    | 'image'
    | 'imageUpload'
    | 'video'
    | 'videoUpload'
    | 'table'
    | 'fontFamily'
    | 'fontSize'
    | 'print'
    | 'fullscreen'

export type OutputFormat = 'html' | 'json'

/** 上传函数签名，onProgress 回调传入 0-100 的进度百分比 */
export type UploadFn = (file: File, onProgress: (percent: number) => void) => Promise<string>

export interface EditorProps {
    /** 内容区域高度 */
    height?: number
    /** 是否可编辑 */
    editable?: boolean
    /**
     * 禁用的插件名称列表，对应 EditorPlugin.name
     * @example ['image', 'video', 'table']
     */
    disabledPlugins?: PluginName[]
    /**
     * 自定义图片上传函数，返回图片 URL
     * 不提供时使用 base64 内嵌
     * @example async (file) => { const url = await uploadToOSS(file); return url }
     */
    uploadImage?: UploadFn
    /**
     * 自定义视频上传函数，返回视频 URL；onProgress 传入 0-100 的上传进度
     * 不提供时仅支持输入视频地址，无本地上传入口
     * @example async (file, onProgress) => { const url = await uploadToOSS(file, onProgress); return url }
     */
    uploadVideo?: UploadFn
    /**
     * 字符计数。true 仅展示计数，number 同时限制最大字符数
     * @example true
     * @example 500
     */
    wordCount?: true | number
    /**
     * 输出格式，默认 'html'
     * - 'html'：modelValue 为 HTML 字符串
     * - 'json'：modelValue 为 JSON 字符串（Tiptap doc 格式）
     */
    outputFormat?: OutputFormat
}
