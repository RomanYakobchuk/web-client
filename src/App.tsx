import {RefineKbar, RefineKbarProvider} from "@refinedev/kbar";
import {Refine, Authenticated, I18nProvider, CanAccess} from "@refinedev/core";
import {BrowserRouter, Route, Routes, Outlet} from "react-router-dom";
import {
    Apartment, ForumOutlined,
    Group,
    Home as HomeIcon,
    NewspaperOutlined,
    Person,
    Reviews,
    Star,
    WineBar
} from "@mui/icons-material";
import React, {useEffect} from "react";
import {newEnforcer} from "casbin.js";

import {
    AllEstablishments,
    Capl,
    EstablishmentDetails,
    CreateEstablishment,
    EditEstablishment,
    EditProfile,
    ForgotPassword,
    Login,
    News,
    Profile,
    Register,
    TopInstitutions,
    UpdatePassword,
    Settings,
    VerifyNumber,
    Welcome,
    Home,
    AllReviews,
    AllUsers,
    Chat,
    Notifications,
    CreateNews,
    DetailsNews,
    EditNews,
    ShowUserInfo,
    CreateReservation,
    DetailsReserve,
    EditReserve,
    UpdateCity
} from "./pages";
import {
    Loading,
    Menu,
    EditMenu,
    CreateMenu, EditUpdateStatus, ShowChats
} from "./components";
import {accessControlProvider} from "./accessControlProvider";
import {Header, Title, Layout, Sider} from "./layout";

import {
    ErrorComponent,
    RefineSnackbarProvider,
} from "@refinedev/mui";
import {notificationProvider} from "@refinedev/antd"

