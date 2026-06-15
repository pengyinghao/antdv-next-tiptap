import { AntdvNextResolver } from '@antdv-next/auto-import-resolver'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { fileURLToPath, URL } from 'node:url'
import unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import svgLoader from 'vite-svg-loader'
export default defineConfig({
    base: process.env.VITE_APP_BASE || '/antdv-next-tiptap/',
    plugins: [
        vue(),
        vueJsx(),
        unocss(),
        Components({
            resolvers: [AntdvNextResolver()],
            extensions: ['vue', 'vue-router'],
            dirs: [],
            dts: 'typings/auto-components.d.ts'
        }),
        AutoImport({
            dts: 'typings/auto-imports.d.ts',
            dirs: [],
            imports: ['vue', 'vue-router']
        }),
        svgLoader()
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    css: {
        devSourcemap: true
    },
    build: {
        rollupOptions: {
            output: {
                chunkFileNames: 'static/js/[name]-[hash].js',
                entryFileNames: 'static/js/[name]-[hash].js',
                assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return id
                            .toString()
                            .split('node_modules/')[1]
                            .replace('.pnpm/', '')
                            .split('/')[0]
                    }
                }
            }
        }
    }
})
