import {NavigateToResource} from "@refinedev/react-router-v6";
import {ErrorComponent} from "@refinedev/mui";
import {CanAccess} from "@refinedev/core";
import {Route, Routes} from "react-router-dom";

import {EstablishmentsUserList} from "@/components";
import UpdateFreeSeats from "./updateFreeSeats";
import Establishments from "./establishments";
import ShowFreeSeats from "./showFreeSeats";
import AddFreeSeats from "./addFreeSeats";
import Create from "./create";
import Show from "./show";
import Edit from "./edit";
import {
    ADD_FREE_PLACES,
    ADMIN_LIST,
    COMMENTS,
    CREATE, EDIT,
    ESTABLISHMENT,
    NEWS,
    REVIEWS,
    SHOW,
    SHOW_FREE_PLACES
} from "@/config/names";
import AdminEstablishmentTable from "@/pages/dashboard/properties/establishment/adminEstablishmentTable";

export const EstablishmentRoutes = <Route path={`/${ESTABLISHMENT}`}>
    <Route path={''} element={<Establishments/>}>
        <Route index element={<EstablishmentsUserList/>}/>
        <Route path={`${ADMIN_LIST}`} element={
            <CanAccess
                resource={'establishments'}
                action={'adminListEstablishments'}
                fallback={<ErrorComponent/>}
            >
                <AdminEstablishmentTable/>
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
                <Create/>
            </CanAccess>
        }
    />
    <Route
        path={`${SHOW}/:id`}>
        <Route path={''} element={<Show/>}>
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
                <Edit/>
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
</Route>;

