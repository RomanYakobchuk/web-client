import {Outlet, Route, Routes} from "react-router-dom";
import {Authenticated, CanAccess} from "@refinedev/core";
import {CatchAllNavigate, NavigateToResource} from "@refinedev/react-router-v6";
import {ErrorComponent} from "@refinedev/mui";

import {AppContextProvider} from "@/contexts/AppContext";
import {Layout} from "@/layout/layout";
import {Header} from "@/layout/header";
import {Sider} from "@/layout/sider";
import {Title} from "@/layout/title";
import {DashboardPage} from "@/dashboard";
import AllUsers from "@/dashboard/properties/user/all-users";
import {
    AddFreeSeats,
    AllEstablishments, AllReviews,
    Capl,
    Chat,
    CreateEstablishment,
    CreateNews,
    CreateReservation,
    DetailsNews, DetailsReserve,
    EditEstablishment,
    EditNews,
    EditProfile, EditReserve,
    EditUserInfo,
    EstablishmentDetails, ForgotPassword,
    Home, Login,
    News,
    Notifications,
    Profile, Register, Settings,
    ShowFreeSeats, ShowNotification,
    ShowUserInfo, TopEstablishments,
    UpdateCity, UpdatePassword, VerifyNumber, Welcome
} from "@/pages";
import {
    CaplManagerPage,
    EstablishmentsAdminList,
    EstablishmentsUserList,
    NewsAdminList,
    ShowChats
} from "@/components";
import CreateUser from "@/dashboard/properties/user/createUser";
import {
    EDIT,
    SHOW,
    CREATE,
    NEWS,
    PROFILE,
    CAPL,
    HOME,
    CHATS,
    DASHBOARD,
    ESTABLISHMENT,
    SHOW_FREE_PLACES,
    ADD_FREE_PLACES,
    FORGOT_PASSWORD,
    UPDATE_PASSWORD,
    UPDATE_CITY,
    NOTIFICATIONS,
    WELCOME,
    ADMIN_LIST,
    SETTINGS,
    USER,
    VERIFY_NUMBER,
    REVIEWS,
    LOGIN,
    REGISTER,
    COMMENTS
} from "@/config/names";

