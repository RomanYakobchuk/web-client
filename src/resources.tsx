import {
    Apartment, DashboardOutlined,
    ForumOutlined,
    HomeRounded,
    NewspaperOutlined,
    Person,
    Star,
    WineBar
} from "@mui/icons-material";
import React from "react";

import {DASHBOARD, CHATS, HOME, CAPL, PROFILE, SHOW, NEWS, EDIT, CREATE, ESTABLISHMENT} from "@/config/names";

const resources = [
    {
        name: `${DASHBOARD}`,
        list: `/${DASHBOARD}`,
        meta: {
            label: `${DASHBOARD}/user`,
            icon: <DashboardOutlined/>
        },
    },
    {
        name: `${HOME}`,
        meta: {
            icon: <HomeRounded/>,
        },
        list: `/${HOME}`,
        show: `/${HOME}/${SHOW}/:id`,
        create: `/${HOME}/${CREATE}`,
        edit: `/${HOME}/${EDIT}/:id`,
    },
    {
        name: `${ESTABLISHMENT}`,
        meta: {
            icon: <Apartment/>,
            canDelete: true,
        },
        list: `/${ESTABLISHMENT}`,
        show: `/${ESTABLISHMENT}/${SHOW}/:id`,
        create: `/${ESTABLISHMENT}/${CREATE}`,
        edit: `/${ESTABLISHMENT}/${EDIT}/:id`,
    },
    {
        name: `${NEWS}`,
        meta: {
            icon: <NewspaperOutlined/>,
        },
        list: `/${NEWS}`,
        show: `/${NEWS}/${SHOW}/:id`,
        create: `/${NEWS}/${CREATE}`,
        edit: `/${NEWS}/${EDIT}/:id`,
    },
    {
        name: "top-establishments",
        list: '/top-establishments',
        meta: {
            icon: <Star/>,
            label: "Top establishments"
        },
        show: '/top-establishments/show/:id',
    },
    {
        name: `${CAPL}`,
        list: `/${CAPL}`,
        meta: {
            icon: <WineBar/>,
            label: `${CAPL}`
        },
        show: `/${CAPL}/${SHOW}/:id`,
        edit: `/${CAPL}/${EDIT}/:id`,
        create: `/${CAPL}/${CREATE}`
    },
    {
        name: `${CHATS}`,
        list: `/${CHATS}`,
        meta: {
            icon: <ForumOutlined/>,
        },
        create: `/${CHATS}/${CREATE}`,
        show: `/${CHATS}/${SHOW}/:conversationId?`
    },
    {
        name: `${PROFILE}`,
        list: `/${PROFILE}`,
        meta: {
            icon: <Person/>,
            label: `${PROFILE}`
        },
        show: `/${PROFILE}/${SHOW}/:id`,
        edit: `/${PROFILE}/${EDIT}`
    },
    {
        name: 'test',
        list: '/test',
        meta: {
            icon: <></>
        }
    }
];

export {
    resources
};