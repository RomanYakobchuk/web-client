import {RefineKbar, RefineKbarProvider} from "@refinedev/kbar";
import {Refine, Authenticated, I18nProvider, CanAccess} from "@refinedev/core";
import {BrowserRouter, Route, Routes, Outlet} from "react-router-dom";

import React, {useEffect} from "react";

import {
    AllEstablishments,
    Capl,
    EstablishmentDetails,
    CreateEstablishment,
    EditEstablishment,
    EditUserInfo,
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
    UpdateCity, AddFreeSeats, ShowFreeSeats, EditProfile
} from "./pages";
import {
    Loading, EditUpdateStatus, ShowChats
} from "./components";
import {accessControlProvider} from "./accessControlProvider";
import {Header, Title, Layout, Sider} from "./layout";
import {
    ErrorComponent,
    RefineSnackbarProvider,
} from "@refinedev/mui";
import {useNotificationProvider} from "@refinedev/antd"
import {CssBaseline, GlobalStyles} from "@mui/material";
import routerBindings, {
    CatchAllNavigate,
    NavigateToResource,
    UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {useTranslation} from "react-i18next";

import {ColorModeContextProvider} from "./contexts";
import {authProvider, axiosInstance} from "./authProvider";
import {useRole} from "./hook";
import {socket} from './socketClient'
import {SchemaProvider} from "./settings/schema";
import {VariantProvider} from "./settings/variantEstablishment";
import {AppContextProvider} from "./contexts/AppContext";
import {ModalCaplContextProvider} from "./contexts/ModalCaplContext";
import {resources} from "./resources";
// import {axiosInstance as aI} from "@refinedev/simple-rest/src/utils/axios";
import {CommentCreatorDataProvider} from "./contexts/CommentCreatorDataContext";


const API_URL = import.meta.env.VITE_APP_API;
const STATISTIC_API_URL = import.meta.env.VITE_APP_STATISTIC_API;
const clientId = `${import.meta.env.VITE_APP_GOOGLE_CLIENT_ID}`;

function App() {
    const {t, i18n} = useTranslation();

    const {role, userId} = useRole();
    const notificationProvider = useNotificationProvider();

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
                {/*<DevtoolsPanel/>*/}
                <ModalCaplContextProvider>
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
                                                statistics: dataProvider(`${STATISTIC_API_URL}/statistics_api/v1`)
                                            }}
                                            notificationProvider={notificationProvider}
                                            resources={resources}
                                            accessControlProvider={accessControlProvider}
                                            routerProvider={routerBindings}
                                            authProvider={authProvider}
                                            i18nProvider={i18nProvider}
                                            options={{
                                                syncWithLocation: true,
                                                liveMode: 'auto',
                                                warnWhenUnsavedChanges: true,
                                            }}
                                        >
                                            <CommentCreatorDataProvider>
                                                <Routes>
                                                    <Route
                                                        element={
                                                            <Authenticated v3LegacyAuthProviderCompatible={true}
                                                                           fallback={<CatchAllNavigate
                                                                               to="/login"/>}>
                                                                <AppContextProvider>
                                                                    <Layout Header={Header} Sider={Sider}
                                                                            Title={Title}>
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
                                                                path="show/:id">
                                                                <Route path={''} element={<EstablishmentDetails/>}>
                                                                    <Route path="news" element={<div>NEWS</div>}/>
                                                                    <Route path="comments"
                                                                           element={<div>COMMENTS</div>}/>
                                                                    <Route path="reviews"
                                                                           element={<div>REVIEWS</div>}/>
                                                                </Route>
                                                                <Route path={'show_free_places'}
                                                                       element={<ShowFreeSeats/>}/>
                                                                <Route path={'add_free_places'} element={
                                                                    <CanAccess
                                                                        action={'add_free_places'}
                                                                        resource={'all_institutions'}
                                                                        fallback={<ErrorComponent/>}
                                                                    >
                                                                        <AddFreeSeats/>
                                                                    </CanAccess>
                                                                }/>
                                                            </Route>
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
                                                            <Route
                                                                path={'edit'}>
                                                                <Route index element={<EditProfile/>}/>
                                                                <Route path={':id'} element={
                                                                    <CanAccess
                                                                        action={"edit"}
                                                                        resource={"profileUser"}
                                                                        fallback={<ErrorComponent/>}
                                                                    >
                                                                        <EditUserInfo/>
                                                                    </CanAccess>
                                                                }/>
                                                            </Route>
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
                                                            path="/update-password"
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
                                            </CommentCreatorDataProvider>
                                            <RefineKbar/>
                                            <UnsavedChangesNotifier/>
                                        </Refine>
                                    </RefineSnackbarProvider>
                                </VariantProvider>
                            </GoogleOAuthProvider>
                        </SchemaProvider>
                    </ColorModeContextProvider>
                </ModalCaplContextProvider>
            </RefineKbarProvider>
        </BrowserRouter>
    );
}

export default App;
