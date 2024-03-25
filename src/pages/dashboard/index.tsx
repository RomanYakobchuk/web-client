import {ErrorComponent} from "@refinedev/mui";
import {CanAccess} from "@refinedev/core";
import {Route} from "react-router-dom";

import {CAPL, CREATE, DASHBOARD, ESTABLISHMENT, NEWS, REVIEWS, USER} from "@/config/names";
import AdminEstablishmentTable from "./properties/establishment/adminEstablishmentTable";
import AdminNewsTable from "./properties/news/adminNewsTable";
import CreateUser from "./properties/user/createUser";
import {Reviews} from "./properties/reviews/reviews";
import {CaplManagerPage} from "@/components";
import DashboardPage from "./dashboardPage";
import Users from "./properties/user/users";


export const DashboardRoutes = () => {
    return (
        <Route path={`/`} element={
            <CanAccess
                resource={`${DASHBOARD}`}
                fallback={<ErrorComponent/>}
                action={'list'}
            >
                <DashboardPage/>
            </CanAccess>
        }>
            <Route path={`${ESTABLISHMENT}`} element={<AdminEstablishmentTable/>}/>
            <Route path={`${USER}/${CREATE}`} element={<CreateUser/>}/>
            <Route path={`${NEWS}`} element={<AdminNewsTable/>}/>
            <Route index element={<Users/>}/>
            <Route path={`${REVIEWS}`} element={<Reviews/>}/>
            <Route path={`${CAPL}`} element={<CaplManagerPage/>}/>
        </Route>
    );
};

