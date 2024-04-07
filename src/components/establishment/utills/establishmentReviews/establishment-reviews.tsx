import {
    Box, Button,
    IconButton,
    InputAdornment, Typography,
} from "@mui/material";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";

import 'dayjs/locale/uk';
import 'dayjs/locale/en';
import {
    useInfiniteList, useOne, useTranslate,
} from "@refinedev/core";
import {Close, StarRounded} from "@mui/icons-material";

import {ReviewForm} from "@/components/establishment/utills/establishmentReviews/reviewForm";
import MoreButton from "@/components/buttons/MoreButton";
import ReviewCard from "../../../cards/reviewCard";
import Loading from "../../../loading/loading";
import {IEstablishment, IReviews} from "@/interfaces/common";


interface IProps {
    establishment: IEstablishment,
}

type TCountStat = { "1": number, "2": number, "3": number, "4": number, "5": number };
const EstablishmentReviews = ({establishment}: IProps) => {

    const translate = useTranslate();

    const [countStat, setCountStat] = useState<{ countStat: TCountStat, count: number } | null>(null);
    const [reviews, setReviews] = useState<IReviews[]>([] as IReviews[]);

    const [rangeScore, setRangeScore] = useState<{ gte: number | null, lte: number | null }>({lte: null, gte: null});

    const {
        data,
        isLoading,
        isError,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useInfiniteList<IReviews>({
        resource: `review/allByEstablishmentId/${establishment?._id}`,
        pagination: {
            pageSize: 20
        },
        filters: [
            {field: 'score', value: rangeScore?.gte, operator: 'gte'},
            {field: 'score', value: rangeScore?.lte, operator: 'lte'},
        ]
    });
    const {data: dataCount} = useOne<{ countStat: TCountStat, count: number }>({
        resource: 'review/establishmentReviewStat',
        id: establishment?._id
    });

    useEffect(() => {
        if (data?.pages) {
            const list = [].concat(...((data?.pages as any ?? [])?.map((page: {
                data: IReviews[],
                total: number
            }) => page?.data ?? [])));
            setReviews(list);
        }
    }, [data]);

    useEffect(() => {
        if (dataCount?.data) {
            setCountStat({
                countStat: dataCount?.data?.countStat,
                count: dataCount?.data?.count
            })
        }
    }, [dataCount]);

    const handleFilterScore = (gte: number | null, lte: number | null) => {
        setRangeScore({
            lte: lte,
            gte: gte
        })
    }

    const total = data?.pages?.length && data?.pages?.length > 0 ? data?.pages[0]?.total : 0;
    console.log(rangeScore)
    return (
        <Box
            key={establishment?._id + 'reviewTab'}
            sx={{
                display: "flex",
                flexDirection: 'column',
                gap: 2.5,
                flex: 1,
                position: 'relative',
                width: '100%',
                color: 'common.white'
            }}
        >
            <ReviewForm
                setReviews={setReviews}
                establishment={establishment}
                total={countStat?.count || 0}
            />
            <Box>
                <Typography
                    variant={'h5'}
                >
                    {translate("all-reviews.all-reviews")}:
                    {" " + countStat?.count}
                </Typography>
                <Box
                    sx={{
                        overflowX: 'auto',
                        overflowY: 'hidden',
                        width: '100%',
                        maxWidth: '100%',
                        p: 0.5,
                        pb: {xs: 1, md: 0.5}
                    }}
                >
                    <Box
                        sx={{
                            width: 'fit-content',
                            display: 'flex',
                            gap: 1,
                            // alignItems: 'center',
                            justifyContent: 'start',
                            flexWrap: 'nowrap',
                            "& button": {
                                transition: '200ms linear',
                                textTransform: 'inherit',
                                fontSize: {xs: '1rem', sm: '1.2rem'},
                                px: 2,
                                py: 0.25,
                                display: 'flex',
                                alignItems: 'center',
                                borderRadius: '7px',
                                justifyContent: 'center',
                                "&:hover": {
                                    borderColor: 'info.main',
                                    color: 'info.main'
                                }
                            }
                        }}
                    >
                        <Button
                            variant={'text'}
                            sx={{
                                border: '2px solid transparent',
                                borderColor: !rangeScore?.gte && !rangeScore?.lte ? 'info.main' : '#c1c1c1',
                                color: !rangeScore?.gte && !rangeScore?.lte ? 'info.main' : 'common.white'
                            }}
                            onClick={() => handleFilterScore(null, null)}
                        >
                            {translate('favorite-places.type.all')}
                        </Button>
                        {
                            [
                                {
                                    count: countStat?.countStat?.["1"],
                                    title: 1,
                                    gte: 0,
                                    lte: 1.4
                                },
                                {
                                    count: countStat?.countStat?.["2"],
                                    title: 2,
                                    gte: 1.5,
                                    lte: 2.4
                                },
                                {
                                    count: countStat?.countStat?.["3"],
                                    title: 3,
                                    gte: 2.5,
                                    lte: 3.4
                                },
                                {
                                    count: countStat?.countStat?.["4"],
                                    title: 4,
                                    gte: 3.5,
                                    lte: 4.4
                                },
                                {
                                    count: countStat?.countStat?.["5"],
                                    title: 5,
                                    gte: 4.5,
                                    lte: 5
                                },
                            ]?.reverse()?.map((value) => (
                                <Button
                                    key={value?.title}
                                    variant={'text'}
                                    sx={{
                                        gap: 1,
                                        border: '2px solid transparent',
                                        borderColor: rangeScore?.gte === value?.gte && rangeScore?.lte === value?.lte ? 'info.main' : '#c1c1c1',
                                        color: rangeScore?.gte === value?.gte && rangeScore?.lte === value?.lte ? 'info.main' : 'common.white',
                                        "& svg": {
                                            color: rangeScore?.gte === value?.gte && rangeScore?.lte === value?.lte ? 'info.main' : 'common.white',
                                        }
                                    }}
                                    onClick={() => handleFilterScore(value?.gte, value?.lte)}
                                >
                                    <StarRounded fontSize={'large'}/>
                                    {value?.title}
                                    <Box
                                        component={'span'}
                                    >
                                        ({value?.count})
                                    </Box>
                                </Button>
                            ))
                        }
                    </Box>
                </Box>
            </Box>
            <Box sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                // maxWidth: '800px'
            }}>
                {
                    isLoading
                        ? <Loading height={'200px'}/>
                        : isError ? <div>Something went wrong (((</div>
                            : reviews?.length > 0 && reviews?.map((review) => (
                                <ReviewCard review={review} key={review?._id}/>
                            )
                        )
                }
                <MoreButton
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                    total={total || 0}
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
