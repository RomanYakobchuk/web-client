import {useInfiniteList, useTranslate} from "@refinedev/core";
import {Box, Button} from "@mui/material";
import React from "react";

import {INews} from "@/interfaces/common";
import Loading from "../../loading/loading";
import NewsCard from "@/components/cards/newsCards/NewsCard";

interface IProps {
    establishmentId: string,
    newsId: string
}

const OtherNews = ({establishmentId, newsId}: IProps) => {

    const translate = useTranslate();

    const {
        data,
        isLoading,
        isError,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage
    } = useInfiniteList<INews>({
        resource: `news/otherPlaceNews/${establishmentId}`,
        filters: [
            {
                field: 'newsId',
                operator: 'eq',
                value: newsId
            }
        ],
        pagination: {
            pageSize: 5
        },
        errorNotification: (data: any) => {
            return {
                type: 'error',
                message: data?.response?.data?.error
            }
        }
    })
    if (isLoading) return <Loading/>
    if (isError) return <div>Error</div>
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 2,
            height: '100%',
            maxHeight: {xs: '100%', lg: '900px'},
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
        }}>
            {
                data?.pages?.map((page) =>
                    page?.data?.length > 0 ?
                        page?.data?.map((itemNews, index) => (
                            <Box
                                key={itemNews?._id}
                                sx={{
                                    width: '100%',
                                    maxWidth: '350px'
                                }}
                            >
                                <NewsCard
                                    index={index}
                                    news={itemNews}
                                />
                            </Box>
                        ))
                        : translate('news.notHave')
                )
            }
            {
                hasNextPage && (
                    <Button
                        variant={"outlined"}
                        color={'secondary'}
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                    >
                        {translate(isFetchingNextPage ? 'loading' : 'buttons.loadMore')}
                    </Button>
                )
            }
        </Box>
    );
};
export default OtherNews
