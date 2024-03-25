import {Route} from "react-router-dom";

import {NOTIFICATIONS, SHOW} from "@/config/names";
import Notifications from "./notifications";
import Show from "./show";

export const NotificationRoutes = <Route path={`/${NOTIFICATIONS}`}>
    <Route index element={<Notifications/>}/>
    <Route path={`${SHOW}/:id`} element={<Show/>}/>
</Route>;

