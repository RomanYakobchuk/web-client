import {ErrorComponent} from "@refinedev/mui";
import {CanAccess} from "@refinedev/core";
import {Route} from "react-router-dom";

import {CREATE, EDIT, NEWS, SHOW} from "@/config/names";
import Create from "./create";
import Show from "./show";
import Edit from "./edit";
import News from "./news";

export const NewsRoutes = <Route path={`/${NEWS}`}>
    <Route index element={<News/>}/>
    <Route
        path={`${CREATE}`}
        element={
            <CanAccess
                action={`${CREATE}`}
                resource={`${NEWS}`}
                fallback={<ErrorComponent/>}
            >
                <Create/>
            </CanAccess>
        }
    />
    <Route
        path={`${SHOW}/:id`} element={<Show/>}/>
    <Route
        path={`${EDIT}/:id`}
        element={
            <CanAccess
                action={`${EDIT}`}
                resource={`${NEWS}`}
                fallback={<ErrorComponent/>}
            >
                <Edit/>
            </CanAccess>
        }/>
</Route>;
