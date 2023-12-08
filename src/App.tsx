import {RefineKbar, RefineKbarProvider} from "@refinedev/kbar";
import {Refine, I18nProvider} from "@refinedev/core";
import {BrowserRouter} from "react-router-dom";

import React from "react";

import {accessControlProvider} from "./accessControlProvider";
import {
    RefineSnackbarProvider,
} from "@refinedev/mui";
import {useNotificationProvider} from "@refinedev/antd"
import {CssBaseline, GlobalStyles} from "@mui/material";
import routerBindings, {
    UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {useTranslation} from "react-i18next";

// import {} from "use-view-transitions";

import {ColorModeContextProvider} from "./contexts";
import {authProvider, axiosInstance} from "./authProvider";
import {SchemaProvider} from "./settings/schema";
import {VariantProvider} from "./settings/variantEstablishment";
import {resources} from "./resources";
// import {axiosInstance as aI} from "@refinedev/simple-rest/src/utils/axios";
import {CommentCreatorDataProvider} from "./contexts/CommentCreatorDataContext";
import AnimatedRoutes from "@/layout/animatedRoutes";


const API_URL = import.meta.env.VITE_APP_API;
const STATISTIC_API_URL = import.meta.env.VITE_APP_STATISTIC_API;
const SOCKET_API_URL = import.meta.env.VITE_APP_SOCKET_API;
const clientId = `${import.meta.env.VITE_APP_GOOGLE_CLIENT_ID}`;

function App() {
    const {t, i18n} = useTranslation();

    const notificationProvider = useNotificationProvider();

    const i18nProvider: I18nProvider = {
        translate: (key: string, params: object) => t(key, params),
        changeLocale: (lang: string) => i18n.changeLanguage(lang),
        getLocale: () => i18n.language,
    };

    return (
        <BrowserRouter>
            <RefineKbarProvider>
                {/*<DevtoolsPanel/>*/}
                <ColorModeContextProvider>
                    <SchemaProvider>
                        <GoogleOAuthProvider clientId={clientId}>
                            <VariantProvider>
                                <CssBaseline/>
                                <GlobalStyles styles={{html: {WebkitFontSmoothing: "auto"}}}/>
                                <RefineSnackbarProvider>
                                    <Refine
                                        dataProvider={{
                                            default: dataProvider(`${API_URL}/api/v1`, axiosInstance as any),
                                            statistics: dataProvider(`${STATISTIC_API_URL}/statistics_api/v1`, axiosInstance as any),
                                            socket: dataProvider(`${SOCKET_API_URL}/socket.io/api/v1`, axiosInstance as any)
                                        }}
                                        notificationProvider={notificationProvider}
                                        resources={resources}
                                        accessControlProvider={accessControlProvider}
                                        routerProvider={routerBindings}
                                        authProvider={authProvider}
                                        i18nProvider={i18nProvider}
                                        options={{
                                            syncWithLocation: true,
                                            mutationMode: 'undoable',
                                            liveMode: 'auto',
                                            warnWhenUnsavedChanges: true,
                                            useNewQueryKeys: true
                                        }}
                                    >
                                        <CommentCreatorDataProvider>
                                            <AnimatedRoutes/>
                                        </CommentCreatorDataProvider>
                                        <RefineKbar/>
                                        <UnsavedChangesNotifier/>
                                    </Refine>
                                </RefineSnackbarProvider>
                            </VariantProvider>
                        </GoogleOAuthProvider>
                    </SchemaProvider>
                </ColorModeContextProvider>
            </RefineKbarProvider>
        </BrowserRouter>
    );
}

export default App;
