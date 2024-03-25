import {Box, Button} from "@mui/material";
import {GetListResponse, useInfiniteList, useTranslate} from "@refinedev/core";
import {useContext, useEffect, useState} from "react";

import {INews} from "@/interfaces/common";
import NewsItem1Info from "@/components/cards/newsCards/newsItem_1_Info";
import Loading from "../../loading/loading";
import {ColorModeContext} from "@/contexts";
import {For} from "million/react";

interface IProps {
    id: string
}

const EstablishmentNews = ({id}: IProps) => {
    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);

    const [news, setNews] = useState<INews[]>([]);

    const {
        data,
        isLoading,
        isError,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage
    } = useInfiniteList<INews>({
        resource: `news/getAllByEstablishment/${id}`,
        pagination: {
            pageSize: 20
        }
    });

    const total = data?.pages?.length && data?.pages?.length > 0 ? data?.pages[0]?.total : 0;

    useEffect(() => {
        if (data?.pages) {
            const list = [].concat(...((data?.pages as any ?? [])?.map((page: GetListResponse<INews>) => page?.data)));
            setNews(list);
        }
    }, [data?.pages]);

    return (
        <Box
            sx={{
                width: '100%',
                minHeight: '300px',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                alignItems: 'start',
                justifyContent: 'start',
            }}
        >
            {
                isLoading
                    ? <Loading height={'200px'}/>
                    : isError
                        ? <Box>
                            Something went wrong (((
                        </Box>
                        : (<For each={news}>
                                {
                                    (value, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                width: '100%',
                                                bgcolor: 'common.black',
                                                boxShadow: `0px 0px 10px 0px ${mode === 'dark' ? 'rgba(50, 50, 50, 0.9)' : 'rgba(225, 225, 225, 0.9)'}`,
                                                p: '10px',
                                                borderRadius: '7px',
                                                "& div, & a, & span": {
                                                    color: 'common.white'
                                                },
                                                transition: '200ms linear',
                                                '&:hover': {
                                                    bgcolor: 'modern.modern_1.main'
                                                    // boxShadow: `0px 0px 10px 0px ${mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'}`,
                                                }
                                            }}
                                        >
                                            <NewsItem1Info
                                                style={{
                                                    width: '100%',
                                                    flexDirection: 'row !important',
                                                    "&::before": {
                                                        display: 'none'
                                                    },
                                                    gap: 2,
                                                    "& .newsTextContentCard": {
                                                        gap: 0.3,
                                                        width: 'calc(60% - 8px)',
                                                        "& > div > div": {
                                                            justifyContent: {xs: 'end', sm: 'space-between'}
                                                        }
                                                    },
                                                    "& .newsCardMedia": {
                                                        width: 'calc(40% - 8px)',
                                                        height: {xs: '140px', sm: '200px', lg: '220px'}
                                                    },
                                                    marginLeft: 0,
                                                    "& .newsTitleCard": {
                                                        order: -1,
                                                        fontSize: {xs: '17px', md: '22px'}
                                                    },
                                                    "& .newsPlaceCard": {
                                                        display: {xs: 'none', sm: 'flex'},
                                                    },
                                                    "& .newsCategoryCard": {
                                                        fontSize: {xs: '14px', md: '16px'}
                                                    }
                                                }}
                                                news={value}/>
                                        </Box>
                                    )
                                }
                            </For>
                        )
            }
            <Button
                sx={{
                    textTransform: 'inherit',
                    m: '10px auto',
                    borderRadius: '20px'
                }}
                variant={'contained'}
                color={'info'}
                disabled={!hasNextPage || isFetchingNextPage}
                onClick={() => fetchNextPage()}
            >
                {
                    isFetchingNextPage
                        ? translate('loading')
                        : hasNextPage
                            ? translate('buttons.loadMore')
                            : total === 0 ? translate('text.notResult') : translate('buttons.thatsAll')
                }
            </Button>
        </Box>
    );
};
export default EstablishmentNews
