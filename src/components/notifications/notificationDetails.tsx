import {CustomShow} from "@/components";
import {useShow, useTranslate} from "@refinedev/core";
import {useEffect, useState} from "react";
import {Box} from "@mui/material";

import {INotification, ProfileProps, PropertyProps, IReserve, IReviews, IMessage, INews} from "@/interfaces/common";
import {NewReservation, NewNews} from "./components";
import {ShowTimeComponent} from "@/components/time";
import {DetailsSkeleton} from "@/components/notifications/components/detailsSkeleton";

type TProps = {
    id: string
}

type NotificationDetails = {
    typeNotification: PropertyProps | ProfileProps | IReviews | IReserve | IMessage | INews,
    notification: INotification
}

const notificationByType = (type: INotification['type'], data: NotificationDetails['typeNotification'], notification: NotificationDetails['notification']) => {
    const res = {
        newReservation: <NewReservation reservation={data as IReserve} notification={notification}/>,
        newNews: <NewNews news={data as INews} notification={notification}/>,
        newEstablishment: <div>newEstablishment</div>,
        newMessage: <div>newMessage</div>,
        newUser: <div>newUser</div>,
        newFunctional: <div>newFunctional</div>,
    }
    return res[type];
}
const NotificationDetails = ({id}: TProps) => {

    const translate = useTranslate();

    const [notification, setNotification] = useState<NotificationDetails>({} as NotificationDetails);

    const {queryResult} = useShow<NotificationDetails>({
        resource: 'notification/allInfo',
        id: id as string
    });

    useEffect(() => {
        if (queryResult?.data?.data) {
            setNotification(queryResult?.data?.data)
        }
    }, [queryResult]);

    const {isLoading} = queryResult;

    return (
        <CustomShow
            bgColor={'transparent'}
            isLoading={false}
        >
            {
                isLoading
                    ? <DetailsSkeleton/>
                    : <>
                        <Box sx={{
                            fontSize: {xs: '20px', md: '24px'},
                            fontWeight: 600,
                            color: 'common.white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 2,
                            width: '100%'
                        }}>
                            {translate(`notifications.page.${notification?.notification?.type}.title.title`)}
                            <ShowTimeComponent
                                date={notification?.notification?.createdAt as Date}
                                isFirstAgo={false}
                                style={{
                                    fontSize: {xs: '14px', md: '16px'}
                                }}
                            />
                        </Box>
                        {notification?.notification?.type && notificationByType(notification?.notification?.type, notification?.typeNotification, notification?.notification)}
                    </>
            }
        </CustomShow>
    );
};
export default NotificationDetails
