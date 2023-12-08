import {usePermissions, useTranslate} from "@refinedev/core";
import {Box} from "@mui/material";

import DraftReservationByManager from "./draftReservationByManager";
import AcceptedLottie from "../acceptedLottie";
import RejectedReservationUser from "./rejectedReservationUser";
import {INotification, IReserve} from "@/interfaces/common";
import {useUserInfo} from "@/hook";
import MainInfo from "./mainInfo";
import {getNewNotificationStatus} from "../../getNewNotificationStatus";
import {DetailsButton} from "@/components/notifications/components";

type TProps = {
    reservation: IReserve,
    notification: INotification
}
const NewReservation = ({reservation, notification}: TProps) => {
    const {user} = useUserInfo();
    const {data: role} = usePermissions();
    const translate = useTranslate();

    const isManager = role === 'manager' && user?._id === reservation?.manager;
    const isUser = role === 'user' && user?._id === reservation?.user;

    const isDraftByManager = isManager && ((reservation?.institutionStatus?.value === 'draft' && reservation?.userStatus?.value === 'accepted') || (reservation?.institutionStatus?.value === 'rejected' && reservation?.institutionStatus?.reasonRefusal && reservation?.institutionStatus?.freeDateFor && reservation?.userStatus?.value !== 'rejected'));

    const isAcceptedUser = isUser && reservation?.institutionStatus?.value === 'accepted' && reservation?.userStatus?.value !== 'rejected';
    const isRejectedUser = isUser && reservation?.institutionStatus?.value === 'rejected' && reservation?.userStatus?.value !== 'rejected';

    return (
        <Box sx={{
            color: 'common.white'
        }}>
            <Box sx={{
                fontSize: {xs: '16px', md: '18px'}
            }}>
                {translate(`notifications.page.newReservation.message.${getNewNotificationStatus(notification?.status, notification?.forUser?.role as "user" | "manager")}`)}
            </Box>
            <MainInfo reservation={reservation}/>
            {
                isDraftByManager && (
                    <DraftReservationByManager reservation={reservation}/>
                )
            }
            {
                isAcceptedUser && (
                    <AcceptedLottie/>
                )
            }
            {
                isRejectedUser && (
                    <RejectedReservationUser reservation={reservation}/>
                )
            }
            <DetailsButton link={`/capl/show/${reservation?._id}`}/>
        </Box>
    );
};

export default NewReservation;