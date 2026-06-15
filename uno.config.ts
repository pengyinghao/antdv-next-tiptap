import { presetAntdTailwind4 } from '@antdv-next/unocss'
import {
    defineConfig,
    presetAttributify,
    presetWind4,
    transformerDirectives,
    transformerVariantGroup,
    transformerCompileClass
} from 'unocss'
export default defineConfig({
    presets: [
        presetWind4({
            dark: 'class'
        }),
        presetAttributify(),
        presetAntdTailwind4()
    ],
    transformers: [transformerDirectives(), transformerVariantGroup(), transformerCompileClass()],
    shortcuts: {
        'wh-full': 'w-full h-full',
        'flex-y-center': 'flex items-center',
        'flex-center': 'flex justify-center items-center',
        'transition-base': 'transition-all duration-300 ease-in-out'
    },
    theme: {}
})
