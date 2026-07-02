import type { Editor } from '@tiptap/vue-3'

import PrintLineIcon from '@/assets/icons/ri--printer-line.svg'

import type { EditorPlugin } from './types'

const escapeHtml = (value: string) =>
    value.replace(/[&<>"']/g, (char) => {
        const entities: Record<string, string> = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }
        return entities[char] ?? char
    })

const getStyleTags = () =>
    Array.from(
        document.querySelectorAll<HTMLStyleElement | HTMLLinkElement>(
            'style, link[rel="stylesheet"]'
        )
    )
        .map((node) => node.outerHTML)
        .join('\n')

const setStyle = (element: Element, style: Partial<CSSStyleDeclaration>) => {
    if (element instanceof HTMLElement) {
        Object.assign(element.style, style)
    }
}

const normalizeImageViews = (root: ParentNode) => {
    root.querySelectorAll('.image-toolbar, .column-resize-handle').forEach((node) => node.remove())

    root.querySelectorAll('.image-view').forEach((node) => {
        setStyle(node, {
            lineHeight: '0',
            maxWidth: '100%'
        })

        if (node.classList.contains('image-view--block')) {
            setStyle(node, {
                display: 'block',
                cssFloat: 'none',
                margin: '8px 0',
                textAlign: 'center'
            })
            return
        }

        if (node.classList.contains('image-view--left')) {
            setStyle(node, {
                display: 'inline-block',
                cssFloat: 'left',
                margin: '4px 8px 4px 0'
            })
            return
        }

        if (node.classList.contains('image-view--right')) {
            setStyle(node, {
                display: 'inline-block',
                cssFloat: 'right',
                margin: '4px 0 4px 8px'
            })
            return
        }

        setStyle(node, {
            display: 'inline-block',
            cssFloat: 'none',
            margin: '4px 0',
            verticalAlign: 'bottom'
        })
    })

    root.querySelectorAll('.image-view__body').forEach((node) => {
        setStyle(node, {
            cursor: 'default',
            display: 'inline-block',
            lineHeight: '0',
            maxWidth: '100%'
        })
    })

    root.querySelectorAll('.image-view img').forEach((node) => {
        setStyle(node, {
            boxSizing: 'border-box',
            display: 'inline-block',
            cssFloat: 'none',
            margin: '0',
            maxWidth: '100%',
            verticalAlign: 'bottom'
        })
    })

    root.querySelectorAll('img[data-display]').forEach((node) => {
        if (!(node instanceof HTMLImageElement)) return

        const display = node.dataset.display
        setStyle(node, {
            boxSizing: 'border-box',
            maxWidth: '100%'
        })

        if (display === 'block') {
            setStyle(node, {
                display: 'block',
                cssFloat: 'none',
                margin: '8px auto'
            })
            return
        }

        if (display === 'left') {
            setStyle(node, {
                display: 'inline-block',
                cssFloat: 'left',
                margin: '4px 8px 4px 0'
            })
            return
        }

        if (display === 'right') {
            setStyle(node, {
                display: 'inline-block',
                cssFloat: 'right',
                margin: '4px 0 4px 8px'
            })
            return
        }

        setStyle(node, {
            display: 'inline-block',
            cssFloat: 'none',
            margin: '4px 0',
            verticalAlign: 'bottom'
        })
    })
}

const normalizeEmptyParagraphs = (root: ParentNode) => {
    root.querySelectorAll('p').forEach((node) => {
        if (node.textContent?.trim() || node.querySelector('img, video, iframe, br')) return

        node.appendChild(document.createElement('br'))
    })
}

const getPrintableHtml = (html: string) => {
    const container = document.createElement('div')
    container.className = 'tiptap'
    container.innerHTML = html

    container.querySelectorAll('[contenteditable]').forEach((node) => {
        node.removeAttribute('contenteditable')
    })
    container.querySelectorAll('.ProseMirror-selectednode, .selectedCell').forEach((node) => {
        node.classList.remove('ProseMirror-selectednode', 'selectedCell')
    })
    container.querySelectorAll('.column-resize-handle').forEach((node) => node.remove())
    normalizeEmptyParagraphs(container)
    normalizeImageViews(container)

    return `
<div class="editor editor-print">
    <div class="editor-content">
        ${container.outerHTML}
    </div>
</div>`
}

