import React, {useEffect, useState} from "react";
import {Box} from "@mui/material";
import {useInfiniteList} from "@refinedev/core";

import {INews, PropertyProps} from "@/interfaces/common";
import {Loading} from "../../index";
import MoreButton from "@/components/common/buttons/MoreButton";
import {Variant2EstablishmentCard, VariantComponent} from "@/components";
import NewsItem1 from "@/components/news/cards/newsItem1";
import {SearchByTypeComponent} from "@/components/common/search";
import {GridViewSharp, ViewComfySharp, ViewStreamSharp} from "@mui/icons-material";
import {useMobile} from "@/hook";
import PropertiesList from "@/components/establishment/utills/lists/propertiesList";
import NewsList from "@/components/news/lists/newsList";

type IProps = {
    id: string
}
type TSavedPlaces = {
    _id: string,
    type: "institution" | "institutionNews",
    item: INews | PropertyProps,
    userId: string
}
const arrayType = [
    {
        value: "" as "",
        title: "all"
    },
    {
        value: "institution",
        title: "establishment"
    },
    {
        value: 'institutionNews',
        title: 'news'
    }
];

type TType = "" | "institution" | "institutionNews";
const FavoritePlaces = ({id}: IProps) => {

    const {width} = useMobile();

    const [type, setType] = useState<TType>("")
    const [savedPlaces, setSavedPlaces] = useState<TSavedPlaces[]>([] as TSavedPlaces[]);

    const {
        data,
        isLoading,
        isError,
        hasNextPage,
        fetchNextPage,
        isFetching,
        isFetchingNextPage,
    } = useInfiniteList<PropertyProps>({
        resource: `users/getByUserIdFavPlaces/${id}`,
        pagination: {
            pageSize: 20
        },
        filters: [
            {
                value: type,
                operator: 'eq',
                field: 'type'
            },
            {
                value: id,
                field: 'userId',
                operator: 'eq'
            }
        ]
    });

    useEffect(() => {
        if (data?.pages) {
            const list = [].concat(...((data?.pages as any ?? [])?.map((page: {
                data: PropertyProps[],
                total: number
            }) => page?.data ?? [])));
            setSavedPlaces(list);
        }
    }, [data]);
    const total = data?.pages?.length && data?.pages?.length > 0 ? data?.pages[0]?.total : 0;

    const renderStyle = {
        width: '100%'
    }

    const render = (type: TType) => {
        switch (type) {
            case "":
                return <Box
                    sx={{
                        ...renderStyle,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}
                    key={'1'}>
                    {
                        savedPlaces?.map((value, index) => (
                            <Box
                                key={index}
                                sx={{
                                    width: '100%'
                                }}
                            >
                                {
                                    value?.type === 'institution'
                                        ? <Variant2EstablishmentCard establishment={value?.item as PropertyProps}/>
                                        : <NewsItem1 itemNews={value?.item as INews}/>
                                }
                            </Box>
                        ))
                    }
                </Box>
            case "institution":
                return <Box
                    sx={{
                        ...renderStyle
                    }}
                    key={'2'}>
                    <PropertiesList items={savedPlaces?.map((item) => item?.item as PropertyProps)}/>
                </Box>
            case "institutionNews":
                return <Box
                    sx={{
                        ...renderStyle
                    }}
                    key={'3'}>
                    <NewsList news={savedPlaces?.map((item) => item?.item as INews)}/>
                </Box>
        }
    }

    return (
        <Box sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            alignItems: 'start'
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: type ? 2 : 0,
                alignItems: 'start'
            }}>
                <SearchByTypeComponent
                    type={type}
                    setType={setType}
                    sortTranslatePath={"favorite-places.type"}
                    arrayType={arrayType}
                />
                {
                    type && (
                        <VariantComponent
                            type={type === 'institution' ? "establishment" : 'news'}
                            variant1Icon={type === 'institutionNews' ? <ViewComfySharp/> : null}
                            variant2Icon={type === 'institutionNews' ? (width < 600 ? <ViewStreamSharp/> :
                                <GridViewSharp/>) : null}
                        />
                    )
                }
            </Box>
            <Box sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                justifyContent: 'center'
            }}>
                {
                    (isLoading) ? <Loading height={'200px'}/>
                        : isError ? <Box sx={{
                                color: 'common.white'
                            }}>
                                <p>Something went wrong</p>
                                <div>
                                    {' '}💀 {'\n'}
                                    {'<'})){'>'} {'\n'}
                                    _| \_
                                </div>
                            </Box>
                            : savedPlaces?.length > 0 && render(type)
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

export default FavoritePlaces