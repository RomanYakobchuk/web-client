import {useInfiniteList, useNotification, useOne, useTranslate} from "@refinedev/core";
import {Close, DeleteOutlined} from "@mui/icons-material";
import {useContext, useEffect, useState} from "react";
import {Box, IconButton} from "@mui/material";
import CountUp from "react-countup";
import {Typography} from "antd";

import MoreButton from "@/components/common/buttons/MoreButton";
import {DeletedNotifications, NotificationCard} from "@/components/notifications";
import {useMobile, useUserProperties} from "@/hook";
import {INotification} from "@/interfaces/common";
import {SchemaContext} from "@/settings/schema";
import {socket} from "@/socketClient";
import {Loading} from "@/components";

import "./notification.css";
import {axiosInstance} from "@/authProvider";

const {Text} = Typography;
type TProps = {
    userId: string,
    isCurrentUser?: boolean
}

type TIsReadings = "null" | "true" | "false";
const Page = ({userId, isCurrentUser = true}: TProps) => {

    const {width} = useMobile();
    const {open} = useNotification();
    const {schema} = useContext(SchemaContext);
    const translate = useTranslate();
    const {properties, setProperties} = useUserProperties();

    const [scrolled, setScrolled] = useState<boolean>(false);
    const [openDeleted, setOpenDeleted] = useState<boolean>(false);
    const [isReading, setIsReading] = useState<TIsReadings>("null");
    const [count, setCount] = useState<number>(0);
    const [countIsNotRead, setCountIsNotRead] = useState<number>(0);
    const [notifications, setNotifications] = useState<INotification[]>([] as INotification[]);
    const [newNotification, setNewNotification] = useState<INotification | null>(null);

    const {data: dataCount, refetch: reFetchCountIsNotRead} = useOne<{ countIsNotRead: number }>({
        resource: 'notification/getUserCount',
        id: userId as string
    });

    const {data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage} = useInfiniteList({
        resource: `notification/allByUser/${userId}`,
        pagination: {
            pageSize: 20
        },
        filters: [
            {
                field: 'isReading',
                value: isReading,
                operator: 'eq'
            },
        ],
    })
    useEffect(() => {
        socket?.on('newNotification', (notification: INotification) => {
            setNewNotification(notification)
        })
        return () => {
            socket.off('newNotification');
        }
    }, []);
    useEffect(() => {
        if (newNotification) {
            setNotifications((prevState) => ([newNotification, ...prevState]))
            setNewNotification(null);
        }
    }, [newNotification]);
    useEffect(() => {
        setData();
    }, [data]);
    useEffect(() => {
        if (dataCount?.data) {
            setProperties({...properties, notReadNotifications: dataCount?.data?.countIsNotRead});
            setCountIsNotRead(dataCount?.data?.countIsNotRead)
        }
    }, [dataCount]);
    const MainLayout = document.getElementById('mainLayout') as HTMLElement;

    useEffect(() => {
        (async () => {
            await reFetchCountIsNotRead();
        })();
    }, [isReading]);
    const handleScroll = () => {
        if (MainLayout) {
            const scrollTop = MainLayout.scrollTop;
            const isScrolled = scrollTop > 30;
            setScrolled(isScrolled);
        }
    };

    useEffect(() => {
        if (MainLayout) {
            MainLayout.addEventListener('scroll', handleScroll);
        }
    }, [MainLayout]);
    const setData = () => {
        if (data?.pages) {
            const list = [].concat(...((data?.pages as any ?? [])?.map((page: {
                data: INotification[],
                total: number
            }) => page?.data ?? [])));
            setNotifications(list);
            setCount(data?.pages?.length && data?.pages?.length > 0 ? data?.pages[0]?.total : 0)
        }
    }
    const setIsReadingFilter = (type: "null" | "true" | "false") => {
        setIsReading(type)
    }

    const handleClear = async (notification: INotification, onClick: () => void) => {
        const item = document.getElementById(`${notification?._id + notification?.type}`) as HTMLElement;
        const button = document.getElementById('deleteNotificationButton') as HTMLElement;
        if (item && button) {
            const children = Object.values(item.childNodes) as HTMLElement[];
            for (const child of children) {
                child.style.display = 'none';
            }
            item.style.transition = 'all 1000ms linear, transform 1s linear infinite';
            item.style.width = '50px';
            item.style.height = '50px';
            item.style.transform = 'rotate(-360deg)';
            item.style.background = 'red';
            item.style.zIndex = '2';
            item.style.animation = 'deleteNotification 1s linear';
            setTimeout(() => {
                button.style.scale = '1';
                button.style.transition = '1s ease-in-out';
                button.style.transform = 'rotate(0deg)';
                button.style.animation = 'buttonDeleteNotification 1s ease-in-out';
            }, 900);
        }
        onClick();

        setCount((prevState) => prevState <= 0 ? 0 : prevState - 1);
        if (!notification?.isRead) {
            setCountIsNotRead((prevState) => prevState <= 0 ? 0 : prevState - 1);
            setProperties(prevState => ({
                ...prevState,
                notReadNotifications: prevState?.notReadNotifications <= 0 ? 0 : prevState?.notReadNotifications - 1
            }))
        }
        setTimeout(async () => {
            if (item && button) {
                item.style.width = '';
                item.style.height = '';
                item.style.background = '';
                item.style.zIndex = '';
                item.style.transition = '';
                item.style.animation = '';
                button.style.scale = '1'
                button.style.transform = '';
                setNotifications((prevState) => ([...prevState?.filter(value => value?._id !== notification?._id)]));
                try {
                    const res = await axiosInstance.patch(`/notification/updateToFromBucket/${notification?._id}`);
                    if (res?.data) {
                        open?.({
                            type: 'success',
                            message: 'Success',
                            description: res?.data?.message
                        })
                    }
                } catch (e) {
                    open?.({
                        type: 'error',
                        message: 'Error',
                        description: 'Error deleted notification'
                    })
                }
            }
        }, 1000);
        setTimeout(() => {
            if (button) {
                button.style.transition = '';
                button.style.animation = '';
            }
        }, 2000)
    }
    return (
        <Box sx={{
            position: 'relative'
        }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                p: 2,
                position: 'sticky',
                top: schema === 'schema_1' ? (width < 600 ? '55px' : '65px') : '0',
                zIndex: 2,
                bgcolor: 'transparent',
                backdropFilter: scrolled ? 'blur(20px)' : 'blur(0px)',
                height: '50px',
                transition: '200ms linear',
                borderBottom: scrolled ? '1px solid silver' : '1px solid transparent'
            }}>
                <h2 style={{
                    margin: '5px 0',
                    width: 'fit-content'
                }}>
                    {translate('notifications.page.newNotification.title.title')}
                </h2>
                <IconButton
                    id={'deleteNotificationButton'}
                    onClick={() => setOpenDeleted(prevState => !prevState)}
                >
                    {
                        openDeleted ? <Close/> : <DeleteOutlined/>
                    }
                </IconButton>
            </Box>
            <Box sx={{
                display: 'flex',
                width: '100%',
                flexDirection: {xs: 'column'},
                "@media screen and (min-width: 700px)": {
                    flexDirection: 'row'
                },
                "@media screen and (min-width: 900px)": {
                    flexDirection: 'column'
                },
                "@media screen and (min-width: 1000px)": {
                    flexDirection: 'row'
                },
                gap: 2,
                margin: '0 auto',
                p: '0px 16px 16px 16px',
                maxWidth: {xs: '750px', lg: '90%'}
            }}>
                <Box sx={{
                    position: 'unset',
                    top: '0',
                    "@media screen and (min-width: 700px)": {
                        position: 'sticky',
                        top: schema === 'schema_1' ? '145px' : '80px'
                    },
                    "@media screen and (min-width: 900px)": {
                        position: 'unset',
                        top: 0
                    },
                    "@media screen and (min-width: 1000px)": {
                        position: 'sticky',
                        top: schema === 'schema_1' ? '145px' : '80px'
                    },
                    height: 'fit-content',
                    minWidth: '200px',
                    maxWidth: 'fit-content',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    "& h5, & h4, & span": {
                        // color: 'common.white'
                    },
                    "& h5, & h4": {
                        width: 'fit-content',
                        mt: '10px'
                    },
                    "& span": {
                        fontWeight: 600,
                        fontSize: {xs: '14px', md: '16px'}
                    },
                    "& div": {
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: 1,
                        p: '4px 16px',
                        borderRadius: '10px'
                    }
                }}>
                    {
                        [
                            {
                                title: translate('notifications.page.info.all'),
                                count: count || 0,
                                value: 'null'
                            },
                            {
                                title: translate('notifications.page.info.read'),
                                count: (count - countIsNotRead <= 0 ? 0 : count - countIsNotRead) || 0,
                                value: 'true'
                            },
                            {
                                title: translate('notifications.page.info.notRead'),
                                count: countIsNotRead || 0,
                                value: 'false'
                            }
                        ]?.map((value) => (
                            <Box
                                key={value?.value}
                                sx={{
                                    transition: '200ms linear',
                                    cursor: 'pointer',
                                    bgcolor: isReading === value?.value ? "info.main" : 'modern.modern_1.second',
                                    "& span": {
                                        color: isReading === value?.value ? "#f1f1f1" : 'common.white',
                                    },
                                    "&:hover": {
                                        bgcolor: 'info.main'
                                    },
                                    "& span:nth-of-type(2)": {
                                        fontSize: {xs: '18px', md: '20px'},
                                        fontWeight: 600
                                    }
                                }}
                                onClick={() => setIsReadingFilter(value?.value as TIsReadings)}
                            >
                                <Text>
                                    {value?.title}
                                </Text>
                                <CountUp
                                    end={value?.count}
                                />
                            </Box>
                        ))
                    }
                </Box>
                <Box sx={{
                    width: '100%',
                    maxWidth: '500px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    margin: '0 auto',
                    "@media screen and (min-width: 700px)": {
                        margin: 0
                    },
                    "@media screen and (min-width: 900px)": {
                        m: '0 auto'
                    },
                    "@media screen and (min-width: 1000px)": {
                        m: 0
                    },
                }}>
                    {
                        isLoading
                            ? <Loading height={'200px'}/>
                            : (
                                notifications?.length > 0 && notifications?.map((notification) => (
                                    <NotificationCard
                                        key={notification?._id}
                                        notification={notification}
                                        handleClear={handleClear}
                                    />
                                ))
                            )
                    }
                    <Box sx={{
                        margin: '0 auto',
                        width: 'fit-content'
                    }}>
                        <MoreButton
                            hasNextPage={hasNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                            fetchNextPage={fetchNextPage}
                            total={count}
                        />
                    </Box>
                </Box>
                <DeletedNotifications
                    userId={userId}
                    setOpenDeleted={setOpenDeleted}
                    openDeleted={openDeleted}
                    setNotifications={setNotifications}
                />
            </Box>
        </Box>
    );
};
export default Page
