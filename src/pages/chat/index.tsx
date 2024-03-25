import {Navigate, Route} from "react-router-dom";

import {CHATS, CREATE, SHOW} from "@/config/names";
import Chat from "./chat";
import Create from "./create";

export const ChatRoutes = <Route path={`/${CHATS}`}>
        <Route index  element={<Navigate to={`${SHOW}`}/>}/>
        {/*<Route path={''} element={<Navigate to={`${SHOW}`}/>}/>*/}
        <Route path={`${CREATE}`} element={<Create/>}/>
        <Route path={`${SHOW}/:conversationId?`} element={<Chat/>}/>
        {/*<Route path={`${SHOW}/:userId/:establishmentId`} element={<ShowChats/>}/>*/}
    </Route>
;

