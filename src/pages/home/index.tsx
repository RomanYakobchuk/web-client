import {ErrorComponent} from "@refinedev/mui";
import {CanAccess} from "@refinedev/core";
import {Route} from "react-router-dom";

import {HOME, UPDATE_CITY} from "@/config/names";
import UpdateCity from "./update-city";
import Home from "./home";

export const HomeRoutes = <Route path={`${HOME}`}>
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
</Route>;

