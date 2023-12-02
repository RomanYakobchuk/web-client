import {Box, Button, TextField} from "@mui/material";
import {IReserve} from "@/interfaces/common";
import {useNotification, usePermissions, useTranslate} from "@refinedev/core";
import {useUserInfo} from "@/hook";
import React, {useState} from "react";
import {AdornmentBtn} from "@/components/establishment/utills/establishment-reviews";
import {useNavigate} from "react-router-dom";

type TProps = {
    reservation: IReserve
}
const NewReservation = ({reservation}: TProps) => {
    const navigate = useNavigate();
    const {user} = useUserInfo();
    const translate = useTranslate();
    const {data: role} = usePermissions();

    const title = role === 'manager' && user?._id === reservation?.manager ? 'message' : (role === 'user' && user?._id === reservation?.user && (reservation?.institutionStatus?.value === 'accepted' ? 'accepted' : 'rejected'));

    const isManager = role === 'manager' && user?._id === reservation?.manager;
    const isUser = role === 'user' && user?._id === reservation?.user;

    const isDraftByManager = isManager && reservation?.institutionStatus?.value === 'draft';

    const isAcceptedByManager = isManager && reservation?.institutionStatus?.value === 'draft';
    const isRejectedByManager = isManager && reservation?.institutionStatus?.value === 'draft';

    const handleNavigate = () => {
        navigate(`/capl/show/${reservation?._id}`)
    }
    return (
        <Box sx={{
            color: 'common.white'
        }}>
            <Box sx={{
                fontSize: {xs: '16px', md: '18px'}
            }}>
                {translate(`notifications.page.newReservation.message.${title}`)}
            </Box>
            <Box>

            </Box>
            {
                isDraftByManager && (
                    <DraftReservationByManager id={reservation?._id}/>
                )
            }
            <Box sx={{
                width: 'fit-content',
                margin: '0 auto'
            }}>
                <Button
                    onClick={handleNavigate}
                    color={'secondary'}
                    variant={'contained'}
                    sx={{
                        fontSize: {xs: '22px', md: '26px'},
                        textTransform: 'inherit',
                        color: 'common.black',
                        borderRadius: '30px',
                        p: '0px 40px'
                    }}
                >
                    {translate('buttons.details')}
                </Button>
            </Box>
        </Box>
    );
};

export default NewReservation;

const DraftReservationByManager = ({id}: {
    id: string
}) => {
    const translate = useTranslate();
    const {open} = useNotification();

    const [isAddFreeSeatsAndDate, setIsAddFreeSeatsAndDate] = useState<boolean>(false);
    const [rejectedText, setRejectedText] = useState<string>('');
    const [openIsCancel, setOpenIsCancel] = useState<boolean>(false);

    const onCancel = () => {
        (async () => {
            try {
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
    const onSuccess = () => {
        (async () => {
            try {
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
        })()
    }
    return (
        <Box sx={{
            width: '100%',
            maxWidth: {xs: '90%', sm: '500px'},
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 300ms linear',
            justifyContent: 'start',
            margin: '10px auto',
            gap: 3,
            borderRadius: '5px',
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