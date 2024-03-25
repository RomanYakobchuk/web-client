import {useInfiniteList} from "@refinedev/core";
import {useEffect, useState} from "react";

import {IComment, IReviews} from "@/interfaces/common";
import {Box} from "@mui/material";
import {Loading} from "@/components";
import ReviewCard from "@/components/cards/reviewCard";
import MoreButton from "@/components/buttons/MoreButton";

interface IProps {
    id: string
}

const UserReviews = ({id}: IProps) => {

    const [reviews, setReviews] = useState<IReviews[]>([] as IReviews[]);
    const {
        data,
        isLoading,
        isError,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useInfiniteList({
        resource: `review/allByUserId/${id}`,
        pagination: {
            pageSize: 10
        },
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
    const total = data?.pages?.length && data?.pages?.length > 0 ? data?.pages[0]?.total : 0;

    return (
        <Box sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2
        }}>
            <Box sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 1
            }}>
                {
                    isLoading
                        ? <Loading height={'200px'}/>
                        : isError
                            ? <p>Error</p>
                            : reviews?.length > 0 && reviews?.map((review, index) => (
                            <Box
                                key={review?._id + index}
                            >
                                <ReviewCard review={review}/>
                            </Box>
                        ))
                }
            </Box>
            <MoreButton
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
                total={total}
            />
        </Box>
    );
};

export default UserReviews;