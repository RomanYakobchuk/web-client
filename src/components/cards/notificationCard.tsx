import {useNavigate} from "react-router-dom";
import {Box, Button, IconButton} from "@mui/material";
import React, {Dispatch, MouseEvent, SetStateAction, useContext, useEffect, useState} from "react";
import {useNotification, useTranslate} from "@refinedev/core";
import {AccessTime, CloseRounded, Delete, EastRounded, RestartAltRounded, SwipeLeftRounded} from "@mui/icons-material";

import {INotification} from "@/interfaces/common";
import {ColorModeContext} from "@/contexts";
import {useMobile, useUserProperties} from "@/hook";
import {ModalShowContent} from "@/components";
import SwipeComponent from "@/components/swipe/swipeComponent";
import {axiosInstance} from "@/authProvider";
import {ShowTimeComponent} from "@/components/time";
import {getNewNotificationStatus} from "../notifications/getNewNotificationStatus";
import {newNotificationIcon} from "@/components/notifications/newNotificationIcon";

type TProps = {
    notification: INotification,
    isClear?: boolean,
    handleClear?: (notification: INotification, onClick: () => void) => void,
    bgColor?: string,
    handleRecall?: (notification: INotification) => void,
    isSwipe?: boolean,
    setNotifications?: Dispatch<SetStateAction<INotification[]>>
}
const type = {
    type: "type",
    title: 'title'
}

