import ri from '@iconify-json/ri/icons.json'
import { addCollection } from '@iconify/vue'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pick(data: any, names: string[]) {
    return {
        ...data,
        icons: Object.fromEntries(names.flatMap((n) => (data.icons[n] ? [[n, data.icons[n]]] : [])))
    }
}

addCollection(
    pick(ri, [
        // text formatting
        'bold',
        'italic',
        'underline',
        'strikethrough',
        // alignment
        'align-left',
        'align-center',
        'align-right',
        'align-justify',
        // structure
        'separator-line',
        'eraser-line',
        'double-quotes-l',
        // undo / redo
        'arrow-go-back-line',
        'arrow-go-forward-line',
        // code
        'code-line',
        'code-box-line',
        // color & highlight
        'font-family',
        'font-color',
        'paint-fill',
        // headings
        'h-1',
        'h-2',
        'h-3',
        // dropdown chevron
        'arrow-down-s-line',
        // lists
        'list-unordered',
        'list-ordered',
        'list-check-2',
        // image toolbar
        'pencil-line',
        'delete-bin-line',
        // table toolbar – directional arrows
        'arrow-left-line',
        'arrow-right-line',
        'arrow-up-line',
        'arrow-down-line',
        // table toolbar – cell operations
        'subtract-line',
        'fullscreen-exit-line',
        'fullscreen-line',
        // table row-height handle
        'drag-move-line',
        // media & embeds
        'video-line',
        'image-line',
        // toolbar buttons
        'layout-grid-line',
        'links-line',
        // print & fullscreen
        'printer-line'
    ])
)
