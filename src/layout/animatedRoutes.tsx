import React from "react";
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
    ShowUserInfo, TopInstitutions,
    UpdateCity, UpdatePassword, VerifyNumber, Welcome
} from "@/pages";
import {
    CaplManagerPage,
    InstitutionsAdminList,
    InstitutionsUserList,
    NewsAdminList,
    ShowChats
} from "@/components";
import CreateUser from "@/dashboard/properties/user/createUser";

// import {AnimatePresence} from "framer-motion";

const AnimatedRoutes = () => {
    return (
        // <AnimatePresence>
        <Routes>
            <Route
                element={
                    <Authenticated
                        key={'navigateToLogin'}
                        v3LegacyAuthProviderCompatible={true}
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
                <Route path={'/dashboard'} element={
                    <CanAccess
                        resource={'dashboard'}
                        fallback={<ErrorComponent/>}
                        action={'list'}
                    >
                        <DashboardPage/>
                    </CanAccess>
                }>
                    {/*<Route index element={<General/>}/>*/}
                    {/*<Route index element={<NavigateToResource resource={"dashboard"}/>}/>*/}
                    <Route path={'establishment'} element={<InstitutionsAdminList/>}/>
                    <Route path={'user/create'} element={<CreateUser/>}/>
                    <Route path={'news'} element={<NewsAdminList/>}/>
                    <Route index element={<AllUsers/>}/>
                    <Route path={'reviews'} element={<AllReviews/>}/>
                    <Route path={'capl'} element={<CaplManagerPage/>}/>
                </Route>
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
                    <Route path={'show/:id'} element={<ShowNotification/>}/>
                </Route>
                <Route path={'/all_institutions'}>
                    <Route path={''} element={<AllEstablishments/>}>
                        <Route index element={<InstitutionsUserList/>}/>
                        <Route path={'adminList'} element={
                            <CanAccess
                                resource={'institutions'}
                                action={'adminListInstitutions'}
                                fallback={<ErrorComponent/>}
                            >
                                <InstitutionsAdminList/>
                            </CanAccess>
                        }/>
                        <Route path={'adminList/create'}
                               element={<NavigateToResource resource={'create'}/>}/>
                    </Route>
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
                    {/*<Route*/}
                    {/*    path={'updateStatus/:id'}*/}
                    {/*    element={*/}
                    {/*        <CanAccess*/}
                    {/*            action={"update_status"}*/}
                    {/*            resource={"all_institutions"}*/}
                    {/*            fallback={<ErrorComponent/>}*/}
                    {/*        >*/}
                    {/*            <EditUpdateStatus/>*/}
                    {/*        </CanAccess>*/}
                    {/*    }/>*/}
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
                    <Authenticated
                        key={'navigateToHome'}
                        v3LegacyAuthProviderCompatible={true}
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
                    <Authenticated
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
export default AnimatedRoutes