const NotificationCard = ({
                              notification,
                              handleClear,
                              isClear = true,
                              bgColor,
                              handleRecall,
                              isSwipe = false,
                              setNotifications
                          }: TProps) => {
    const {width} = useMobile();
    const {mode} = useContext(ColorModeContext);
    const {setProperties} = useUserProperties();
    const navigate = useNavigate();
    const translate = useTranslate();
    const {open} = useNotification();

    const [modalShowContentDisplay, setModalShowContentDisplay] = useState<"flex" | "none">("none");
    const [openModalShowContent, setOpenModalShowContent] = useState<boolean>(false);
    const [isRead, setIsRead] = useState<boolean>(notification?.isRead);

    const handleAnimate = () => {
        const element = document.getElementById(`${notification?._id + notification?.type}`) as HTMLDivElement;

        if (element) {
            const targetRect = element.getBoundingClientRect();
            const startX = targetRect.left;
            const startY = targetRect.top;
            const endX = width - 55;
            const endY = 80;

            const distanceX = endX - startX;
            const distanceY = endY - startY;

            element.style.transition = '1s ease-in-out';
            element.style.transform = `translate(${distanceX}px, ${distanceY}px)`;

        }
    }
    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isSwipe) {
            navigate(`/notifications/show/${notification?._id}`)
        }
        setIsRead(true)
        if (!notification?.isRead) {
            setProperties(prevState => ({
                ...prevState,
                notReadNotifications: prevState?.notReadNotifications <= 0 ? 0 : prevState?.notReadNotifications - 1
            }))
        }
    }

    useEffect(() => {
        setIsRead(notification?.isRead)
    }, [notification?.isRead]);

    const handleOpenModal = () => {
        setOpenModalShowContent((prevState) => !prevState);
        if (modalShowContentDisplay === 'flex') {
            setTimeout(() => {
                setModalShowContentDisplay('none')
            }, 300)
        } else {
            setModalShowContentDisplay('flex')
        }
    }
    const onSuccess = () => {
        setOpenModalShowContent(false)
        isClear ? (handleClear && handleClear(notification, handleAnimate)) : (handleRecall && handleRecall(notification))
    }
    const handleDelete = async (notification: INotification) => {
        try {
            if (setNotifications) {
                await axiosInstance.delete(`/notification/delete/${notification?._id}`)
                open?.({
                    type: 'success',
                    message: 'Success',
                    description: 'Notification deleted success'
                })
                setNotifications(prevState => ([...prevState?.filter(value => value?._id !== notification?._id)]))
            }
        } catch (e) {
            open?.({
                type: 'error',
                message: 'Error',
                description: 'Error deleted notification',
            })
        }
    }

    return (
        <SwipeComponent
            uniqueKey={notification?._id}
            isSwipeRight={false}
            isSwipeLeft={isSwipe}
            isSwipeable={isSwipe}
            rightItemWidth={70}
            rightItem={isSwipe &&
                <Box sx={{
                    width: 'fit-content',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Button
                        onClick={async () => {
                            await handleDelete(notification)
                        }}
                        color={'error'}
                        variant={'contained'}
                        sx={{
                            p: 2,
                            display: 'flex',
                            width: '50px',
                            height: '50px',
                            minWidth: '40px',
                            borderRadius: '50%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: 'auto 10px'
                        }}
                    >
                        <Delete sx={{color: '#fff'}}/>
                    </Button>
                </Box>
            }
        >
            <Box
                id={`${notification?._id + notification?.type}`}
                sx={{
                    width: '100%',
                    transition: 'all 300ms linear',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: openModalShowContent ? 2 : 0,
                    overflow: 'hidden',
                    borderRadius: '10px',
                    position: 'relative',
                    alignItems: 'start',
                    bgcolor: bgColor ? bgColor : (isRead ? (mode === 'dark' ? 'common.black' : 'modern.modern_1.main') : (mode === 'light' ? 'common.black' : 'modern.modern_1.main')),
                    "&:hover": {
                        transform: isSwipe ? 'scale(1)' : 'scale(1.03)',
                    },
                }}>
                <Box
                    sx={{
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'start',
                        width: '100%',
                    }}>
                    <Box sx={{
                        display: 'flex',
                        height: '100%',
                        width: 'fit-content',
                        textDecoration: 'none',
                        color: isRead ? 'silver' : 'common.white',
                        flexDirection: 'column'
                    }}>
                        <ModalShowContent
                            openComponent={
                                isClear ? (
                                    <IconButton
                                        onClick={handleOpenModal}
                                    >
                                        <CloseRounded/>
                                    </IconButton>
                                ) : (
                                    <IconButton
                                        onClick={handleOpenModal}
                                    >
                                        <RestartAltRounded/>
                                    </IconButton>
                                )
                            }
                            headerStyle={{
                                margin: '0',
                                marginBottom: 0
                            }}
                            isOpen={openModalShowContent}
                            setIsOpen={setOpenModalShowContent}
                            onClick={onSuccess}
                            onSuccessText={translate('text.yes')}
                        >
                            <Box sx={{
                                p: '0px 16px 16px 16px',
                                display: 'flex',
                                justifyContent: 'center',
                                fontSize: '22px',
                                width: '100%',
                                fontWeight: 600,
                                color: 'common.white'
                            }}>
                                {translate(`buttons.${isClear ? 'delete' : 'restore'}`)}?
                            </Box>
                        </ModalShowContent>
                    </Box>
                    <Box
                        sx={{
                            width: '100%'
                        }}
                        onClick={handleClick}
                        // to={}
                    >
                        <Box sx={{
                            width: '100%',
                            p: '5px 16px',
                            pl: 0,
                            pr: '24px',
                            borderBottom: '1px solid silver',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Box sx={{
                                fontWeight: 600,
                                color: isRead ? "silver" : 'cornflowerblue'
                            }}>
                                {
                                    notification?.type && notification?.status &&
                                    translate(`notifications.page.${notification.type}.title.${type[notification?.status === 'usual' ? 'type' : 'title']}`)
                                }
                            </Box>
                            <Box>
                                {newNotificationIcon(notification?.type)}
                            </Box>
                        </Box>
                        <Box sx={{
                            p: '12px 16px',
                            pl: 0,
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            {translate(`notifications.page.${notification.type}.message.${getNewNotificationStatus(notification?.status, notification?.forUser?.role as "user" | "manager")}`)}
                            {
                                isSwipe
                                    ? <SwipeLeftRounded sx={{
                                        color: isRead ? 'silver' : (mode === 'dark' ? "#f9f9f9" : '#666464'),
                                    }}/>
                                    : <EastRounded/>
                            }
                        </Box>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                bgcolor: isRead ? 'transparent' : 'info.main'
                            }}
                        />
                        <Box sx={{
                            color: isRead ? 'silver' : (mode === 'dark' ? "#f9f9f9" : '#666464'),
                            fontSize: {xs: '12px', md: '14px'},
                            display: 'flex',
                            gap: 1,
                            alignItems: 'center',
                            width: '100%',
                            justifyContent: 'end',
                            pb: '5px',
                            pr: '5px'
                        }}>
                            <AccessTime
                                fontSize={width < 900 ? 'small' : 'medium'}
                                sx={{
                                    color: isRead ? 'silver' : (mode === 'dark' ? "#f9f9f9" : '#666464'),
                                }}/>
                            <ShowTimeComponent date={notification?.createdAt} isFirstAgo={false}/>
                        </Box>
                    </Box>
                </Box>
                {/*<Box sx={{*/}
                {/*    width: '70%',*/}
                {/*    display: modalShowContentDisplay,*/}
                {/*    flexDirection: 'column',*/}
                {/*    transition: 'all 300ms linear',*/}
                {/*    justifyContent: 'start',*/}
                {/*    margin: '10px',*/}
                {/*    gap: 3,*/}
                {/*    borderRadius: '5px',*/}
                {/*    p: '24px 16px 16px 16px',*/}
                {/*    bgcolor: 'common.black',*/}
                {/*}}>*/}
                {/*    <Box sx={{*/}
                {/*        display: 'flex',*/}
                {/*        justifyContent: 'center',*/}
                {/*        fontSize: '22px',*/}
                {/*        width: '100%',*/}
                {/*        fontWeight: 600*/}
                {/*    }}>*/}
                {/*        {translate(`buttons.${isClear ? 'delete' : 'restore'}`)}?*/}
                {/*    </Box>*/}
                {/*    <Box sx={{*/}
                {/*        width: '100%%',*/}
                {/*        display: 'flex',*/}
                {/*        flexDirection: 'row',*/}
                {/*        gap: 2,*/}
                {/*        justifyContent: 'space-evenly',*/}
                {/*        "& button": {*/}
                {/*            textTransform: 'inherit',*/}
                {/*            fontSize: '20px',*/}
                {/*            fontWeight: 600,*/}
                {/*            borderRadius: '5px',*/}
                {/*            p: '4px 16px',*/}
                {/*            minWidth: '80px'*/}
                {/*        }*/}
                {/*    }}>*/}
                {/*        <Button*/}
                {/*            color={'error'}*/}
                {/*            variant={'contained'}*/}
                {/*            onClick={handleOpenModal}*/}
                {/*        >*/}
                {/*            {translate('text.no')}*/}
                {/*        </Button>*/}
                {/*        <Button*/}
                {/*            color={'info'}*/}
                {/*            variant={'contained'}*/}
                {/*            onClick={onSuccess}*/}
                {/*        >*/}
                {/*            {translate('text.yes')}*/}
                {/*        </Button>*/}
                {/*    </Box>*/}
                {/*</Box>*/}
            </Box>
        </SwipeComponent>
    );
};
export default NotificationCard
