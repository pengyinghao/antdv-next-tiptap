import type { TiptapPlugin } from './types'

export const printPlugin: TiptapPlugin = {
    name: 'print',
    extensions: [],
    toolbar: [
        { divider: true },
        {
            icon: 'ri:printer-line',
            title: '打印',
            action: () => {
                window.print()
            }
        }
    ]
}
