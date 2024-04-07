import {
    Box,
    Button,
    CircularProgress,
    FormHelperText,
    TextField,
    Typography
} from "@mui/material";
import {HttpError, useNotification, useOne, usePermissions, useTranslate} from "@refinedev/core";
import {useForm} from "@refinedev/react-hook-form";
import React, {Dispatch, SetStateAction, useEffect, useReducer, useState} from "react";
import {Add} from "@mui/icons-material";

import {handleKeyDownBlockEnter} from "@/keys";
import {useMobile, useUserInfo} from "@/hook";

import {reducer, initialState, Action} from "./reviewReducer";
import {StarRating} from "@/components/establishment/utills/main/starRating";
import {IEstablishment, IReviews} from "@/interfaces/common";

type TProps = {
    total?: number,
    establishment: IEstablishment,
    setReviews?: Dispatch<SetStateAction<IReviews[]>>
}


export const ReviewForm = ({total = 1, establishment, setReviews}: TProps) => {
    const {device} = useMobile();
    const {data: role} = usePermissions();
    const {user} = useUserInfo();
    const translate = useTranslate();
    const {open} = useNotification();
    const [isAllowedNewReview, setIsAllowedNewReview] = useState<boolean>();

    const {_id: establishmentId} = establishment;

    const [state, dispatch] = useReducer(reducer, initialState);

    const handleSetReview = (data: Action) => {
        dispatch(data);
    }

    const {refetch: refetchAllowed, data: dataIsAllowed} = useOne({
        resource: 'review/latestUserReview',
        id: establishmentId as string
    });
    const {refineCore: {onFinish, formLoading}, handleSubmit} = useForm<any, HttpError, any>({
        refineCoreProps: {
            action: 'create',
            resource: 'review/create',
            onMutationSuccess: (data) => {
                if (data?.data?.review && setReviews) {
                    setReviews((prevState) => [data?.data?.review, ...prevState]);
                }
            },
            successNotification: () => {
                handleClearAll();
                return {
                    type: 'success',
                    message: translate('notifications.createSuccess', {'resource': translate('home.show.reviews.one')})
                }
            },
            errorNotification: (data: any) => {
                return {
                    type: "error",
                    message: data?.response?.data?.error
                }
            }
        },
    });
    useEffect(() => {
        if (establishmentId) {
            (async () => {
                await refetchAllowed();
            })()
        }
    }, [establishmentId]);
    useEffect(() => {
        if (dataIsAllowed) {
            setIsAllowedNewReview(dataIsAllowed?.data?.isAllowedNewReview)
        }
    }, [dataIsAllowed]);

    const handleSend = async () => {
        try {
            for (const stateElement of Object.values(state)) {
                if (!stateElement) return handleNotification();
            }
            await onFinish({
                establishmentId: establishmentId,
                score: state?.score,
                title: state?.title,
                text: state?.text,
                check: state?.check
            });
        } catch (e: any) {
            open?.({
                type: 'error',
                message: e?.response?.data?.message,
                description: 'Error'
            })
        }
    }
    const variantTextArea: 'standard' | "filled" | 'outlined' = 'outlined';

    const someStyle = !device ? {
        '&::-webkit-scrollbar': {
            width: '7px',
            bgcolor: 'silver',
            borderRadius: '5px',
        },
        '&::-webkit-scrollbar-track': {
            'webkitBoxShadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',
            outline: '1px solid slategrey',
            bgcolor: 'steelblue',
            borderRadius: '5px',
            width: '5px'
        }
    } : {};


    const inputBgColor = 'common.black';

    const handleNotification = () => open?.({
        type: 'error',
        message: translate('notifications.allField')
    })
    const handleClearAll = () => {
        handleSetReview({
            type: 'SET_CLEAR',
            payload: null
        });
    }
    const isYourEstablishment = role === 'manager' && user?._id === establishment?.createdBy;

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            flex: 1,
            position: 'relative',
            height: '100%',
            bottom: 0,
            width: '100%',
            p: {xs: 1.5, sm: 2},
            bgcolor: 'modern.modern_1.main',
            color: 'common.white',
            borderRadius: '10px'
        }}>
            <Box
                component={'form'}
                sx={{
                    // maxWidth: '550px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    alignItems: 'start',
                    width: '100%',
                    "& .MuiFormHelperText-root": {
                        color: 'common.white',
                        fontSize: '16px',
                        fontWeight: 600
                    },
                    "& .MuiTextField-root": {
                        width: '100%',
                        "& textarea": {
                            width: '100%',
                            color: 'common.white',
                            "&::placeholder": {
                                color: 'common.white',
                            },
                            ...someStyle
                        }

                    },
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        "& fieldset": {
                            border: 'none !important',
                        }
                    }}
                    key={'1'}
                >
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            gap: 1,
                            alignItems: 'center',
                            justifyContent: 'start'
                        }}
                    >
                        <StarRating
                            disabled={isYourEstablishment || !isAllowedNewReview}
                            value={state?.score}
                            onChange={(value) => handleSetReview({type: 'SET_SCORE', payload: value})}
                        />
                        <Typography
                            variant={'h6'}
                            sx={{
                                color: 'common.white',
                                fontSize: '1rem'
                            }}
                        >
                            {translate('text.score.title')}
                            {
                                state?.score && state?.score > 0 && (
                                    ' ' + state?.score
                                )
                            }
                        </Typography>
                    </Box>
                    {
                        isYourEstablishment && (
                            <>
                                You cannot evaluate your own establishment
                            </>
                        )
                    }
                    {
                        !isAllowedNewReview && (
                            <>
                                {translate('home.show.reviews.isAllowedBlock')}
                            </>
                        )
                    }
                    {
                        !isYourEstablishment && state?.score && state?.score > 0 && (
                            <>
                                <Box
                                    sx={{
                                        width: '100%',
                                    }}
                                >
                                    <FormHelperText
                                        sx={{
                                            textTransform: 'capitalize'
                                        }}
                                    >
                                        {(translate('home.create.averageCheck')?.split(" ")[1] || "Check") + ' ₴'}
                                    </FormHelperText>
                                    <Box
                                        sx={{
                                            width: '100%',
                                            bgcolor: inputBgColor,
                                            borderRadius: '7px',
                                            maxWidth: '300px'
                                        }}
                                    >
                                        <TextField
                                            inputProps={{
                                                min: 0
                                            }}
                                            sx={{
                                                width: '100%',
                                                color: 'common.white',
                                                "& ::placeholder": {
                                                    textTransform: 'capitalize'
                                                }
                                            }}
                                            type={'number'}
                                            size={'small'}
                                            variant={'outlined'}
                                            value={state?.check || ''}
                                            onChange={(event) => handleSetReview({
                                                type: 'SET_CHECK',
                                                payload: Number(event.target.value)
                                            })}
                                            placeholder={'*' + `${translate('home.create.averageCheck')?.split(" ")[1] || "Check"}`}
                                            disabled={!isAllowedNewReview}
                                        />
                                    </Box>
                                </Box>
                                <Box
                                    sx={{
                                        width: '100%',
                                    }}
                                >
                                    <FormHelperText>
                                        {translate('text.title')}
                                    </FormHelperText>
                                    <Box
                                        sx={{
                                            width: '100%',
                                            bgcolor: inputBgColor,
                                            borderRadius: '7px',
                                        }}
                                    >
                                        <TextField
                                            sx={{
                                                width: '100%',
                                                color: 'common.white',
                                            }}
                                            type={'text'}
                                            size={'small'}
                                            variant={'outlined'}
                                            value={state.title || ''}
                                            onChange={(event) => handleSetReview({
                                                type: 'SET_TITLE',
                                                payload: event.target.value
                                            })}
                                            placeholder={'*' + translate("text.title")}
                                            disabled={!isAllowedNewReview}
                                        />
                                    </Box>
                                </Box>
                                <Box
                                    sx={{
                                        width: '100%'
                                    }}
                                >
                                    <FormHelperText>
                                        {translate('text.text')}
                                    </FormHelperText>
                                    <Box
                                        sx={{
                                            width: '100%',
                                            bgcolor: inputBgColor,
                                            borderRadius: '7px',
                                        }}
                                    >
                                        <TextField
                                            multiline
                                            value={state.text || ''}
                                            variant={variantTextArea}
                                            disabled={!isAllowedNewReview}
                                            maxRows={10}
                                            minRows={3}
                                            sx={{
                                                width: '100%',
                                            }}
                                            onKeyDown={(event) => handleKeyDownBlockEnter(event, state?.text)}
                                            placeholder={'*' + translate("text.text")}
                                            onChange={(event) => handleSetReview({
                                                type: 'SET_TEXT',
                                                payload: event.target.value
                                            })}
                                        />
                                    </Box>
                                </Box>
                                <Box sx={{
                                    width: '100%',
                                    display: 'flex',
                                    mt: 2,
                                    gap: 2,
                                    justifyContent: 'space-between'
                                }}>
                                    <Button
                                        variant={'text'}
                                        color={'error'}
                                        onClick={handleClearAll}
                                        sx={{
                                            textTransform: 'inherit',
                                        }}
                                    >
                                        {translate('buttons.cancel')}
                                    </Button>
                                    <Button
                                        variant={"contained"}
                                        color={"info"}
                                        endIcon={(formLoading || total > 0) ? <></> : <Add/>}
                                        onClick={handleSubmit(handleSend)}
                                        sx={{
                                            borderRadius: '7px',
                                            textTransform: 'inherit',
                                        }}
                                        disabled={!isAllowedNewReview}
                                    >
                                        {
                                            formLoading ?
                                                <CircularProgress id={'loadReview'} color={"secondary"} size={'25px'}/>
                                                : isAllowedNewReview
                                                    ? translate(total > 0 ? 'home.show.reviews.leaveReview' : 'home.show.reviews.leaveFirstReview')
                                                    : translate('home.show.reviews.isAllowedBlock')
                                        }
                                    </Button>
                                </Box>
                            </>
                        )
                    }
                </Box>
            </Box>
        </Box>
    );
};

