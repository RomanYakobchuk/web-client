import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {useInfiniteList, useNotification} from "@refinedev/core";
import {Box} from "@mui/material";

import MoreButton, {IMoreButton} from "@/components/buttons/MoreButton";
import {NotificationCard} from "@/components/notifications";
import {INotification} from "@/interfaces/common";
import {axiosInstance} from "@/authProvider";
import {Loading} from "@/components";
import {useUserProperties} from "@/hook";

type TProps = {
    userId: string,
    setNotifications: Dispatch<SetStateAction<INotification[]>>
}
const DeletedNotificationList = ({setNotifications, userId}: TProps) => {
    const [count, setCount] = useState<number>(0);
    const [deletedNotifications, setDeletedNotifications] = useState<INotification[]>([] as INotification[]);

    const {data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage} = useInfiniteList({
        resource: `notification/allDeletedByUser/${userId}`,
        pagination: {
            pageSize: 20
        }
    });
    const setData = () => {
        if (data?.pages) {
            const list = [].concat(...((data?.pages as any ?? [])?.map((page: {
                data: INotification[],
                total: number
            }) => page?.data ?? [])));
            setDeletedNotifications(list);
            setCount(data?.pages?.length && data?.pages?.length > 0 ? data?.pages[0]?.total : 0)
        }
    }
    useEffect(() => {
        setData();
    }, [data]);
    return (
        <List
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            total={count}
            deletedNotifications={deletedNotifications}
            setDeletedNotifications={setDeletedNotifications}
            isLoading={isLoading}
            setNotifications={setNotifications}
        />
    );
};
export default DeletedNotificationList;
type TList = IMoreButton & {
    deletedNotifications: INotification[],
    setDeletedNotifications: Dispatch<SetStateAction<INotification[]>>
    isLoading: boolean,
    setNotifications: Dispatch<SetStateAction<INotification[]>>
}
const List = ({deletedNotifications, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage, total, setDeletedNotifications, setNotifications}: TList) => {
    const {open} = useNotification();
    const {setProperties} = useUserProperties();
    const handleRecall = async (notification: INotification) => {
        try {
            const res = await axiosInstance.patch(`/notification/updateToFromBucket/${notification?._id}`);
            if (res?.data) {
                setDeletedNotifications(prevState => ([...prevState?.filter(value => value?._id !== notification?._id)]));
                setNotifications(prevState => ([...prevState, notification]));
                if (!notification?.isRead) {
                    setProperties(prevState => ({...prevState, notReadNotifications: prevState?.notReadNotifications + 1}))
                }
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
                description: 'Error recall notification'
            })
        }
    }
    return (
        <Box sx={{
            width: '100%',
            maxWidth: '500px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            height: 'fit-content',
            margin: '0 auto',
        }}>
            {
                isLoading
                    ? <Loading height={'200px'}/>
                    : (deletedNotifications?.length > 0 && deletedNotifications?.map((deletedNotification) => (
                            <Box
                                key={deletedNotification?._id}
                                sx={{
                                    width: '100%'
                                }}
                            >
                                <NotificationCard
                                    setNotifications={setDeletedNotifications}
                                    bgColor={'modern.modern_2.main'}
                                    notification={deletedNotification}
                                    isClear={false}
                                    isSwipe={true}
                                    handleRecall={handleRecall}
                                />
                            </Box>
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
                    total={total}
                />
            </Box>
        </Box>
    )
}
