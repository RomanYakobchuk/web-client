import {defineConfig, splitVendorChunkPlugin} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react(), splitVendorChunkPlugin()],
    server: {
        host: 'localhost',
        port: 3000
    },
    publicDir: './public',
    build: {
        outDir: '../client',
    },
})