const CaplRoutes = () => {

    return (
        <Routes>
            <Route
                element={
                    <Authenticated
                        appendCurrentPathToQuery={false}
                        key={'navigateToLogin'}
                        v3LegacyAuthProviderCompatible={true}
                        fallback={<CatchAllNavigate
                            to={`/${LOGIN}`}/>}>
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
                    element={<NavigateToResource resource={`${HOME}`}/>}
                />
                <Route path={`/${DASHBOARD}`} element={
                    <CanAccess
                        resource={`${DASHBOARD}`}
                        fallback={<ErrorComponent/>}
                        action={'list'}
                    >
                        <DashboardPage/>
                    </CanAccess>
                }>
                    <Route path={`${ESTABLISHMENT}`} element={<EstablishmentsAdminList/>}/>
                    <Route path={`${USER}/${CREATE}`} element={<CreateUser/>}/>
                    <Route path={`${NEWS}`} element={<NewsAdminList/>}/>
                    <Route index element={<AllUsers/>}/>
                    <Route path={`${REVIEWS}`} element={<AllReviews/>}/>
                    <Route path={`${CAPL}`} element={<CaplManagerPage/>}/>
                </Route>
                <Route path={`${HOME}`}>
                    <Route index element={
                        <Home/>
                    }/>
                    <Route path={`${UPDATE_CITY}`}
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
                <Route path={`/${NOTIFICATIONS}`}>
                    <Route index element={<Notifications/>}/>
                    <Route path={`${SHOW}/:id`} element={<ShowNotification/>}/>
                </Route>
                <Route path={`/${ESTABLISHMENT}`}>
                    <Route path={''} element={<AllEstablishments/>}>
                        <Route index element={<EstablishmentsUserList/>}/>
                        <Route path={`${ADMIN_LIST}`} element={
                            <CanAccess
                                resource={'establishments'}
                                action={'adminListEstablishments'}
                                fallback={<ErrorComponent/>}
                            >
                                <EstablishmentsAdminList/>
                            </CanAccess>
                        }/>
                        <Route path={`${ADMIN_LIST}/${CREATE}`}
                               element={<NavigateToResource resource={`${CREATE}`}/>}/>
                    </Route>
                    <Route
                        path={`${CREATE}`}
                        element={
                            <CanAccess
                                action={`${CREATE}`}
                                resource={`${ESTABLISHMENT}`}
                                fallback={<ErrorComponent/>}
                            >
                                <CreateEstablishment/>
                            </CanAccess>
                        }
                    />
                    <Route
                        path={`${SHOW}/:id`}>
                        <Route path={''} element={<EstablishmentDetails/>}>
                            <Route path={`${NEWS}`} element={<div>NEWS</div>}/>
                            <Route path={`${COMMENTS}`}
                                   element={<div>COMMENTS</div>}/>
                            <Route path={`${REVIEWS}`}
                                   element={<div>REVIEWS</div>}/>
                        </Route>
                        <Route path={`${SHOW_FREE_PLACES}`}
                               element={<ShowFreeSeats/>}/>
                        <Route path={`${ADD_FREE_PLACES}`} element={
                            <CanAccess
                                action={`${ADD_FREE_PLACES}`}
                                resource={`${ESTABLISHMENT}`}
                                fallback={<ErrorComponent/>}
                            >
                                <AddFreeSeats/>
                            </CanAccess>
                        }/>
                    </Route>
                    <Route
                        path={`${EDIT}/:id`}
                        element={
                            <CanAccess
                                action={`${EDIT}`}
                                resource={`${ESTABLISHMENT}`}
                                fallback={<ErrorComponent/>}
                            >
                                <EditEstablishment/>
                            </CanAccess>
                        }/>
                    {/*<Route*/}
                    {/*    path={'updateStatus/:id'}*/}
                    {/*    element={*/}
                    {/*        <CanAccess*/}
                    {/*            action={"update_status"}*/}
                    {/*            resource={"all_establishments"}*/}
                    {/*            fallback={<ErrorComponent/>}*/}
                    {/*        >*/}
                    {/*            <EditUpdateStatus/>*/}
                    {/*        </CanAccess>*/}
                    {/*    }/>*/}
                </Route>
                <Route path={`/${NEWS}`}>
                    <Route index element={<News/>}/>
                    <Route
                        path={`${CREATE}`}
                        element={
                            <CanAccess
                                action={`${CREATE}`}
                                resource={`${NEWS}`}
                                fallback={<ErrorComponent/>}
                            >
                                <CreateNews/>
                            </CanAccess>
                        }
                    />
                    <Route
                        path={`${SHOW}/:id`} element={<DetailsNews/>}/>
                    <Route
                        path={`${EDIT}/:id`}
                        element={
                            <CanAccess
                                action={`${EDIT}`}
                                resource={`${NEWS}`}
                                fallback={<ErrorComponent/>}
                            >
                                <EditNews/>
                            </CanAccess>
                        }/>
                </Route>
                <Route path={`/${PROFILE}`}>
                    <Route index element={<Profile/>}/>
                    <Route
                        path={`${EDIT}`}>
                        <Route index element={<EditProfile/>}/>
                        <Route path={':id'} element={
                            <CanAccess
                                action={`${EDIT}`}
                                resource={"profileUser"}
                                fallback={<ErrorComponent/>}
                            >
                                <EditUserInfo/>
                            </CanAccess>
                        }/>
                    </Route>
                    <Route path={`${SHOW}/:id`} element={
                        <CanAccess
                            action={`${SHOW}`}
                            resource={`${PROFILE}`}
                            fallback={<ErrorComponent/>}
                        >
                            <ShowUserInfo/>
                        </CanAccess>
                    }/>
                </Route>
                <Route path={`/${CHATS}`}>
                    <Route index element={<Chat/>}/>
                    <Route path={`${SHOW}/:userId/:establishmentId`} element={
                        <ShowChats/>
                    }/>
                </Route>
                <Route path={`/${CAPL}`}>
                    <Route index element={<Capl/>}/>
                    <Route path={`${CREATE}`} element={<CreateReservation/>}/>
                    <Route path={`${SHOW}/:id`} element={<DetailsReserve/>}/>
                    <Route path={`${EDIT}/:id`} element={<EditReserve/>}/>
                </Route>
                <Route path={'/top-establishments'}>
                    <Route index element={<TopEstablishments/>}/>
                </Route>
                <Route path={`/${SETTINGS}`}>
                    <Route index element={<Settings/>}/>
                </Route>
                <Route path="*" element={<ErrorComponent/>}/>
            </Route>
            <Route
                element={
                    <Authenticated
                        appendCurrentPathToQuery={false}
                        key={'navigateToHome'}
                        v3LegacyAuthProviderCompatible={true}
                        fallback={<Outlet/>}>
                        <NavigateToResource resource={`${HOME}`}/>
                    </Authenticated>
                }
            >
                <Route index element={<Welcome/>}/>
                <Route
                    path={`/${LOGIN}`}
                    element={
                        <Login/>
                    }
                />
                <Route
                    path={`/${WELCOME}`}
                    element={
                        <Welcome/>
                    }
                />
                <Route
                    path={`/${REGISTER}`}
                    element={
                        <Register/>
                    }
                />
                <Route
                    path={`/${FORGOT_PASSWORD}`}
                    element={
                        <ForgotPassword/>
                    }
                />
                <Route
                    path={`/${UPDATE_PASSWORD}`}
                    element={
                        <UpdatePassword/>
                    }
                />

                <Route
                    path={`/${VERIFY_NUMBER}`}
                    element={
                        <VerifyNumber/>
                    }
                />
            </Route>
            <Route
                element={
                    <Authenticated
                        appendCurrentPathToQuery={false}
                        key={'navigateToPage'}
                        v3LegacyAuthProviderCompatible={true}>
                        <Layout Header={Header} Sider={Sider} Title={Title}>
                            <Outlet/>
                        </Layout>
                    </Authenticated>
                }
            >
                <Route path="*" element={<ErrorComponent/>}/>
            </Route>
        </Routes>
        // </AnimatePresence>
    );
};
export default CaplRoutes
