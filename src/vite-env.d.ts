/// <reference types="vite/client"/>

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    readonly BUILD_PATH: string
    readonly BROWSER: string
    readonly VITE_APP_FACEBOOK_APP_ID: string
    readonly VITE_APP_GOOGLE_CLIENT_ID: string
    readonly VITE_APP_GOOGLE_CLIENT_SECRET: string
    readonly VITE_APP_API: string
    readonly VITE_APP_SOCKET_API: string
    readonly VITE_APP_STATISTIC_API: string
    readonly VITE_APP_GOOGLE_MAPS_KEY: string
    readonly VITE_APP_API_KEY: string
    readonly VITE_APP_ABLY_API_KEY: string
    readonly VITE_APP_GITHUB_OAUTH_ROOT_URL: string
    readonly VITE_APP_GITHUB_OAUTH_CLIENT_ID: string
    readonly VITE_APP_GITHUB_OAUTH_CLIENT_SECRET: string
    readonly VITE_APP_GITHUB_OAUTH_REDIRECT_URL

}

interface ImportMeta {
    readonly env: ImportMetaEnv
}