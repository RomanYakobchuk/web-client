import {ErrorComponent} from "@refinedev/mui";
import {CanAccess} from "@refinedev/core";
import {Route} from "react-router-dom";

import {EDIT, PROFILE, SHOW} from "@/config/names";
import EditUserInfo from "./edit-user-info";
import EditProfile from "./editProfile";
import Profile from "./profile";
import Show from "./show";

export const ProfileRoutes = <Route path={`/${PROFILE}`}>
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
            <Show/>
        </CanAccess>
    }/>
</Route>;

