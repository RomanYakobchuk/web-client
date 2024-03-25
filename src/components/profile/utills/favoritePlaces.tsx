import React, {useEffect, useState} from "react";
import {Box} from "@mui/material";
import {useInfiniteList} from "@refinedev/core";

import {INews, IEstablishment} from "@/interfaces/common";
import {Loading} from "../../index";
import MoreButton from "@/components/buttons/MoreButton";
import {EstablishmentCard, VariantComponent} from "@/components";
import NewsItem1 from "@/components/cards/newsCards/newsItem1";
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
    type: "establishment" | "establishmentNews",
    item: INews | IEstablishment,
    userId: string
}
const arrayType = [
    {
        value: "" as "",
        title: "all"
    },
    {
        value: "establishment",
        title: "establishment"
    },
    {
        value: 'establishmentNews',
        title: 'news'
    }
];

type TType = "" | "establishment" | "establishmentNews";
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
    } = useInfiniteList<IEstablishment>({
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
                data: IEstablishment[],
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
                                    value?.type === 'establishment'
                                        ? value?.item ? <EstablishmentCard establishment={value?.item as IEstablishment}/> : ''
                                        : value?.item ? <NewsItem1 itemNews={value?.item as INews}/> : ''
                                }
                            </Box>
                        ))
                    }
                </Box>
            case "establishment":
                return <Box
                    sx={{
                        ...renderStyle
                    }}
                    key={'2'}>
                    <PropertiesList items={savedPlaces?.map((item) => item?.item as IEstablishment)}/>
                </Box>
            case "establishmentNews":
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
                            type={type === 'establishment' ? "establishment" : 'news'}
                            variant1Icon={type === 'establishmentNews' ? <ViewComfySharp/> : null}
                            variant2Icon={type === 'establishmentNews' ? (width < 600 ? <ViewStreamSharp/> :
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