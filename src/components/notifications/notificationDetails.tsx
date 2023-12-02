import {CustomShow} from "@/components";
import {useShow, useTranslate} from "@refinedev/core";
import {useEffect, useState} from "react";
import {Box} from "@mui/material";

import {INotification, ProfileProps, PropertyProps, IReserve, IReviews, IMessage, INews} from "@/interfaces/common";
import {NewReservation} from "./components";

type TProps = {
    id: string
}

type NotificationDetails = {
    typeNotification: PropertyProps | ProfileProps | IReviews | IReserve | IMessage | INews,
    notification: INotification
}

const notificationByType = (type: INotification['type'], data: NotificationDetails['typeNotification']) => {
    const res = {
        newReservation: <NewReservation reservation={data as IReserve}/>,
        newNews: <div>newNews</div>,
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
            isLoading={isLoading}
        >
            <Box sx={{
                fontSize: {xs: '20px', md: '24px'},
                fontWeight: 600,
                color: 'common.white'
            }}>
                {translate(`notifications.page.${notification?.notification?.type}.title.title`)}
            </Box>
            {notification?.notification?.type && notificationByType(notification?.notification?.type, notification?.typeNotification)}
        </CustomShow>
    );
};
export default NotificationDetails
