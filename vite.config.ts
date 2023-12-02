import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

export default defineConfig({
    plugins: [react()],
    server: {
        host: 'localhost',
        port: 3000
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            "*": path.resolve(__dirname, './node_modules')
        }
    },
    publicDir: './public',
    build: {
        outDir: '../client',
    },
})
