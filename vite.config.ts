import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import inject from '@rollup/plugin-inject'

// https://vitejs.dev/config/
export default defineConfig({
    base: '',
    plugins: [
        inject({
            p5: 'p5'
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    build: {
        assetsInlineLimit: 0
    }
})
