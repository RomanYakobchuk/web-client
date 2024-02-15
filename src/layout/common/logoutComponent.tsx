import {Box, Button, ListItemButton, ListItemIcon, ListItemText, Tooltip} from "@mui/material";
import {CheckOutlined, CloseOutlined, Logout} from "@mui/icons-material";
import {FC, useContext, useState, MouseEvent} from "react";
import {useIsExistAuthentication, useLogout, useTranslate} from "@refinedev/core";

import {ColorModeContext} from "@/contexts";
import {ModalWindow} from "@/components";
import {socket} from "@/socketClient";
import {logOutUser} from "@/hook/useUserLogout";
import {ActiveUserSessions} from "@/services/activeUserSessions";
import {useUserInfo} from "@/hook";

export const LogoutComponent: FC = () => {
    const {user} = useUserInfo();
    const t = useTranslate();
    const isExistAuthentication = useIsExistAuthentication();
    const {collapsed, setOpen: setOpenSider} = useContext(ColorModeContext);

    const {mutate: mutateLogout} = useLogout();

    const [isLogOut, setIsLogOut] = useState<boolean>(false);

    const drawerWidth = () => {
        if (collapsed) return 64;
        return 200;
    };
    const handleLogOut = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        await logOutUser.currentDevice();
        socket.disconnect();
        mutateLogout();
    }
    return (
        <>
            {
                isExistAuthentication && (
                    <Tooltip
                        title={t("buttons.logout", "Logout")}
                        placement="right"
                        disableHoverListener={!collapsed}
                        arrow
                    >
                        <>
                            <ModalWindow
                                open={isLogOut}
                                setOpen={setIsLogOut}
                                title={''}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: "space-between",
                                    alignItems: 'center',
                                    flexDirection: "row",
                                    gap: 2,
                                    margin: "10px auto",
                                    borderRadius: "12px",
                                    height: "56px",
                                    p: '0px 20px',
                                    width: {xs: drawerWidth()},
                                    bgcolor: 'rgba(197,176,196,0.5)'
                                }}>
                                    <Button
                                        sx={{
                                            bgcolor: 'red',
                                            p: '5px 10px',
                                            height: '35px',
                                            transition: '300ms linear',
                                            "&:hover": {
                                                bgcolor: '#900f1a'
                                            }
                                        }}
                                        onClick={() => setIsLogOut(false)}
                                    >
                                        <CloseOutlined sx={{
                                            color: 'white'
                                        }}/>
                                    </Button>
                                    <Button
                                        sx={{
                                            bgcolor: 'green',
                                            p: '5px 10px',
                                            height: '35px',
                                            transition: '300ms linear',
                                            "&:hover": {
                                                bgcolor: '#365d10'
                                            }
                                        }}
                                        onClick={(event) => handleLogOut(event)}
                                    >
                                        <CheckOutlined sx={{
                                            color: 'white'
                                        }}/>
                                    </Button>
                                </Box>
                                <Box>
                                    {
                                        user?._id && (
                                            <ActiveUserSessions userId={user?._id}/>
                                        )
                                    }
                                </Box>
                            </ModalWindow>
                            {/*{*/}
                            {/*    isLogOut*/}
                            {/*        ?  :*/}
                            <ListItemButton
                                key="logout"
                                onClick={() => {
                                    setIsLogOut(true)
                                    setOpenSider()
                                }}
                                sx={{
                                    justifyContent: "center",
                                    margin: "10px auto",
                                    borderRadius: "12px",
                                    bgcolor: 'error.main',
                                    minHeight: "56px",
                                    width: "90%",
                                    transition: '300ms linear',
                                    color: 'secondary.main',
                                    "&:hover": {
                                        bgcolor: 'red',
                                        //     color: (theme) => theme.palette.secondary.main,
                                        //     transition: '300ms linear',
                                        //     "> div": {
                                        //         color: (theme) => theme.palette.secondary.main
                                        //     }
                                    }
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        justifyContent: "center",
                                        minWidth: 36,
                                        color: (theme) => theme.palette.secondary.main,
                                    }}
                                >
                                    <Logout/>
                                </ListItemIcon>
                                <ListItemText
                                    primary={t("buttons.logout", "LogoutComponent")}
                                    primaryTypographyProps={{
                                        noWrap: true,
                                        fontSize: "16px",
                                    }}
                                />
                            </ListItemButton>
                        </>
                        {/*}*/}
                    </Tooltip>
                )
            }
        </>
    );
};

