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
import {Typography} from "antd";
import {useForm} from "@refinedev/react-hook-form";

import {ColorModeContext} from "../../../contexts";
import Loading from "../../loading";
import {IReviews} from "../../../interfaces/common";
import {useMobile} from "../../../utils";

const {Title, Text} = Typography;


dayjs.extend(relativeTime);

interface IProps {
    id: string,
}

const InstitutionReviews = ({id}: IProps) => {

    const {i18n} = useTranslation();
    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);
    const {device} = useMobile();
    const {open} = useNotification();

    const [like, setLike] = useState("");
    const [notLike, setNotLike] = useState("");
    const [grade, setGrade] = useState<number | null>(null);
    const [isAllowedNewReview, setIsAllowedNewReview] = useState<boolean>();


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
        data: dataReviews,
        isLoading: isLoadingReviews,
        isError: isErrorReviews,
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
        if (like?.length < 0 || notLike?.length < 0 || grade === 0 || !grade || !like || !notLike) {
            open?.({
                type: 'error',
                message: translate('notifications.allField')
            });
            return;
        }
        await onFinish({
            institutionId: id,
            grade: grade,
            text: {
                like: like,
                notLike: notLike
            }
        })
    }
    const textColor = mode === "dark" ? "#e8dfdf" : '#000';

    if (isLoadingReviews) return device ? <Loading/> : <CircularProgress/>;
    if (isErrorReviews) return <div>Error</div>
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
                position: 'static',
                height: '100%',
                bottom: 0
            }}>
                <Box component={'form'} onSubmit={handleSubmit(handleSend)}>
                    {
                        isAllowedNewReview ? <>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 3
                            }}>
                                <Rating precision={0.5} size={"large"}
                                        value={grade}
                                        disabled={!isAllowedNewReview}
                                        onChange={(event, value) => {
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
                                    borderRadius: '10px'
                                }}
                                disabled={!isAllowedNewReview}
                                placeholder={translate("home.show.reviews.like")}
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
                        </> : <></>
                    }
                    <Button
                        variant={"outlined"}
                        color={"secondary"}
                        endIcon={formLoading || !isLoadingReviews ? <></> : <Add/>}
                        type={"submit"}
                        sx={{
                            width: '100%'
                        }}
                        disabled={!isAllowedNewReview}
                    >
                        {
                            !isAllowedNewReview
                                ? translate('home.show.reviews.isAllowedBlock')
                                : formLoading ? <CircularProgress id={'loadReview'} color={"secondary"} size={'25px'}/>
                                    : translate(dataReviews?.pages?.length > 0 ? 'home.show.reviews.leaveReview' : 'home.show.reviews.leaveFirstReview')
                        }
                    </Button>
                </Box>
            </Box>
            <Box sx={{
                flex: 8,
                height: '100%',
                borderRadius: '10px',
                bgcolor: mode === 'light' ? '#e6e3e3' : "#1a4679",
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                p: '20px',
            }}>
                {
                    dataReviews?.pages?.length > 0 ?
                        dataReviews?.pages?.map((page) =>
                            page?.data?.map((review) => (
                                <Box key={review?._id} sx={{
                                    display: 'flex',
                                    gap: 1,
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    borderBottom: '1px solid silver',
                                    pb: '10px'
                                }}>
                                    <Box sx={{
                                        display: 'flex',
                                        gap: 1,
                                    }}>
                                        <img style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '50%'
                                        }} src={review?.createdBy?.avatar} alt={"avatar"}/>
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 1
                                        }}>
                                            <Box sx={{
                                                color: textColor
                                            }}>
                                                {review?.createdBy?.name}
                                            </Box>
                                            <Rating value={review?.grade} precision={0.5} readOnly/>
                                            <Title
                                                style={{
                                                    color: textColor,
                                                    marginTop: '5px',
                                                    marginBottom: 0
                                                }}
                                                level={5}
                                            >
                                                {translate('home.show.reviews.like')}
                                            </Title>
                                            <Text
                                                style={{
                                                    color: textColor,
                                                    whiteSpace: 'break-spaces'
                                                }}
                                            >
                                                {review.text?.like}
                                            </Text>
                                            <Title
                                                style={{
                                                    color: textColor,
                                                    marginTop: '5px',
                                                    marginBottom: 0
                                                }}
                                                level={5}
                                            >
                                                {translate('home.show.reviews.notLike')}
                                            </Title>
                                            <Text
                                                style={{
                                                    color: textColor,
                                                    whiteSpace: 'break-spaces'
                                                }}
                                            >
                                                {review.text?.notLike}
                                            </Text>
                                        </Box>
                                    </Box>
                                    <Box sx={{
                                        fontSize: '12px'
                                    }}>
                                        {dayjs(review.createdAt).fromNow()}
                                    </Box>
                                </Box>
                            )))
                        : translate("home.show.reviews.notHave")
                }
                {
                    hasNextPage && (
                        <Button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                        >
                            {isFetchingNextPage ? 'Loading more...' : "Load more"}
                        </Button>
                    )
                }
            </Box>
        </Box>
    );
};
export default InstitutionReviews;
