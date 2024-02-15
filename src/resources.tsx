import {
    Apartment, DashboardOutlined,
    ForumOutlined,
    Home as HomeIcon,
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
            icon: <HomeIcon/>,
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
            icon: <ForumOutlined/>
        },
        show: `/${CHATS}/:userId/:establishmentId`
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
];

export {
    resources
};