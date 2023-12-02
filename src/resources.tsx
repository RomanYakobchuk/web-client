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

const resources = [
    {
        name: 'dashboard',
        list: '/dashboard',
        meta: {
            label: 'dashboard/user',
            icon: <DashboardOutlined/>
        },
    },
    {
        name: "home",
        meta: {
            icon: <HomeIcon/>,
        },
        list: '/home',
        show: '/home/show/:id',
        create: '/home/create',
        edit: '/home/edit/:id',
    },
    {
        name: "all_institutions",
        meta: {
            icon: <Apartment/>,
            canDelete: true,
        },
        list: '/all_institutions',
        show: '/all_institutions/show/:id',
        create: '/all_institutions/create',
        edit: '/all_institutions/edit/:id',
    },
    {
        name: "news",
        meta: {
            icon: <NewspaperOutlined/>,
        },
        list: '/news',
        show: '/news/show/:id',
        create: '/news/create',
        edit: '/news/edit/:id',
    },
    {
        name: "top-institutions",
        list: '/top-institutions',
        meta: {
            icon: <Star/>,
            label: "Top Institutions"
        },
        show: '/top-institutions/show/:id',
    },
    {
        name: "capl",
        list: '/capl',
        meta: {
            icon: <WineBar/>,
            label: 'Capl'
        },
        show: '/capl/show/:id',
        edit: '/capl/edit/:id',
        create: '/capl/create'
    },
    {
        name: 'chats',
        list: '/chats',
        meta: {
            icon: <ForumOutlined/>
        },
        show: '/chats/:userId/:institutionId'
    },
    {
        name: "profile",
        list: '/profile',
        meta: {
            icon: <Person/>,
            label: "Profile"
        },
        show: '/profile/show/:id',
        edit: '/profile/edit'
    },
];

export {
    resources
};