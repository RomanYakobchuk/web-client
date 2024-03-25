import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormHelperText,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import {useNotification, useOne, useTranslate} from "@refinedev/core";
import {useForm} from "@refinedev/react-hook-form";
import React, {useEffect, useReducer, useState} from "react";
import {Add} from "@mui/icons-material";

import {ReviewProgressBar} from "@/components/comments/reviewProgressBar";
import {handleKeyDownBlockEnter} from "@/keys";
import {useMobile} from "@/hook";
import {INewReview} from "@/interfaces/common";

import {reducer, initialState, Action} from "./reviewReducer";
import {StarRating} from "@/components/establishment/utills/main/starRating";
import {StepButtons} from "@/components/steps/stepButtons";

type TProps = {
    total?: number,
    establishmentId: string
}


export const ReviewForm = ({total = 1, establishmentId}: TProps) => {
    const {device} = useMobile();
    const translate = useTranslate();
    const {open} = useNotification();

    const [step, setStep] = useState<number>(0);

    const [like, setLike] = useState("");
    const [notLike, setNotLike] = useState("");
    const [grade, setGrade] = useState<number | null>(null);
    const [isAllowedNewReview, setIsAllowedNewReview] = useState<boolean>();

    const [state, dispatch] = useReducer(reducer, initialState);

    const handleSetReview = (data: Action) => {
        dispatch(data);
    }

    const {refetch: refetchAllowed, data: dataIsAllowed} = useOne({
        resource: 'review/latestUserReview',
        id: establishmentId as string
    });
    const {refineCore: {onFinish, formLoading}, handleSubmit} = useForm({
        refineCoreProps: {
            action: 'create',
            resource: 'review/create',
            successNotification: (data: any) => {
                return {
                    type: 'success',
                    message: data?.data?.message
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
        if (like?.length < 0 || grade === 0 || !grade || !like) {
            open?.({
                type: 'error',
                message: translate('notifications.allField')
            });
            return;
        }
        try {
            await onFinish({
                establishmentId: establishmentId,
                grade: grade,
                text: {
                    like: like,
                    notLike: notLike
                }
            })
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

    const scoreTitles = Object.entries(translate('text.score', {returnObjects: true}));

    const scoreTitle = scoreTitles[grade ? grade : 0][1];
    // const inputBgColor = mode === 'dark' ? '#747474' : '#dadada';
    const inputBgColor = 'modern.modern_3.second';


    const steps = (step: number) => {
        switch (step) {
            case 0:
                return (
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
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '95px calc(100% - 95px - 4px)',
                                    sm: '110px calc(100% - 110px - 8px)'
                                },
                                gap: {xs: 0.5, sm: 1},
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Tooltip
                                componentsProps={{
                                    tooltip: {
                                        sx: {
                                            color: '#fff'
                                        }
                                    }
                                }}
                                arrow
                                placement={'top'}
                                onClick={() => {
                                    handleSetReview({
                                        type: 'SET_SCORE',
                                        payload: null
                                    })
                                }}
                                title={translate('buttons.cancel')}
                            >
                                <Typography
                                    variant={'h6'}
                                    sx={{
                                        cursor: 'pointer',
                                        color: 'common.white',
                                        fontSize: {xs: '0.8rem', sm: '1rem'}
                                    }}
                                >
                                    {scoreTitle}
                                    {
                                        grade && grade > 0 && (
                                            ' ' + grade
                                        )
                                    }
                                </Typography>
                            </Tooltip>
                            {/*<StarRating*/}
                            {/*    value={state.score}*/}
                            {/*    onChange={(value) => handleSetReview({type: 'SET_SCORE', payload: value})}*/}
                            {/*/>*/}
                            <ReviewProgressBar
                                styles={{
                                    maxWidth: '100%',
                                    height: {xs: '26px', md: '30px'}
                                }}
                                value={state?.score || 0} onChange={(value) => {
                                handleSetReview({
                                    type: 'SET_SCORE',
                                    payload: value
                                })
                            }}/>
                        </Box>
                        {
                            state?.score && state?.score > 0 && (
                                <>
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
                                                onKeyDown={(event) => handleKeyDownBlockEnter(event, like)}
                                                placeholder={'*' + translate("text.text")}
                                                onChange={(event) => handleSetReview({
                                                    type: 'SET_TEXT',
                                                    payload: event.target.value
                                                })}
                                            />
                                        </Box>
                                    </Box>
                                </>
                            )
                        }
                    </Box>
                )
            case 1:
                return (
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            py: 2,
                            "& div.MuiFormControl-root": {
                                display: 'grid',
                                gridTemplateColumns: '100px calc(100% - 8px - 100px)',
                                width: '100%',
                                gap: 1,
                                justifyContent: 'end',
                                alignItems: 'center',
                                "& .MuiFormHelperText-root": {
                                    mx: 0
                                },
                                "& div.progressBarDivReview": {
                                    display: 'flex',
                                    width: '100%',
                                    justifyContent: 'end',
                                    //     width: '100%',
                                    //     maxWidth: '100%'
                                }
                            }
                        }}
                        key={'2'}
                    >
                        <FormControl
                            fullWidth
                        >
                            <FormHelperText
                                onClick={() => {
                                    handleSetReview({
                                        type: 'SET_SERVICE',
                                        payload: null
                                    })
                                }}
                            >
                                {translate('text.score.service')}
                            </FormHelperText>
                            <Box
                                className={'progressBarDivReview'}
                            >
                                <ReviewProgressBar
                                    value={state?.service || 0}
                                    onChange={(value) => {
                                        handleSetReview({
                                            type: 'SET_SERVICE',
                                            payload: value
                                        })
                                    }}
                                />
                            </Box>
                        </FormControl>
                        <FormControl
                            fullWidth
                        >
                            <FormHelperText
                                onClick={() => {
                                    handleSetReview({
                                        type: 'SET_ATMOSPHERE',
                                        payload: null
                                    })
                                }}
                            >
                                {translate('text.score.atmosphere')}
                            </FormHelperText>
                            <Box
                                className={'progressBarDivReview'}
                            >
                                <ReviewProgressBar
                                    value={state?.atmosphere || 0}
                                    onChange={(value) => {
                                        handleSetReview({
                                            type: 'SET_ATMOSPHERE',
                                            payload: value
                                        })
                                    }}
                                />
                            </Box>
                        </FormControl>
                        <FormControl
                            fullWidth
                        >
                            <FormHelperText
                                onClick={() => {
                                    handleSetReview({
                                        type: 'SET_QUALITY',
                                        payload: null
                                    })
                                }}
                            >
                                {translate('text.score.quality')}
                            </FormHelperText>
                            <Box
                                className={'progressBarDivReview'}
                            >
                                <ReviewProgressBar
                                    value={state?.quality || 0}
                                    onChange={(value) => {
                                        handleSetReview({
                                            type: 'SET_QUALITY',
                                            payload: value
                                        })
                                    }}
                                />
                            </Box>
                        </FormControl>
                    </Box>
                )
        }
    }

    const handleNotification = () => open?.({
        type: 'error',
        message: translate('notifications.allField')
    })
    const handleGoToStep = (value: number) => {
        if (value >= 0) {
            console.log(state)
            if (step === 0 && (!state.text || !state.title || !state.score)) {
                return handleNotification();
            }
            setStep(value)
        }
    }
    const handleClearAll = () => {
        handleSetReview({
            type: 'SET_CLEAR',
            payload: null
        });
        setStep(0);
    }
    const handleOnSubmit = (e?: (React.BaseSyntheticEvent<object, any, any> | undefined)) => {
        e?.preventDefault();
        for (const stateElement of Object.values(state)) {
            if (!stateElement) return handleNotification();
        }
        open?.({
            type: 'success',
            message: translate('notifications.createSuccess', {'resource': translate('home.show.reviews.one')})
        })
        handleClearAll();
        // handleSubmit(handleSend)
    }
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
                            // border: `1px solid ${mode === 'light' ? '#000' : '#fff'}`,
                            // backgroundColor: 'common.black',
                            color: 'common.white',
                            "&::placeholder": {
                                color: 'common.white',
                            },
                            ...someStyle
                        }

                    },
                }}
            >
                {steps(step)}
                {
                    state.score && state.score > 0 && (
                        <StepButtons
                            currentStep={step}
                            stepTitles={['1', '2']}
                            gotoStep={handleGoToStep}
                            buttonsVariant={'contained'}
                            onSubmit={handleOnSubmit}
                            textSubmit={
                                formLoading ?
                                    <CircularProgress id={'loadReview'} color={"secondary"} size={'25px'}/>
                                    : isAllowedNewReview
                                        ? translate(total > 0 ? 'home.show.reviews.leaveReview' : 'home.show.reviews.leaveFirstReview')
                                        : translate('home.show.reviews.isAllowedBlock')
                            }
                        />
                    )
                }
                {/*<Box sx={{*/}
                {/*    width: '100%',*/}
                {/*    display: 'flex',*/}
                {/*    justifyContent: 'end'*/}
                {/*}}>*/}
                {/*    <Button*/}
                {/*        variant={"contained"}*/}
                {/*        color={"info"}*/}
                {/*        endIcon={(formLoading || total > 0) ? <></> : <Add/>}*/}
                {/*        onClick={handleSubmit(handleSend)}*/}
                {/*        sx={{*/}
                {/*            // width: '100%',*/}
                {/*            borderRadius: '7px',*/}
                {/*            textTransform: 'inherit',*/}
                {/*        }}*/}
                {/*        disabled={!isAllowedNewReview}*/}
                {/*    >*/}
                {/*        {*/}
                {/*            formLoading ?*/}
                {/*                <CircularProgress id={'loadReview'} color={"secondary"} size={'25px'}/>*/}
                {/*                : isAllowedNewReview*/}
                {/*                    ? translate(total > 0 ? 'home.show.reviews.leaveReview' : 'home.show.reviews.leaveFirstReview')*/}
                {/*                    : translate('home.show.reviews.isAllowedBlock')*/}
                {/*        }*/}
                {/*    </Button>*/}
                {/*</Box>*/}
            </Box>
        </Box>
    );
};