const waitForPrintReady = (doc: Document) => {
    const links = Array.from(doc.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')).map(
        (link) =>
            new Promise<void>((resolve) => {
                try {
                    if (link.sheet) {
                        resolve()
                        return
                    }
                } catch {
                    resolve()
                    return
                }
                link.onload = () => resolve()
                link.onerror = () => resolve()
            })
    )

    const images = Array.from(doc.images).map((image) => {
        if (image.complete) return Promise.resolve()

        return new Promise<void>((resolve) => {
            image.onload = () => resolve()
            image.onerror = () => resolve()
        })
    })

    const fonts = doc.fonts?.ready.catch(() => undefined) ?? Promise.resolve()

    return Promise.race([
        Promise.all([...links, ...images, fonts]),
        new Promise((resolve) => window.setTimeout(resolve, 800))
    ])
}

function printHtml(html: string) {
    document.getElementById('el-tiptap-iframe')?.remove()

    const iframe: HTMLIFrameElement = document.createElement('iframe')
    iframe.id = 'el-tiptap-iframe'
    iframe.setAttribute(
        'style',
        'position: fixed; width: 1px; height: 1px; right: 0; bottom: 0; border: 0; opacity: 0; pointer-events: none;'
    )
    document.body.appendChild(iframe)

    const frameWindow = iframe.contentWindow
    const doc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document)
    if (!frameWindow || !doc) {
        iframe.remove()
        return
    }

    let printed = false
    let removed = false
    const removeIframe = () => {
        if (removed) return
        removed = true
        window.setTimeout(() => iframe.remove(), 300)
    }

    const print = async () => {
        if (printed) return
        printed = true
        await waitForPrintReady(doc)

        try {
            frameWindow.focus()
            frameWindow.print()
        } finally {
            window.setTimeout(removeIframe, 1000)
        }
    }

    frameWindow.addEventListener('afterprint', removeIframe, { once: true })
    iframe.onload = () => {
        void print()
    }

    const content = `<!doctype html>
<html class="${escapeHtml(document.documentElement.className)}">
<head>
    <meta charset="utf-8">
    <base href="${escapeHtml(document.baseURI)}">
    ${getStyleTags()}
    <style>
        html,
        body {
            background: #fff !important;
            margin: 0;
            min-height: 100%;
        }

        body {
            box-sizing: border-box;
            color: #000;
            padding: 24px;
        }

        .editor-print {
            background: transparent !important;
            border: 0 !important;
            border-radius: 0 !important;
            margin: 0 auto;
            max-width: 794px;
            width: 100%;
        }

        .editor-print .editor-content {
            height: auto !important;
            padding: 0 !important;
        }

        .editor-print .tiptap {
            height: auto !important;
            overflow: visible !important;
            padding: 0 !important;
        }

        .editor-print,
        .editor-print * {
            color-adjust: exact;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
        }

        .editor-print .tiptap p {
            line-height: 1.5715;
            margin: 0;
            min-height: 1.5715em;
            outline: none;
        }

        .editor-print .tiptap h1,
        .editor-print .tiptap h2,
        .editor-print .tiptap h3,
        .editor-print .tiptap h4,
        .editor-print .tiptap h5 {
            font-weight: bold;
            margin-top: 20px;
            margin-bottom: 20px;
        }

        .editor-print .tiptap h1:first-child,
        .editor-print .tiptap h2:first-child,
        .editor-print .tiptap h3:first-child,
        .editor-print .tiptap h4:first-child,
        .editor-print .tiptap h5:first-child {
            margin-top: 0;
        }

        .editor-print .tiptap h1:last-child,
        .editor-print .tiptap h2:last-child,
        .editor-print .tiptap h3:last-child,
        .editor-print .tiptap h4:last-child,
        .editor-print .tiptap h5:last-child {
            margin-bottom: 0;
        }

        .editor-print .tiptap h1 {
            font-size: 2em;
        }

        .editor-print .tiptap h2 {
            font-size: 1.5em;
        }

        .editor-print .tiptap h3 {
            font-size: 1.25em;
        }

        .editor-print .tiptap h4 {
            font-size: 1em;
        }

        .editor-print .tiptap h5 {
            font-size: 0.875em;
        }

        .editor-print .tiptap ul,
        .editor-print .tiptap ol {
            list-style-type: none;
            margin: 0;
            margin-left: 24px;
            padding: 5px 0;
        }

        .editor-print .tiptap li > p {
            margin: 0;
        }

        .editor-print .tiptap li > p:first-child::before {
            content: counter(tiptap-counter) ".";
            display: inline-block;
            left: -5px;
            line-height: 1;
            margin-left: -24px;
            position: relative;
            text-align: right;
            top: 0;
            width: 24px;
        }

        .editor-print .tiptap ul li > p:first-child::before {
            content: "\\2022";
            text-align: center;
        }

        .editor-print .tiptap ol {
            counter-reset: tiptap-counter;
        }

        .editor-print .tiptap ol li > p:first-child::before {
            counter-increment: tiptap-counter;
        }

        .editor-print .tiptap ul[data-type="taskList"] {
            list-style: none;
            margin-left: 5px;
            padding-left: 0;
        }

        .editor-print .tiptap ul[data-type="taskList"] li[data-type="taskItem"] {
            align-items: flex-start;
            display: flex;
            flex-direction: row;
            width: 100%;
        }

        .editor-print .tiptap a {
            color: var(--ant-color-primary);
            cursor: pointer;
        }

        .editor-print .tiptap blockquote {
            border-left: 3px solid var(--ant-color-border-secondary);
            box-sizing: border-box;
            color: var(--ant-color-text-secondary);
            margin: 8px 0;
            padding-left: 12px;
        }

        .editor-print .tiptap hr {
            background: var(--ant-color-border-secondary);
            border: none;
            height: 1px;
            margin: 12px 0;
        }

        .editor-print .tiptap img {
            display: inline-block;
            float: none;
            margin: 12px 0;
            max-width: 100%;
        }

        .editor-print img,
        .editor-print video {
            max-width: 100%;
        }

        .editor-print .image-view {
            line-height: 0 !important;
            max-width: 100% !important;
        }

        .editor-print .image-view--inline {
            display: inline-block !important;
            float: none !important;
            margin: 4px 0 !important;
            vertical-align: bottom !important;
        }

        .editor-print .image-view--block {
            display: block !important;
            float: none !important;
            margin: 8px 0 !important;
            text-align: center !important;
        }

        .editor-print .image-view--left {
            display: inline-block !important;
            float: left !important;
            margin: 4px 8px 4px 0 !important;
        }

        .editor-print .image-view--right {
            display: inline-block !important;
            float: right !important;
            margin: 4px 0 4px 8px !important;
        }

        .editor-print .image-view__body {
            cursor: default !important;
            display: inline-block !important;
            line-height: 0 !important;
            max-width: 100% !important;
        }

        .editor-print .image-view img {
            box-sizing: border-box !important;
            display: inline-block !important;
            float: none !important;
            margin: 0 !important;
            max-width: 100% !important;
            vertical-align: bottom !important;
        }

        .editor-print img[data-display="inline"] {
            display: inline-block !important;
            float: none !important;
            margin: 4px 0 !important;
            vertical-align: bottom !important;
        }

        .editor-print img[data-display="block"] {
            display: block !important;
            float: none !important;
            margin: 8px auto !important;
        }

        .editor-print img[data-display="left"] {
            display: inline-block !important;
            float: left !important;
            margin: 4px 8px 4px 0 !important;
        }

        .editor-print img[data-display="right"] {
            display: inline-block !important;
            float: right !important;
            margin: 4px 0 4px 8px !important;
        }

        @page {
            margin: 16mm;
        }

        @media print {
            body {
                padding: 0;
            }

            .editor-print {
                max-width: none;
            }
        }
    </style>
</head>
<body class="${escapeHtml(document.body.className)}">
    ${getPrintableHtml(html)}
</body>
</html>`

    doc.open()
    doc.write(content)
    doc.close()
    window.setTimeout(() => void print(), 500)
}

export const printPlugin: EditorPlugin = {
    name: 'print',
    extensions: [],
    toolbar: [
        { divider: true },
        {
            icon: PrintLineIcon,
            title: '打印',
            action: (editor: Editor) => {
                printHtml(editor.getHTML())
            }
        }
    ]
}
