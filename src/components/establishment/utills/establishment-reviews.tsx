import {Box, Button, CircularProgress, Rating, TextareaAutosize} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
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
import {Add} from "@mui/icons-material";
import {useForm} from "@refinedev/react-hook-form";

import {ColorModeContext} from "../../../contexts";
import Loading from "../../loading/loading";
import {IReviews} from "../../../interfaces/common";
import ReviewCard from "../cards/reviewCard";
import MoreButton from "../../common/buttons/MoreButton";


dayjs.extend(relativeTime);

interface IProps {
    id: string,
}

const EstablishmentReviews = ({id}: IProps) => {

    const {i18n} = useTranslation();
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
        resource: `review/allByInstitutionId/${id}`,
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

                institutionId: id,
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

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: 'column',
                gap: 2.5,
                flex: 1,
                position: 'relative'
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
                        "& textarea": {
                            border: `1px solid ${mode === 'light' ? '#000' : '#fff'}`,
                            backgroundColor: 'common.black',
                            color: mode === 'light' ? '#000' : '#fff',
                            "&::placeholder": {
                                color: mode === 'light' ? '#000' : '#fff',
                            }
                        }
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
                    <TextareaAutosize
                        value={like}
                        style={{
                            resize: 'vertical',
                            minHeight: '100px',
                            width: '100%',
                            maxHeight: '200px',
                            padding: '10px',
                            borderRadius: '10px',
                        }}
                        disabled={!isAllowedNewReview}
                        placeholder={'*' + translate("home.show.reviews.like")}
                        onChange={(event) => setLike(event.target.value)}
                    />
                    <TextareaAutosize
                        value={notLike}
                        style={{
                            resize: 'vertical',
                            minHeight: '100px',
                            width: '100%',
                            maxHeight: '200px',
                            padding: '10px',
                            borderRadius: '10px'
                        }}
                        disabled={!isAllowedNewReview}
                        placeholder={translate("home.show.reviews.notLike")}
                        onChange={(event) => setNotLike(event.target.value)}
                    />
                    <Button
                        variant={"outlined"}
                        color={"secondary"}
                        endIcon={formLoading || !isLoading ? <></> : <Add/>}
                        type={"submit"}
                        sx={{
                            // width: '100%',
                            textTransform: 'inherit',
                        }}
                        disabled={!isAllowedNewReview}
                    >
                        {
                            !isAllowedNewReview
                                ? translate('home.show.reviews.isAllowedBlock')
                                : formLoading ? <CircularProgress id={'loadReview'} color={"secondary"} size={'25px'}/>
                                    : translate(data?.pages?.length && data?.pages?.length > 0 ? 'home.show.reviews.leaveReview' : 'home.show.reviews.leaveFirstReview')
                        }
                    </Button>
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
    )
        ;
};
export default EstablishmentReviews;
