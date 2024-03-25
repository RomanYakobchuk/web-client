import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";
import million from "million/compiler";

export default defineConfig(({command}) => {
    if (command === 'serve') {
        return {
            plugins: [
                million.vite({
                    auto: true
                }),
                react({
                    jsxImportSource: '@emotion/react',
                    babel: {
                        plugins: ['@emotion/babel-plugin']
                    }
                }),
            ],
            optimizeDeps: {
                include: [
                    '@emotion/react',
                    '@emotion/styled',
                    '@mui/material'
                ]
            },
            define: {
                global: 'window'
            },
            server: {
                host: 'localhost',
                port: 3000
            },
            resolve: {
                alias: {
                    '@': path.resolve(__dirname, './src'),
                    'jss-plugin-{}': 'jss-plugin-global',
                    "*": path.resolve(__dirname, './node_modules')
                },
            },
            publicDir: './public',
            build: {
                outDir: '../client',
            }
        }
    } else {
        return {
            plugins: [
                million.vite({
                    auto: true
                }),
                react({
                    jsxImportSource: '@emotion/react',
                    babel: {
                        plugins: ['@emotion/babel-plugin']
                    }
                }),
            ],
            optimizeDeps: {
                include: [
                    '@emotion/react',
                    '@emotion/styled',
                    '@mui/material'
                ]
            },
            server: {
                host: 'localhost',
                port: 3000
            },
            resolve: {
                alias: {
                    '@': path.resolve(__dirname, './src'),
                    'jss-plugin-{}': 'jss-plugin-global',
                    "*": path.resolve(__dirname, './node_modules')
                },
            },
            publicDir: './public',
            build: {
                outDir: '../client',
            }
        }
    }
})