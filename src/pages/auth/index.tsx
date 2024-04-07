import {NavigateToResource} from "@refinedev/react-router-v6";
import {Outlet, Route} from "react-router-dom";
import {Authenticated} from "@refinedev/core";

import {FORGOT_PASSWORD, HOME, LOGIN, REGISTER, UPDATE_PASSWORD, VERIFY_NUMBER, WELCOME} from "@/config/names";
import ForgotPassword from "./forgotPassword";
import UpdatePassword from "./updatePassword";
import VerifyNumber from "./verifyNumber";
import Register from "./register";
import Welcome from "./welcome";
import Login from "./login";

export const AuthRoutes = <Route
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
        path={`/${VERIFY_NUMBER}/:token?`}
        element={
            <VerifyNumber/>
        }
    />
</Route>;