import {Outlet, Route, Routes} from "react-router-dom";
import {Authenticated} from "@refinedev/core";
import {CatchAllNavigate, NavigateToResource} from "@refinedev/react-router-v6";
import {ErrorComponent} from "@refinedev/mui";

import {AppContextProvider} from "@/contexts/AppContext";
import {Layout} from "@/layout/layout";
import {Header} from "@/layout/header";
import {Sider} from "@/layout/sider";
import {Title} from "@/layout/title";


import {
    HOME,
    SETTINGS,
    LOGIN, DASHBOARD
} from "@/config/names";

import TopEstablishments from "./pages/other/topEstablishments";
import {EstablishmentRoutes} from "@/pages/establishment";
import {NotificationRoutes} from "@/pages/notification";
import {DashboardRoutes} from "@/pages/dashboard";
import {Calendar} from "@/pages/test/calendar";
import {TestPage} from "@/pages/test/testPage";
import {ProfileRoutes} from "@/pages/profile";
import Settings from "@/pages/other/settings";
import {AuthRoutes} from "@/pages/auth";
import {CaplRoutes} from "@/pages/capl";
import {NewsRoutes} from "@/pages/news";
import {ChatRoutes} from "@/pages/chat";
import {HomeRoutes} from "@/pages/home";

const AppRoutes = () => {

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
                <Route path={`/${DASHBOARD}`} element={<DashboardRoutes/>}/>
                <Route path={'test'} element={<TestPage/>}>
                    <Route path={'calendar'} element={<Calendar/>}/>
                </Route>
                {HomeRoutes}
                {NotificationRoutes}
                {EstablishmentRoutes}
                {NewsRoutes}
                {ProfileRoutes}
                {ChatRoutes}
                {CaplRoutes}
                <Route path={'/top-establishments'}>
                    <Route index element={<TopEstablishments/>}/>
                </Route>
                <Route path={`/${SETTINGS}`}>
                    <Route index element={<Settings/>}/>
                </Route>
                <Route path="*" element={<ErrorComponent/>}/>
            </Route>
            {AuthRoutes}
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
    )
        ;
};
export default AppRoutes
