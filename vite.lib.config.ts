import { AntdvNextResolver } from '@antdv-next/auto-import-resolver'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { fileURLToPath, URL } from 'node:url'
import unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        unocss(),
        Components({
            resolvers: [AntdvNextResolver()],
            extensions: ['vue'],
            dirs: [],
            dts: false
        }),
        AutoImport({
            dts: false,
            dirs: [],
            imports: ['vue']
        }),
        dts({
            include: ['typings/*.d.ts', 'src/components/tiptap'],
            outDirs: 'dist/types',
            tsconfigPath: './tsconfig.lib.json',
            strictOutput: false,
            beforeWriteFile: (filePath, content) => ({
                filePath: filePath.replace(/[/\\]src[/\\]components[/\\]tiptap[/\\]/, '/'),
                content
            })
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    build: {
        outDir: 'dist',
        lib: {
            entry: fileURLToPath(new URL('./src/components/tiptap/index.ts', import.meta.url)),
            formats: ['es'],
            fileName: () => 'index.mjs'
        },
        rollupOptions: {
            checks: {
                pluginTimings: false
            },
            external: ['vue', 'antdv-next', /^@tiptap\//, /^@iconify/, /^ant-design-vue/],
            output: {
                assetFileNames: 'index.[ext]'
            }
        },
        cssCodeSplit: false,
        sourcemap: true
    }
})
