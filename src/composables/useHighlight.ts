import { watchEffect, onUnmounted } from 'vue'

export function useHighlighter() {
    let link: HTMLLinkElement | null = null

    const setTheme = (dark: boolean) => {
        if (!link) {
            link = document.createElement('link')
            link.rel = 'stylesheet'
            document.head.appendChild(link)
        }
        link.href = dark
            ? new URL('highlight.js/styles/github-dark.css', import.meta.url).href
            : new URL('highlight.js/styles/github.css', import.meta.url).href
    }

    watchEffect(() => setTheme(document.documentElement.classList.contains('dark')))

    const observer = new MutationObserver(() =>
        setTheme(document.documentElement.classList.contains('dark'))
    )
    observer.observe(document.documentElement, { attributeFilter: ['class'] })

    onUnmounted(() => observer.disconnect())
}