import {CssBaseline, GlobalStyles} from "@mui/material";
import routerBindings, {
    CatchAllNavigate,
    NavigateToResource,
    UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";

import {useTranslation} from "react-i18next";
import {ColorModeContextProvider} from "./contexts";
import {authProvider, axiosInstance} from "./authProvider";
import {useRole} from "./utils";
import {socket} from './socketClient'
import {SchemaProvider} from "./settings/schema";
import {VariantProvider} from "./settings/variantEstablishment";
import {AppContextProvider} from "./contexts/AppContext";
import {GoogleOAuthProvider} from "@react-oauth/google";

const API_URL = import.meta.env.VITE_APP_API;
const STATISTIC_API_URL = import.meta.env.VITE_APP_STATISTIC_API;
const clientId = `${import.meta.env.VITE_APP_GOOGLE_CLIENT_ID}`;

function App() {
    const {t, i18n} = useTranslation();

    const {role, userId} = useRole();

    const i18nProvider: I18nProvider = {
        translate: (key: string, params: object) => t(key, params),
        changeLocale: (lang: string) => i18n.changeLanguage(lang),
        getLocale: () => i18n.language,
    };
    useEffect(() => {
        socket.on('connect', () => {
        });
        if (userId) {
            socket?.emit("addUser", userId);
        }
    }, [userId]);

    if (role === "notRole") return <Loading/>
    return (
        <BrowserRouter>
            <RefineKbarProvider>
                <ColorModeContextProvider>
                    <SchemaProvider>
                        <GoogleOAuthProvider clientId={clientId}>
                            <VariantProvider>
                                <CssBaseline/>
                                <GlobalStyles styles={{html: {WebkitFontSmoothing: "auto"}}}/>
                                <RefineSnackbarProvider>
                                    <Refine
                                        dataProvider={{
                                            default: dataProvider(`${API_URL}/api/v1`, axiosInstance),
                                            statistics: dataProvider(`${STATISTIC_API_URL}/statistics_api/v1`)
                                        }}
                                        notificationProvider={notificationProvider}
                                        resources={[
                                            {
                                                name: "home",
                                                meta: {
                                                    icon: <HomeIcon/>,
                                                },
                                                list: '/home',
                                                show: '/home/show/:id',
                                                create: '/home/create',
                                                edit: '/home/edit/:id',
                                            },
                                            {
                                                name: "all_institutions",
                                                meta: {
                                                    icon: <Apartment/>,
                                                    canDelete: true,
                                                },
                                                list: '/all_institutions',
                                                show: '/all_institutions/show/:id',
                                                create: '/all_institutions/create',
                                                edit: '/all_institutions/edit/:id',
                                            },
                                            {
                                                name: "news",
                                                meta: {
                                                    icon: <NewspaperOutlined/>,
                                                },
                                                list: '/news',
                                                show: '/news/show/:id',
                                                create: '/news/create',
                                                edit: '/news/edit/:id',
                                            },
                                            {
                                                name: "top-institutions",
                                                list: '/top-institutions',
                                                meta: {
                                                    icon: <Star/>,
                                                    label: "Top Institutions"
                                                },
                                                show: '/top-institutions/show/:id',
                                            },
                                            {
                                                name: "capl",
                                                list: '/capl',
                                                meta: {
                                                    icon: <WineBar/>,
                                                    label: 'Capl'
                                                },
                                                show: '/capl/show/:id',
                                                edit: '/capl/edit/:id',
                                                create: '/capl/create'
                                            },
                                            {
                                                name: 'chats',
                                                list: '/chats',
                                                meta: {
                                                    icon: <ForumOutlined/>
                                                },
                                                show: '/chats/:userId/:institutionId'
                                            },
                                            {
                                                name: "profile",
                                                list: '/profile',
                                                meta: {
                                                    icon: <Person/>,
                                                    label: "Profile"
                                                },
                                                show: '/profile/show/:id',
                                                edit: '/profile/edit/:id'
                                            },
                                            {
                                                name: "all-users",
                                                list: '/all-users',
                                                meta: {
                                                    icon: <Group/>,
                                                    label: "All users"
                                                },
                                            },
                                            {
                                                name: "all-reviews",
                                                list: '/all-reviews',
                                                meta: {
                                                    icon: <Reviews/>,
                                                    label: "All reviews"
                                                },
                                            },
                                        ]}
                                        accessControlProvider={accessControlProvider}
                                        routerProvider={routerBindings}
                                        authProvider={authProvider}
                                        i18nProvider={i18nProvider}
                                        options={{
                                            syncWithLocation: true,
                                            liveMode: 'auto',
                                            warnWhenUnsavedChanges: true,
                                            reactQuery: {devtoolConfig: false},
                                        }}
                                    >
                                        <Routes>
                                            <Route
                                                element={
                                                    <Authenticated v3LegacyAuthProviderCompatible={true}
                                                                   fallback={<CatchAllNavigate to="/login"/>}>
                                                        <AppContextProvider>
                                                            <Layout Header={Header} Sider={Sider} Title={Title}>
                                                                <Outlet/>
                                                            </Layout>
                                                        </AppContextProvider>
                                                    </Authenticated>
                                                }
                                            >
                                                <Route
                                                    index
                                                    element={<NavigateToResource resource="home"/>}
                                                />
                                                <Route path="/home">
                                                    <Route index element={
                                                        <Home/>
                                                    }/>
                                                    <Route path={'update-city'}
                                                           element={
                                                               <CanAccess
                                                                   action={'cityWithData'}
                                                                   resource={'cities'}
                                                                   fallback={<ErrorComponent/>}
                                                               >
                                                                   <UpdateCity/>
                                                               </CanAccess>
                                                           }
                                                    />
                                                </Route>
                                                <Route path={'/notifications'}>
                                                    <Route index element={<Notifications/>}/>
                                                </Route>
                                                <Route path={'/all_institutions'}>
                                                    <Route index element={<AllEstablishments/>}/>
                                                    <Route
                                                        path="create"
                                                        element={
                                                            <CanAccess
                                                                action={"create"}
                                                                resource={"all_institutions"}
                                                                fallback={<ErrorComponent/>}
                                                            >
                                                                <CreateEstablishment/>
                                                            </CanAccess>
                                                        }
                                                    />
                                                    <Route
                                                        path="show/:id" element={<EstablishmentDetails/>}/>
                                                    <Route
                                                        path={'edit/:id'}
                                                        element={
                                                            <CanAccess
                                                                action={"edit"}
                                                                resource={"all_institutions"}
                                                                fallback={<ErrorComponent/>}
                                                            >
                                                                <EditEstablishment/>
                                                            </CanAccess>
                                                        }/>
                                                    <Route
                                                        path={'updateStatus/:id'}
                                                        element={
                                                            <CanAccess
                                                                action={"update_status"}
                                                                resource={"all_institutions"}
                                                                fallback={<ErrorComponent/>}
                                                            >
                                                                <EditUpdateStatus/>
                                                            </CanAccess>
                                                        }/>
                                                    <Route path={"menu/show/:id"} element={
                                                        <Menu/>
                                                    }/>
                                                    <Route path={"menu/edit/:id"} element={
                                                        <CanAccess
                                                            action={"edit"}
                                                            resource={"menu"}
                                                            fallback={<ErrorComponent/>}
                                                        >
                                                            <EditMenu/>
                                                        </CanAccess>
                                                    }/>
                                                    <Route path={'menu/create/:id'} element={
                                                        <CanAccess
                                                            action={'create'}
                                                            resource={'menu'}
                                                            fallback={<ErrorComponent/>}
                                                        >
                                                            <CreateMenu/>
                                                        </CanAccess>
                                                    }/>
                                                </Route>
                                                <Route path={"/news"}>
                                                    <Route index element={<News/>}/>
                                                    <Route
                                                        path="create"
                                                        element={
                                                            <CanAccess
                                                                action={"create"}
                                                                resource={"news"}
                                                                fallback={<ErrorComponent/>}
                                                            >
                                                                <CreateNews/>
                                                            </CanAccess>
                                                        }
                                                    />
                                                    <Route
                                                        path="show/:id" element={<DetailsNews/>}/>
                                                    <Route
                                                        path={'edit/:id'}
                                                        element={
                                                            <CanAccess
                                                                action={"edit"}
                                                                resource={"news"}
                                                                fallback={<ErrorComponent/>}
                                                            >
                                                                <EditNews/>
                                                            </CanAccess>
                                                        }/>
                                                </Route>
                                                <Route path={'/profile'}>
                                                    <Route index element={<Profile/>}/>
                                                    <Route path={'edit/:id'} element={
                                                        <CanAccess
                                                            action={"edit"}
                                                            resource={"profile"}
                                                            fallback={<ErrorComponent/>}
                                                        >
                                                            <EditProfile/>
                                                        </CanAccess>
                                                    }/>
                                                    <Route path={'show/:id'} element={
                                                        <CanAccess
                                                            action={"show"}
                                                            resource={"profile"}
                                                            fallback={<ErrorComponent/>}
                                                        >
                                                            <ShowUserInfo/>
                                                        </CanAccess>
                                                    }/>
                                                </Route>
                                                <Route path={'/chats'}>
                                                    <Route index element={<Chat/>}/>
                                                    <Route path={'show/:userId/:institutionId'} element={
                                                        <ShowChats/>
                                                    }/>
                                                </Route>
                                                <Route path={'/capl'}>
                                                    <Route index element={<Capl/>}/>
                                                    <Route path={'create'} element={<CreateReservation/>}/>
                                                    <Route path='show/:id' element={<DetailsReserve/>}/>
                                                    <Route path='edit/:id' element={<EditReserve/>}/>
                                                </Route>
                                                <Route path={'/all-reviews'}>
                                                    <Route index element={
                                                        <CanAccess
                                                            action={'list'}
                                                            resource={"all-reviews"}
                                                            fallback={<ErrorComponent/>}
                                                        >
                                                            <AllReviews/>
                                                        </CanAccess>
                                                    }/>
                                                </Route>
                                                <Route path={'/all-users'}>
                                                    <Route index element={
                                                        <CanAccess
                                                            action={'list'}
                                                            resource={"all-users"}
                                                            fallback={<ErrorComponent/>}
                                                        >
                                                            <AllUsers/>
                                                        </CanAccess>
                                                    }/>
                                                </Route>
                                                <Route path={'/top-institutions'}>
                                                    <Route index element={<TopInstitutions/>}/>
                                                </Route>
                                                <Route path={'/settings'}>
                                                    <Route index element={<Settings/>}/>
                                                </Route>
                                                <Route path="*" element={<ErrorComponent/>}/>
                                            </Route>
                                            <Route
                                                element={
                                                    <Authenticated v3LegacyAuthProviderCompatible={true}
                                                                   fallback={<Outlet/>}>
                                                        <NavigateToResource resource={'home'}/>
                                                    </Authenticated>
                                                }
                                            >
                                                <Route index element={<Welcome/>}/>
                                                <Route
                                                    path="/login"
                                                    element={
                                                        <Login/>
                                                    }
                                                />
                                                <Route
                                                    path='/welcome'
                                                    element={
                                                        <Welcome/>
                                                    }
                                                />
                                                <Route
                                                    path="/register"
                                                    element={
                                                        <Register/>
                                                    }
                                                />
                                                <Route
                                                    path="/forgot-password"
                                                    element={
                                                        <ForgotPassword/>
                                                    }
                                                />
                                                <Route
                                                    path="/update-password/:token"
                                                    element={
                                                        <UpdatePassword/>
                                                    }
                                                />

                                                <Route
                                                    path="/verifyNumber"
                                                    element={
                                                        <VerifyNumber/>
                                                    }
                                                />
                                            </Route>
                                            <Route
                                                element={
                                                    <Authenticated v3LegacyAuthProviderCompatible={true}>
                                                        <Layout Header={Header} Sider={Sider} Title={Title}>
                                                            <Outlet/>
                                                        </Layout>
                                                    </Authenticated>
                                                }
                                            >
                                                <Route path="*" element={<ErrorComponent/>}/>
                                            </Route>
                                        </Routes>

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
