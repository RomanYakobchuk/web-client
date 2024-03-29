import {Box, Button, Paper} from "@mui/material";
import {IOAuth} from "@/interfaces/common";
import {AndroidOutlined, AppleOutlined, DesktopOutlined, WindowsOutlined} from "@ant-design/icons";
import {DesktopMacOutlined, Logout} from "@mui/icons-material";
import {ShowTimeComponent} from "@/components/time";
import {Dispatch, SetStateAction} from "react";
import {axiosInstance} from "@/authProvider";

type TProps = {
    session: IOAuth,
    setSessions?: Dispatch<SetStateAction<IOAuth[]>>,
    isCurrentSession?: boolean
}
const iconByOsName = {
    linux: <DesktopOutlined/>,
    ubuntu: <DesktopOutlined/>,
    macos: <DesktopMacOutlined/>,
    android: <AndroidOutlined/>,
    windows: <WindowsOutlined/>,
    ios: <AppleOutlined/>
}
export const SessionCard = ({session, setSessions, isCurrentSession = false}: TProps) => {
    const {userAgent} = session;
    const handleLogoutSpecificDevice = async () => {
        try {
            await axiosInstance.post(`/auth/logoutSpecificDevices/${session?._id}`);
            if (setSessions) {
                setSessions((prevState) => ([...prevState?.filter((value) => value?._id !== session?._id)]))
            }
        } catch (e: any) {
            console.log(e?.response)
        }
    }
    return (
        <Box
            sx={{
                width: '100%',
                height: 'fit-content',
                p: 1,
                display: 'flex',
                flexDirection: 'row',
                gap: 1,
                justifyContent: 'space-between',
                alignItems: 'end'
            }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                "*": {
                    fontSize: '14px',
                    color: 'common.white'
                }
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: {xs: 'column', sm: 'row'},
                    gap: 2
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        height: {xs: '50px', sm: '60px'},
                        width: 'fit-content',
                    }}>
                        <Box sx={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            "& svg": {
                                width: {xs: '30px', sm: '40px'},
                                height: {xs: '30px', sm: '40px'},
                                color: 'common.white'
                            }
                        }}>
                            {iconByOsName[userAgent?.os?.name?.toLowerCase() as keyof typeof iconByOsName]}
                        </Box>
                        <Box sx={{
                            height: '100%',
                            width: 'fit-content',
                            display: 'flex',
                            alignItems: 'start',
                            justifyContent: 'center',
                            flexDirection: 'column'
                        }}>
                            <Box>
                                OS: {userAgent?.os?.name}
                            </Box>
                            <Box>
                                Version: {userAgent?.os?.version}
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: {xs: 'column', sm: 'row'},
                        gap: 2,
                        justifyContent: 'space-between',
                        alignItems: {xs: 'start', sm: 'center'}
                    }}>
                        <Box>
                            <Box>
                                Browser: {userAgent?.browser?.name}
                            </Box>
                            <Box>
                                Version: {userAgent?.browser?.version}
                            </Box>
                        </Box>
                        {
                            userAgent?.device?.model != "undefined" && userAgent?.device?.model !== undefined && (
                                <Box>
                                    <Box>
                                        Device: {userAgent?.device?.model}
                                    </Box>
                                    <Box>
                                        Vendor: {userAgent?.device?.vendor}
                                    </Box>
                                    <Box>
                                        Version: {userAgent?.device?.type}
                                    </Box>
                                </Box>
                            )
                        }
                        <Box sx={{
                            display: {xs: 'flex', sm: 'none'},
                            alignItems: 'center',
                            gap: 1,
                            p: '8px 16px',
                            borderRadius: '7px',
                            bgcolor: 'info.main',
                            width: 'fit-content',
                            color: '#fff',
                            fontWeight: 600,
                            "*": {
                                fontWeight: 600,
                                color: '#fff'
                            }
                        }}>
                            Data:
                            <ShowTimeComponent
                                date={session?.createdAt as Date}
                                isFirstAgo={false}
                                style={{
                                    alignItems: 'start'
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
                <Box sx={{
                    display: {xs: 'none', sm: 'flex'},
                    alignItems: 'center',
                    gap: 1,
                    p: '8px 16px',
                    borderRadius: '7px',
                    bgcolor: 'info.main',
                    width: 'fit-content',
                    color: '#fff',
                    fontWeight: 600,
                    "*": {
                        fontWeight: 600,
                        color: '#fff'
                    }
                }}>
                    Data:
                    <ShowTimeComponent
                        date={session?.createdAt as Date}
                        isFirstAgo={false}
                        style={{
                            alignItems: 'start'
                        }}
                    />
                </Box>
            </Box>
            {
                !isCurrentSession && (
                    <Box sx={{
                        height: '100%',
                        width: 'fit-content',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Button
                            variant={'contained'}
                            color={'error'}
                            onClick={handleLogoutSpecificDevice}
                            sx={{
                                minWidth: '30px',
                                width: 'fit-content',
                                "& svg": {
                                    fontSize: '30px'
                                }
                            }}>
                            <Logout/>
                        </Button>
                    </Box>
                )
            }
        </Box>
    );
};

