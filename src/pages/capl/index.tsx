import {Route} from "react-router-dom";

import {CAPL, CREATE, EDIT, SHOW} from "@/config/names";
import Create from "./create";
import Edit from "./edit";
import Show from "./show";
import Capl from "./capl";


export const CaplRoutes = <Route path={`/${CAPL}`}>
    <Route index element={<Capl/>}/>
    <Route path={`${CREATE}`} element={<Create/>}/>
    <Route path={`${SHOW}/:id`} element={<Show/>}/>
    <Route path={`${EDIT}/:id`} element={<Edit/>}/>
</Route>;