import {
    Box,
    IconButton,
    InputAdornment,
} from "@mui/material";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import {useTranslation} from "react-i18next";
import 'dayjs/locale/uk';
import 'dayjs/locale/en';
import {
    useInfiniteList,
} from "@refinedev/core";
import {Close} from "@mui/icons-material";

import {ReviewForm} from "@/components/establishment/utills/establishmentReviews/reviewForm";
import MoreButton from "@/components/buttons/MoreButton";
import ReviewCard from "../../../cards/reviewCard";
import Loading from "../../../loading/loading";
import {IReviews} from "@/interfaces/common";
import {For} from "million/react";

dayjs.extend(relativeTime);

interface IProps {
    id: string,
}

const EstablishmentReviews = ({id}: IProps) => {

    const {i18n} = useTranslation();

    const [reviews, setReviews] = useState<IReviews[]>([] as IReviews[]);

    const {
        data,
        isLoading,
        isError,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage
    } = useInfiniteList<IReviews>({
        resource: `review/allByEstablishmentId/${id}`,
        pagination: {
            pageSize: 20
        }
    });


    useEffect(() => {
        i18n.language === "ua" ? dayjs.locale('uk') : dayjs.locale('en')
    }, [i18n.language])

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
                position: 'relative',
                width: '100%',
            }}
        >
            <ReviewForm
                establishmentId={id}
                total={total}
            />
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
                            : (
                                <For each={reviews}>
                                    {
                                        (review) => (
                                            <ReviewCard review={review} key={review?._id}/>
                                        )
                                    }
                                </For>
                            )
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
