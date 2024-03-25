import React, {useContext, useEffect} from "react";
import {LayoutProps, useNotification} from "@refinedev/core";
import {Box} from "@mui/material";
import {Outlet, useLocation, useNavigate} from "react-router-dom";

import {Sider as DefaultSider} from "../sider";
import {Header as DefaultHeader} from "../header";
import {Footer as DefaultFooter} from "../footer";
import {useMobile, useScrollRestoration, useUserInfo, useUserProperties} from "@/hook";
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
import {CreateUniqueIndicator} from "@/components/chats/create/createUniqueIndicator";
import {FloatButton} from "antd";
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import {CAPL, CHATS, CREATE} from "@/config/names";

import {SolarSystem} from "@/layout/layout/solarSystem";

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
    const {device} = useMobile();
    const {styles} = useSchema();
    const {user} = useUserInfo();
    const {mode, collapsed} = useContext(ColorModeContext);
    const {open, close} = useNotification();
    const navigate = useNavigate();
    const {pathname} = useLocation();

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
            const handleConnect = () => {
                socket.emit("addUser", user?._id);
            };

            socket.connect();
            socket.on('connect', handleConnect);
            handleConnect();

            return () => {
                socket.off('addUser');
                socket.off('connect');
            };
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

    useEffect(() => {
        if (!user?.uniqueIndicator?.value && !properties?.isShowUserDontHaveUniqueIndicator) {
            setProperties({...properties, isShowUserDontHaveUniqueIndicator: true});
        }
    }, [properties?.isShowUserDontHaveUniqueIndicator, user?.uniqueIndicator?.value]);

    const ref = useScrollRestoration(window.location.pathname);

    useEffect(() => {
        i18n.language === "ua" ? dayjs.locale('uk') : dayjs.locale('en')
    }, [i18n.language, dayjs]);

    const handleNavigate = () => {
        navigate(`/${CAPL}/${CREATE}`)
    }
    const currentPathName = pathname?.split('/')[1];

    return (
        <Box
            display="flex" flexDirection="row"
            sx={{
                padding: styles?.marginS,
                height: '100%',
            }}>
            <SiderToRender/>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    scrollBehavior: 'smooth',
                    gap: styles?.gapS,
                    height: '100%',
                    position: 'relative',
                    bgcolor: 'common.black',
                }}
            >
                {
                    schema !== 'schema_1' && (
                        <HeaderToRender/>
                    )
                }
                <SolarSystem timer={1000 * 60 * 5} speed={2}/>
                <Box
                    ref={ref}
                    component="main"
                    id={'mainLayout'}
                    sx={{
                        position: 'relative',
                        maxWidth: {xs: '100vw', md: `calc(${collapsed ? '100vw - 64px' : '100vw - 200px'})`},
                        height: styles.heightLayoutS,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        // bgcolor: 'modern.modern_4.main',
                        transition: '200ms linear',
                        borderRadius: styles.borderRadiusS,
                        // backgroundSize: '300% 300%',
                        // backgroundImage: mode === 'dark'
                        //     ? 'radial-gradient(circle, rgba(32,31,47,1) 0%, rgba(58,58,65,1) 20%, rgba(82,79,98,1) 40%, rgba(55,52,73,1) 60%, rgba(66,62,78,1) 80%, rgba(31,30,33,1) 100%)'
                        //     : 'radial-gradient(circle, rgba(249,249,249,1) 0%, rgb(158 185 235) 20%, rgba(235,234,242,1) 40%, rgb(157 188 227) 60%, rgba(237,233,244,1) 80%, rgba(234,232,237,1) 100%)',
                        ...someStyle,
                        "& div.MuiInputBase-root:not(.nextui)": {
                            borderRadius: '7px',
                            color: 'common.white',
                            "&::placeholder": {
                                color: 'silver'
                            },
                            "& > fieldset": {
                                borderColor: `${mode === 'dark' ? '#fff' : '#000'} !important`
                            }
                        },
                        "& .ant-select-auto-complete:not(.nextui) input:not(.nextui)": {
                            borderColor: 'common.white'
                        },
                        "& .nextui div[data-slot='input-wrapper']": {
                            bgcolor: 'common.black',
                            color: 'common.white',
                            "*": {
                                color: 'common.white',
                            },
                            "& input, label": {
                                color: 'common.white',
                                border: 'transparent'
                            }
                        },
                        '& label:not(.nextui)': {
                            color: 'secondary.main',
                        },
                        '& .MuiOutlinedInput-root:not(.nextui)': {
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
                        "& label:not(.nextui), & label.Mui-focused": {
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
                            whiteSpaceCollapse: 'break-spaces',
                            borderTop: '1px solid silver'
                        },
                        "& div.w-md-editor": {
                            minHeight: '250px !important'
                        },
                        "& .MuiDivider-root::before, & .MuiDivider-root::after":{
                            borderTop: 'thin solid rgba(173, 215, 211, 1)'
                        },
                        "& button:not(.nextui) > div.ant-float-btn-body": {
                            background: mode === 'light' ? '#f1f1f1' : '#070707',
                            color: mode === 'dark' ? '#f1f1f1' : '#070707',
                            transition: '0.2s linear',
                            boxShadow: mode === 'dark' ? '0px 2px 4px -1px rgba(255,255,255,0.2), 0px 4px 5px 0px rgba(255, 255, 255, 0.14), 0px 1px 10px 0px rgba(255,255,255,0.12)' : '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
                            "&:hover": {
                                background: mode === 'light' ? '#f9f9f9' : '#000',
                                color: mode === 'dark' ? '#f7f7f7' : '#000',
                                boxShadow: mode === 'dark' ? '0px 0px 10px 10px rgba(255,255,255,0.2), 0px 4px 5px 0px rgba(255, 255, 255, 0.14), 0px 1px 10px 0px rgba(255,255,255,0.12)' : '0px 0px 10px 10px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
                            }
                        }
                    }}
                >
                    {
                        !user?.uniqueIndicator?.value && properties?.isShowUserDontHaveUniqueIndicator &&
                        <CreateUniqueIndicator/>
                    }
                    {
                        schema === 'schema_1' && (
                            <HeaderToRender/>
                        )
                    }
                    {
                        currentPathName !== `${CAPL}` && currentPathName !== `${CHATS}` && (
                            <FloatButton
                                onClick={handleNavigate}
                                tooltip={<div>Capl</div>}
                                icon={<EditNoteRoundedIcon sx={{
                                    color: 'common.white'
                                }}/>}
                                style={{
                                    zIndex: 999,
                                    width: '48px',
                                    height: '48px',
                                }}
                            />
                        )
                    }
                    <Outlet/>
                    {
                        currentPathName !== `${CHATS}` && (
                            <FooterToRender/>
                        )
                    }
                </Box>
            </Box>
            {OffLayoutArea && <OffLayoutArea/>}
        </Box>
    );
};
