import React, {useContext, useEffect} from "react";
import {LayoutProps, useNotification} from "@refinedev/core";
import {Box} from "@mui/material";
import {Outlet, useNavigate} from "react-router-dom";

import {Sider as DefaultSider} from "../sider";
import {Header as DefaultHeader} from "../header";
import {Footer as DefaultFooter} from "../footer";
import {useMobile, useUserInfo, useUserProperties} from "@/hook";
import {useSchema} from "@/settings";
import {SchemaContext} from "@/settings/schema";
import {ColorModeContext} from "@/contexts";

import "../layout.css";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from 'dayjs/plugin/timezone';

import {useTranslation} from "react-i18next";

import "dayjs/locale/uk";
import "dayjs/locale/en";
import {socket} from "@/socketClient";
import {INotification} from "@/interfaces/common";

dayjs.extend(utc);
dayjs.extend(timezone);


export const Layout: React.FC<LayoutProps> = ({
                                                  Sider,
                                                  Header,
                                                  Footer,
                                                  OffLayoutArea,
                                              }) => {
    const SiderToRender = Sider ?? DefaultSider;
    const HeaderToRender = Header ?? DefaultHeader;
    const FooterToRender = Footer ?? DefaultFooter;

    const {i18n} = useTranslation();
    const {properties, setProperties} = useUserProperties();
    const {schema} = useContext(SchemaContext);
    const {device, width} = useMobile();
    const {styles} = useSchema();
    const {user} = useUserInfo();
    const {mode} = useContext(ColorModeContext);
    const {open, close} = useNotification();
    const navigate = useNavigate();

    useEffect(() => {

        socket?.on('newNotification', (notification: INotification) => {
            open?.({
                type: 'success',
                message: 'New notification',
                description: notification?.message
            })
            setProperties({...properties, notReadNotifications: properties?.notReadNotifications + 1})
        })
    }, [socket, properties]);

    useEffect(() => {
        if (user?._id) {
            socket.connect();
            socket.on('connect', () => {
            });
            socket?.emit("addUser", user?._id);
        }
        return () => {
            socket.off('addUser')
            socket.off('connect')
        }
    }, [user?._id, socket]);

    const someStyle = !device ? {
        '&::-webkit-scrollbar': {
            width: '10px',
            bgcolor: 'transparent',
            borderRadius: '5px'
        },
        '&::-webkit-scrollbar-track': {
            'webkitBoxShadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',
            outline: '1px solid slategrey',
            bgcolor: 'steelblue',
            borderRadius: '5px',
        }
    } : {};

    useEffect(() => {
        if (!user?.phone || !user?.dOB) {
            open?.({
                type: 'error',
                message: 'Add date of birth and/or phone number for verify your account',
                description: 'Profile',
                key: 'add_dOB_phone',
                cancelMutation: () => {
                    close?.('add_dOB_phone')
                }
            })
            navigate(`/profile/edit`)
        }
    }, [user?.phone, user?._id, user?.dOB, window.location.href]);

    // const ref = useScrollRestoration(window.location.href);

    useEffect(() => {
        i18n.language === "ua" ? dayjs.locale('uk') : dayjs.locale('en')
    }, [i18n.language, dayjs]);

    return (
        <Box
            display="flex" flexDirection="row"
            sx={{
                margin: styles.marginS,
                height: '100%',
            }}>
            <SiderToRender/>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    scrollBehavior: 'smooth',
                    gap: styles.gapS,
                    height: '100%',
                }}
            >
                {
                    schema !== 'schema_1' && (
                        <HeaderToRender/>
                    )
                }
                <Box
                    // ref={ref}
                    component="main"
                    id={'mainLayout'}
                    sx={{
                        height: styles.heightLayoutS,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        borderRadius: styles.borderRadiusS,
                        // background: 'rgb(85,84,107)',
                        backgroundSize: '300% 300%',
                        backgroundImage: mode === 'dark'
                            ? 'radial-gradient(circle, rgba(32,31,47,1) 0%, rgba(58,58,65,1) 20%, rgba(82,79,98,1) 40%, rgba(55,52,73,1) 60%, rgba(66,62,78,1) 80%, rgba(31,30,33,1) 100%)'
                            // ? 'linear-gradient(180deg, rgba(32,31,47,1) 0%, rgba(58,58,65,1) 20%, rgba(82,79,98,1) 40%, rgba(55,52,73,1) 60%, rgba(66,62,78,1) 80%, rgba(31,30,33,1) 100%)'
                            : 'radial-gradient(circle, rgba(249,249,249,1) 0%, rgb(158 185 235) 20%, rgba(235,234,242,1) 40%, rgb(157 188 227) 60%, rgba(237,233,244,1) 80%, rgba(234,232,237,1) 100%)',
                        // : 'linear-gradient(180deg, rgba(249,249,249,1) 0%, rgba(236,236,245,1) 20%, rgba(235,234,242,1) 40%, rgba(246,246,246,1) 60%, rgba(237,233,244,1) 80%, rgba(234,232,237,1) 100%)',
                        // WebkitAnimation: 'bgcolorGradientAnimation320s ease infinite',
                        // MozAnimation: 'bgcolorGradientAnimation 30s ease infinite',
                        // animation: 'bgcolorGradientAnimation 30s ease infinite',
                        ...someStyle,
                        // WebkitOverflowScrolling: 'touch'
                        // paddingTop: schema === 'schema_1' ? '80px' : '0',
                        "& div.MuiInputBase-root": {
                            borderRadius: '7px',
                            color: 'common.white',
                            "&::placeholder": {
                                color: 'silver'
                            },
                            "& > fieldset": {
                                borderColor: `${mode === 'dark' ? '#fff' : '#000'} !important`
                            }
                        },
                        "& .ant-select-auto-complete input": {
                            borderColor: 'common.white'
                        },
                        '& label': {
                            color: 'secondary.main',
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'common.white',
                            },
                            '&:hover fieldset': {
                                borderColor: 'common.white',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'common.white',
                            },
                        },
                        "& label, & label.Mui-focused": {
                            color: 'common.white'
                        },
                        "& *:not(button).Mui-disabled": {
                            WebkitTextFillColor: '#514f4f !important'
                        },
                        "& div.w-md-editor-input": {
                            width: '100%',
                            height: 'fit-content'
                        },
                        "& div.w-md-editor-preview": {
                            position: 'relative',
                            width: '100%',
                            whiteSpaceCollapse: 'break-spaces'
                        },
                        "& div.w-md-editor": {
                            minHeight: '250px !important'
                        }
                    }}
                >
                    {
                        schema === 'schema_1' && (
                            <HeaderToRender/>
                        )
                    }
                    {/*<ScrollManager/>*/}
                    <Outlet/>
                    <FooterToRender/>
                    {/*<ModalWindow*/}
                    {/*    open={openModal}*/}
                    {/*    setOpen={setOpenModal}*/}
                    {/*    title={*/}
                    {/*        <Box>List items</Box>*/}
                    {/*    }*/}
                    {/*>*/}
                    {/*    Content*/}
                    {/*</ModalWindow>*/}
                </Box>
            </Box>
            {OffLayoutArea && <OffLayoutArea/>}
        </Box>
    );
};
