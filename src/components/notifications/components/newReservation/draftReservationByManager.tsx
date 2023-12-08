import {useNotification, useTranslate} from "@refinedev/core";
import React, {useState} from "react";
import {Box, Button, TextField} from "@mui/material";
import {Add, RemoveRounded} from "@mui/icons-material";
import dayjs from "dayjs";

import {AdornmentBtn} from "@/components/establishment/utills/establishment-reviews";
import {axiosInstance} from "@/authProvider";
import {useSendNotification, useUserInfo} from "@/hook";
import {INotification, IReserve} from "@/interfaces/common";

type TProps = {
    reservation: IReserve
}

// type TNewNotification =
//     Omit<INotification, "_id" | "createdAt" | "updateAt" | "message" | "type">
//     & { typeNotification: INotification['type'] }

type TUpdateStatusData = {
    institutionStatus: IReserve["institutionStatus"];
    userStatus?: IReserve['userStatus']
};
const DraftReservationByManager = ({reservation: defaultReservation}: TProps) => {
    const {user} = useUserInfo();
    const translate = useTranslate();
    const {open} = useNotification();
    const {sendNotification} = useSendNotification();

    const [reservation, setReservation] = useState<IReserve>(defaultReservation);
    const [isAddFreeSeatsAndDate, setIsAddFreeSeatsAndDate] = useState<boolean>(false);
    const [rejectedText, setRejectedText] = useState<string>('');
    const [openIsCancel, setOpenIsCancel] = useState<boolean>(false);
    const [numberOfSeats, setNumberOfSeats] = useState<number>(0);
    const [newDate, setNewDate] = useState<string | Date | null>(null);

    const handleChangeFreeSeatsAndDate = () => {
        setIsAddFreeSeatsAndDate((prevState) => !prevState);
    }
    const send = (status: INotification['status'], forUser: { role: "user" | "manager", userId: string }) => sendNotification({
        userId: user?._id,
        description: reservation?._id,
        status: status,
        forUser: forUser,
        typeNotification: 'newReservation'
    })

    const onCancel = () => {
        (async () => {
            try {
                const updateStatus = async () => {
                    const data = {
                        institutionStatus: {
                            value: 'rejected',
                            reasonRefusal: rejectedText,
                            freeDateFor: [newDate]
                        }
                    } as TUpdateStatusData;
                    if (newDate && numberOfSeats > 0) {
                        data['userStatus'] = {
                            value: 'draft',
                        }
                    }
                    await axiosInstance.patch(`/capl/updateByUser/${reservation?._id}`, data);
                }

                await Promise.all([
                    updateStatus(), send('rejected', {
                        userId: reservation?.user,
                        role: 'user'
                    })
                ])

                open?.({
                    type: 'success',
                    description: 'Reservation canceled success',
                    message: 'Success'
                })
            } catch (e) {
                open?.({
                    type: 'error',
                    description: 'Error cancel reservation',
                    message: 'Error'
                })
            }
        })()
    }
    const handleOpenCanceledText = () => {
        setOpenIsCancel((prevState) => !prevState);
    }
    const onSuccess = async () => {
        try {
            const updateStatus = async () => {
                const res = await axiosInstance.patch(`/capl/updateStatus/${reservation?._id}`, {
                    type: 'institutionStatus',
                    newStatus: 'accepted'
                });
                if (res?.data) {
                    open?.({
                        type: 'success',
                        message: 'Success',
                        description: res?.data?.message
                    });
                    setReservation(res?.data?.reservation)
                }
            }
            await Promise.all([
                updateStatus(), send('accepted', {
                    userId: reservation?.user,
                    role: 'user'
                })
            ])

            open?.({
                type: 'success',
                description: 'Reservation confirmed success',
                message: 'Success'
            })
        } catch (e) {
            open?.({
                type: 'error',
                description: 'Error confirm reservation',
                message: 'Error'
            })
        }
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
            p: 4,
            bgcolor: 'common.black',
            color: 'common.white'
        }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                fontSize: {xs: '20px', md: '24px'},
                width: '100%',
                fontWeight: 500,
                gap: 1
            }}>
                            <span>
                                {translate(`buttons.confirm`)}
                            </span>
                <span style={{
                    textTransform: 'lowercase'
                }}>
                                {translate('capl.reservation')}?
                            </span>
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
                <Button
                    color={'error'}
                    variant={'contained'}
                    onClick={handleOpenCanceledText}
                >
                    {translate('text.no')}
                </Button>
                <Button
                    color={'info'}
                    variant={'contained'}
                    onClick={onSuccess}
                >
                    {translate('text.yes')}
                </Button>
            </Box>
            {
                openIsCancel && (
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        alignItems: 'start'
                    }}>
                        <TextField
                            sx={{
                                width: '100%',
                                maxWidth: '500px'
                            }}
                            multiline
                            value={rejectedText}
                            variant={'standard'}
                            disabled={!openIsCancel}
                            inputProps={{
                                maxLength: 300
                            }}
                            maxRows={10}
                            InputProps={{
                                endAdornment: <AdornmentBtn value={rejectedText} setValue={setRejectedText}
                                                            maxValueLength={300}/>
                            }}
                            placeholder={'*' + translate("notifications.page.newReservation.message.reasonForRefusal")}
                            onChange={(event) => setRejectedText(event.target.value)}
                        />
                        <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: isAddFreeSeatsAndDate ? 2 : 0,
                            alignItems: 'start'
                        }}>
                            <Button
                                variant={'text'}
                                color={'info'}
                                sx={{
                                    textTransform: 'inherit'
                                }}
                                startIcon={
                                    isAddFreeSeatsAndDate
                                        ? <RemoveRounded/>
                                        : <Add/>
                                }
                                onClick={handleChangeFreeSeatsAndDate}
                            >
                                {
                                    isAddFreeSeatsAndDate
                                        ? translate('buttons.cancel')
                                        : translate('all_institutions.freeSeats.create')
                                }
                            </Button>
                            {
                                isAddFreeSeatsAndDate && (
                                    <Box sx={{
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        "@media screen and (min-width: 500px)": {
                                            flexDirection: 'row',
                                        },
                                        gap: 2,
                                        "& div.MuiFormControl-root": {
                                            width: '100%'
                                        }
                                    }}>
                                        <TextField
                                            size={'small'}
                                            color={'secondary'}
                                            type={'number'}
                                            label={translate('all_institutions.freeSeats.numberOfSeats')}
                                            placeholder={translate('all_institutions.freeSeats.numberOfSeats')}
                                            value={numberOfSeats || 0}
                                            inputProps={{
                                                min: 0
                                            }}
                                            onChange={(event) => setNumberOfSeats(Number(event.target.value))}
                                        />
                                        <TextField
                                            size={'small'}
                                            color={'secondary'}
                                            type={'datetime-local'}
                                            label={translate('capl.create.date')}
                                            placeholder={translate('capl.create.date')}
                                            value={newDate || dayjs(Date?.now())?.format('YYYY-MM-DD HH:mm')}
                                            onChange={(event) => setNewDate(event.target.value)}
                                        />
                                    </Box>
                                )
                            }
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            gap: 2,
                            alignItems: 'center'
                        }}>
                            <Button
                                variant={'outlined'}
                                color={'secondary'}
                                disabled={rejectedText?.length < 20}
                                sx={{
                                    textTransform: 'inherit',
                                    fontSize: '16px'
                                }}
                                onClick={onCancel}
                            >
                                {translate('buttons.confirm')}
                            </Button>
                            {rejectedText?.length}/20
                        </Box>
                    </Box>
                )
            }
        </Box>
    );
};
export default DraftReservationByManager;