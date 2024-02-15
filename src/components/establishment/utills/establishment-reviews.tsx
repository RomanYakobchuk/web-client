import {
    Box,
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    Rating,
    TextField,
} from "@mui/material";
import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import {useTranslation} from "react-i18next";
import 'dayjs/locale/uk';
import 'dayjs/locale/en';
import {
    useInfiniteList,
    useNotification,
    useOne,
    useTranslate
} from "@refinedev/core";
import {Add, Close} from "@mui/icons-material";
import {useForm} from "@refinedev/react-hook-form";

import {ColorModeContext} from "@/contexts";
import Loading from "../../loading/loading";
import {IReviews} from "@/interfaces/common";
import ReviewCard from "../cards/reviewCard";
import MoreButton from "../../common/buttons/MoreButton";
import {useMobile} from "@/hook";
import {handleKeyDownBlockEnter} from "@/keys";


dayjs.extend(relativeTime);

interface IProps {
    id: string,
}

const EstablishmentReviews = ({id}: IProps) => {

    const {i18n} = useTranslation();
    const {device} = useMobile();
    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);
    const {open} = useNotification();

    const [like, setLike] = useState("");
    const [notLike, setNotLike] = useState("");
    const [grade, setGrade] = useState<number | null>(null);
    const [isAllowedNewReview, setIsAllowedNewReview] = useState<boolean>();

    const [reviews, setReviews] = useState<IReviews[]>([] as IReviews[]);

    const {refetch: refetchAllowed, data: dataIsAllowed} = useOne<any>({
        resource: 'review/latestUserReview',
        id: id as string
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

    const {
        data,
        isLoading,
        isError,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage
    } = useInfiniteList<IReviews>({
        resource: `review/allByestablishmentId/${id}`,
        pagination: {
            pageSize: 20
        }
    });


    useEffect(() => {
        if (id) {
            (async () => {
                await refetchAllowed();
            })()
        }
    }, [id]);
    useEffect(() => {
        if (dataIsAllowed) {
            setIsAllowedNewReview(dataIsAllowed?.data?.isAllowedNewReview)
        }
    }, [dataIsAllowed]);

    useEffect(() => {
        i18n.language === "ua" ? dayjs.locale('uk') : dayjs.locale('en')
    }, [i18n.language])

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

                establishmentId: id,
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

    useEffect(() => {
        if (data?.pages) {
            const list = [].concat(...((data?.pages as any ?? [])?.map((page: {
                data: IReviews[],
                total: number
            }) => page?.data ?? [])));
            setReviews(list);
        }
    }, [data]);
    const total = data?.pages?.length && data?.pages?.length > 0 ? data?.pages[0]?.total : 0;

    const variantTextArea: 'standard' | "filled" | 'outlined' = 'standard';

    const maxUnLikeLength = 700, maxLikeLength = 700;

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
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: 'column',
                gap: 2.5,
                flex: 1,
                position: 'relative',
                width: '100%'
            }}
        >
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                flex: 1,
                position: 'relative',
                height: '100%',
                bottom: 0,
                width: '100%'
            }}>
                <Box
                    component={'form'}
                    onSubmit={handleSubmit(handleSend)}
                    sx={{
                        maxWidth: '550px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        alignItems: 'start',
                        width: '100%',
                        "& .MuiTextField-root": {
                            "& > div": {
                                pb: '10px',
                                alignItems: 'end'
                            },
                            width: '100%',
                            "& textarea": {
                                width: '100%',
                                // border: `1px solid ${mode === 'light' ? '#000' : '#fff'}`,
                                // backgroundColor: 'common.black',
                                color: mode === 'light' ? '#000' : '#fff',
                                "&::placeholder": {
                                    color: mode === 'light' ? '#000' : '#fff',
                                },
                                ...someStyle
                            }

                        },
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <Rating precision={0.5} size={"large"}
                                value={grade}
                                disabled={!isAllowedNewReview}
                                onChange={(_, value) => {
                                    setGrade(value)
                                }}
                        />
                    </Box>
                    <TextField
                        multiline
                        value={like}
                        variant={variantTextArea}
                        disabled={!isAllowedNewReview}
                        inputProps={{
                            maxLength: maxLikeLength
                        }}
                        maxRows={10}
                        InputProps={{
                            endAdornment: <AdornmentBtn value={like} setValue={setLike} maxValueLength={maxLikeLength}/>
                        }}
                        onKeyDown={(event) => handleKeyDownBlockEnter(event, like)}
                        placeholder={'*' + translate("home.show.reviews.like")}
                        onChange={(event) => setLike(event.target.value)}
                    />
                    <TextField
                        value={notLike}
                        variant={variantTextArea}
                        multiline
                        disabled={!isAllowedNewReview}
                        inputProps={{
                            maxLength: maxUnLikeLength
                        }}
                        maxRows={10}
                        InputProps={{
                            endAdornment: <AdornmentBtn value={notLike} setValue={setNotLike}
                                                        maxValueLength={maxUnLikeLength}/>
                        }}
                        placeholder={translate("home.show.reviews.notLike")}
                        onChange={(event) => setNotLike(event.target.value)}
                        onKeyDown={(event) => handleKeyDownBlockEnter(event, notLike)}
                    />
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'end'
                    }}>
                        <Button
                            variant={"contained"}
                            color={"info"}
                            endIcon={formLoading || !isLoading ? <></> : <Add/>}
                            type={"submit"}
                            sx={{
                                // width: '100%',
                                borderRadius: '7px',
                                textTransform: 'inherit',
                            }}
                            disabled={!isAllowedNewReview}
                        >
                            {
                                formLoading ? <CircularProgress id={'loadReview'} color={"secondary"} size={'25px'}/>
                                    : isAllowedNewReview
                                        ? translate(total > 0 ? 'home.show.reviews.leaveReview' : 'home.show.reviews.leaveFirstReview')
                                        : translate('home.show.reviews.isAllowedBlock')
                            }
                        </Button>
                    </Box>
                </Box>
            </Box>
            <Box sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                maxWidth: '800px'
            }}>
                {
                    isLoading
                        ? <Loading height={'200px'}/>
                        : isError ? <div>Something went wrong (((</div>
                            : reviews?.map((review) => (
                                <ReviewCard review={review} key={review?._id}/>
                            ))
                }
                <MoreButton
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                    total={total}
                />
            </Box>
        </Box>
    );
};

type TAdornmentBtnProps = {
    value: string,
    setValue: Dispatch<SetStateAction<string>>,
    maxValueLength: number,
    isCanClear?: boolean
}
export const AdornmentBtn = ({value, setValue, maxValueLength, isCanClear = true}: TAdornmentBtnProps) => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        }}>
            {
                value?.length > 0 && isCanClear && (
                    <IconButton onClick={() => setValue('')}>
                        <Close/>
                    </IconButton>
                )
            }
            <InputAdornment sx={{
                fontSize: {xs: '12px', md: '14px'}
            }} position={'end'}>{value?.length}/{maxValueLength}</InputAdornment>
        </Box>
    )
}
export default EstablishmentReviews;
