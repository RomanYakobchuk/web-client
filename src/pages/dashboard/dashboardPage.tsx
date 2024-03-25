import {Box} from "@mui/material";

import {usePermissions, useTranslate} from "@refinedev/core";
import {Link, Outlet, useLocation} from "react-router-dom";
import React from "react";

const DashboardPage = () => {
    const {data: role} = usePermissions();
    const {pathname} = useLocation();
    const translate = useTranslate();
    return (
        <Box sx={{
            p: "10px",
            display: 'flex',
            flexDirection: 'column',
            gap: 2
        }}>
            <Box>
                {
                    role === 'admin' &&
                    <Box sx={{
                        width: 'fit-content',
                        display: 'flex',
                        flexDirection: 'row',
                        // gap: {xs: 1, md: 2},
                        "& a": {
                            textDecoration: 'none',
                        },
                        flexWrap: 'wrap'
                    }}>
                        {
                            [
                                // {
                                //     link: '/dashboard',
                                //     title: 'news.sortByCategory.general',
                                //     isCustomTitle: true
                                // },
                                {
                                    link: '/dashboard',
                                    title: 'all-users',
                                    isCustomTitle: false
                                },
                                {
                                    link: '/dashboard/establishment',
                                    title: 'home'
                                },
                                {
                                    link: '/dashboard/news',
                                    title: 'news'
                                },
                                {
                                    link: '/dashboard/capl',
                                    title: 'all-capl'
                                },
                                {
                                    link: '/dashboard/reviews',
                                    title: 'all-reviews'
                                }
                            ]?.map((item, index) => (
                                <Box
                                    sx={{
                                        m: '8px 4px',
                                        "& a": {
                                            p: '8px 12px',
                                            bgcolor: pathname === item?.link ? 'info.main' : 'primary.main',
                                            borderRadius: '7px',
                                            fontSize: {xs: '14px', md: '16px'},
                                            textDecoration: 'none',
                                            color: pathname === item?.link ? '#fff' : 'common.white',
                                            transition: '200ms linear',
                                            "&:hover": {
                                                color: '#fff',
                                                bgcolor: 'info.main',
                                            }
                                        }
                                    }}
                                    key={index}
                                >
                                    <Link to={item?.link}>
                                        {translate(item?.isCustomTitle ? `${item?.title}` : `${item?.title}.title`)}
                                    </Link>
                                </Box>
                            ))
                        }
                        {/*<Button color={showUserList ? 'info' : 'inherit'}*/}
                        {/*        onClick={() => setShowUserList(true)}>UserList</Button>*/}
                        {/*<Button color={showUserList ? 'inherit' : 'info'}*/}
                        {/*        onClick={() => setShowUserList(false)}>AdminNewsTable</Button>*/}
                    </Box>
                }
            </Box>
            <Outlet/>
        </Box>
    );
};
export default DashboardPage
