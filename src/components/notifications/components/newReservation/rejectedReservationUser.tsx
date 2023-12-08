import {RadioButtonCheckedRounded, RadioButtonUncheckedRounded} from "@mui/icons-material";
import {useBack, useNotification, useTranslate} from "@refinedev/core";
import {useEffect, useState} from "react";
import {Box, Button} from "@mui/material";
import dayjs from "dayjs";

import {INotification, IReserve} from "@/interfaces/common";
import {ModalShowContent} from "@/components";
import {ShowTimeComponent} from "@/components/time";
import {useSendNotification} from "@/hook";
import Rejected from "@/lotties/rejected.json";
import LottieComponent from "@/lotties/LottieComponent";
import {axiosInstance} from "@/authProvider";

type TProps = {
    reservation: IReserve
}
const RejectedReservationUser = ({reservation: defaultReservation}: TProps) => {


    const back = useBack();
    const translate = useTranslate();
    const {sendNotification} = useSendNotification();
    const {open} = useNotification();

    const [reservation, setReservation] = useState<IReserve>(defaultReservation);
    const [openRejectedReservation, setOpenRejectedReservation] = useState<boolean>(false);
    const [isOpenChooseNewDate, setIsOpenChooseNewDate] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const handleOpenRejectedReservation = () => {
        setOpenRejectedReservation(prevState => !prevState);
    }

    const handleChooseNewDate = () => {
        setIsOpenChooseNewDate(prevState => !prevState);
    }
    const isHaveNewDates = reservation?.institutionStatus?.freeDateFor && reservation?.institutionStatus?.freeDateFor?.length > 0;

    useEffect(() => {
        if (reservation?.institutionStatus?.freeDateFor && reservation?.institutionStatus?.freeDateFor?.length > 0) {
            const firstDate = reservation?.institutionStatus?.freeDateFor[0];
            setSelectedDate(firstDate);
        }
    }, [reservation, isHaveNewDates]);

    const selectNewDate = (date: Date) => {
        if (date) {
            setSelectedDate(date)
        }
    }
    const send = (status: INotification['status']) => sendNotification({
        forUser: {
            userId: reservation?.manager,
            role: 'manager'
        },
        userId: reservation?.user,
        status: status,
        typeNotification: 'newReservation',
        description: reservation?._id
    });
    const onSuccessNewDate = () => {
        const selectNewDate = () => {
            (async () => {

            })()
        }

    }

    const handleReject = async () => {
        const onReject = async () => {
            try {
                const res = await axiosInstance.patch(`/capl/updateStatus/${reservation?._id}`, {
                    type: 'userStatus',
                    newStatus: 'rejected'
                });
                if (res?.data) {
                    open?.({
                        type: 'success',
                        message: 'Success',
                        description: res?.data?.message
                    });
                    setReservation(res?.data?.reservation)
                }
            } catch (e) {
                console.log(e)
            }
        }
        await Promise.all([
            onReject(),
            send('rejected')
        ])
    }

    return (
        <Box sx={{
            width: '100%',
            maxWidth: {sm: '500px'},
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 300ms linear',
            justifyContent: 'start',
            margin: '10px auto',
            gap: 3,
            borderRadius: '10px',
            p: 3,
            bgcolor: 'common.black',
            color: 'common.white'
        }}>
           <LottieComponent item={Rejected}/>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                fontSize: {xs: '20px', md: '24px'},
                width: '100%',
                fontWeight: 500,
                whiteSpaceCollapse: 'break-space'
                // gap: 1
            }}>
                {translate('notifications.page.newReservation.message.chooseNewDateOrReject')}
            </Box>
            <Box sx={{
                width: '100%%',
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                justifyContent: 'space-evenly',
                "& button": {
                    textTransform: 'inherit',
                    fontSize: {xs: '18px', md: '20px'},
                    fontWeight: 600,
                    borderRadius: '5px',
                    p: '4px 16px',
                    minWidth: '80px'
                }
            }}>
                <ModalShowContent
                    openComponent={
                        <Button
                            color={'error'}
                            variant={'contained'}
                            onClick={handleOpenRejectedReservation}
                        >
                            {translate('buttons.cancel')}
                        </Button>
                    }
                    isOpen={openRejectedReservation}
                    setIsOpen={setOpenRejectedReservation}
                    onClick={handleReject}
                    onSuccessText={translate('text.yes')}
                    onCancelText={translate('text.no')}
                    headerStyle={{
                        marginBottom: 0
                    }}
                >
                    <Box sx={{
                        p: 2,
                        fontSize: {xs: '24px', md: '28px'},
                        fontWeight: 600,
                        margin: '0 auto',
                        width: 'fit-content'
                    }}>
                        {translate('text.areYouSure')}
                    </Box>
                </ModalShowContent>
                <Button
                    color={'info'}
                    variant={'contained'}
                    onClick={handleChooseNewDate}
                >
                    {translate('buttons.choose')}
                </Button>
            </Box>
            {
                isOpenChooseNewDate && isHaveNewDates && (
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 1,
                            fontSize: '16px'
                        }}>
                            <span>
                                {translate('capl.create.date')}:
                            </span>
                            <ShowTimeComponent
                                style={{
                                    fontSize: '16px'
                                }}
                                date={selectedDate as Date} isFirstAgo={false}/>
                            {/*    <span>*/}
                            {/*    {dayjs(selectedDate)?.format('DD.MM.YYYY HH:mm')}*/}
                            {/*</span>*/}
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                            ml: '20px'
                        }}>
                            {
                                reservation?.institutionStatus?.freeDateFor?.map((date, index) => (
                                    <Box
                                        onClick={() => selectNewDate(date as Date)}
                                        key={index}
                                        sx={{
                                            cursor: 'pointer',
                                            transition: '200ms linear',
                                            width: '200px',
                                            p: 1,
                                            border: `2px solid ${selectedDate === date ? 'cornflowerblue' : 'silver'}`,
                                            borderRadius: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            color: selectedDate === date ? 'cornflowerblue' : 'silver',
                                            "& svg": {
                                                color: selectedDate === date ? 'cornflowerblue' : 'silver'
                                            },
                                            "&:hover": {
                                                color: 'cornflowerblue',
                                                borderColor: 'cornflowerblue',
                                                "& svg": {
                                                    color: 'cornflowerblue'
                                                }
                                            }
                                        }}
                                    >
                                        {
                                            selectedDate === date
                                                ? <RadioButtonCheckedRounded/>
                                                : <RadioButtonUncheckedRounded/>
                                        }
                                        {dayjs(date)?.format('DD.MM.YYYY HH:mm')}
                                    </Box>
                                ))
                            }
                        </Box>
                        <Box>
                            <Button
                                color={'info'}
                                variant={'outlined'}
                                sx={{
                                    textTransform: 'inherit'
                                }}
                                onClick={onSuccessNewDate}
                            >
                                {translate('buttons.save')}
                            </Button>
                        </Box>
                    </Box>
                )
            }
        </Box>
    );
};
export default RejectedReservationUser
