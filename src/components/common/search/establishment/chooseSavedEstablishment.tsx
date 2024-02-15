import {useMobile, useProgressiveImage} from "@/hook";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Box, Typography} from "@mui/material";
import {useList, useTranslate} from "@refinedev/core";
import {CheckCircle, RadioButtonUnchecked} from "@mui/icons-material";

import {INews, PropertyProps} from "@/interfaces/common";
import {IFavPlaces} from "@/interfaces/types";
import {Loading} from "@/components";
import PlaceholderIgm from "../../../../../public/images/placeholder.png";
import {TruncateSingleText} from "@/utils";

type TProps = {
    userId: string,
    checkedItem: PropertyProps | INews,
    setCheckedItem: Dispatch<SetStateAction<PropertyProps | INews | null>>,
    type?: "establishment" | "establishmentNews",
    parentQuerySelectorForSetWidth: string
}
export const ChooseSavedEstablishment = ({
                                             userId,
                                             setCheckedItem,
                                             checkedItem,
                                             type = "establishment",
                                             parentQuerySelectorForSetWidth
                                         }: TProps) => {

    const {width: windowWidth, device} = useMobile();
    const translate = useTranslate();

    const [width, setWidth] = useState<number>(0);
    const [savedPlaces, setSavedPlaces] = useState<PropertyProps[] | null>(null);
    const parent = document.querySelector(parentQuerySelectorForSetWidth) as HTMLDivElement | null;

    const {data, isLoading, isError} = useList<IFavPlaces>({
        resource: `users/getByUserIdFavPlaces/${userId}`,
        pagination: {
            current: 1,
            pageSize: 30
        },
        filters: [
            {
                value: type,
                operator: 'eq',
                field: 'type'
            },
        ]
    });

    useEffect(() => {
        if (parent) {
            setWidth(parent?.offsetWidth)
        }
    }, [parent, windowWidth, device]);

    useEffect(() => {
        if (data?.data) {
            const items = data?.data?.map((value: IFavPlaces) => value?.item as PropertyProps)
            setSavedPlaces(items);
        }
    }, [data]);

    const sortedArray = savedPlaces?.sort((a, b) => (a?._id === checkedItem?._id) ? -1 : (b?._id === checkedItem?._id) ? 1 : a?.title?.localeCompare(b?.title));

    return (
        <Box
            sx={{
                width: {xs: '90vw', md: `${width}px`},
                bgcolor: 'common.black',
                borderRadius: '10px',
                p: 2,
                overflow: 'hidden'
            }}
        >
            <Typography
                variant={'h6'}
            >
                {translate('profile.my_fav_places', {"length": data?.total})}
            </Typography>
            <Box
                sx={{
                    width: {xs: `calc(90vw - ${32}px)`, md: `${width - 32}px`},
                    height: '150px',
                    overflowX: 'auto',
                    overflowY: 'hidden',
                }}
            >
                <Box
                    sx={{
                        overflow: 'hidden',
                        width: 'fit-content',
                        display: 'flex',
                        height: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'start',
                        gap: 1,
                        transition: 'all 300ms linear',
                        "*": {
                            transition: 'all 300ms linear',
                        }
                    }}
                >
                    {
                        isLoading
                            ? <Loading height={'80px'}/>
                            : isError ? <p>Something went wrong</p>
                                : (savedPlaces && savedPlaces?.length > 0 && sortedArray?.map((savedPlace, index) => (
                                    <SavedPlaceCard
                                        // order={savedPlace?._id === checkedItem?._id ? 0 : index + 1}
                                        item={savedPlace}
                                        key={savedPlace?._id + index}
                                        setCheckedItem={setCheckedItem}
                                        checkedItem={checkedItem}
                                    />)
                                ))
                    }
                </Box>
            </Box>
        </Box>
    );
};

type TSavedPlaceCard = {
    item: PropertyProps | INews,
    checkedItem: PropertyProps | INews,
    setCheckedItem: Dispatch<SetStateAction<PropertyProps | INews | null>>,
    order?: number
}
const SavedPlaceCard = ({item, checkedItem, setCheckedItem, order}: TSavedPlaceCard) => {
    const {pictures, title, _id} = item;

    const currentImage = pictures?.length > 0 ? pictures[0]?.url : "";

    const image = useProgressiveImage({src: currentImage});

    const handleCheck = () => {
        setCheckedItem(item);
    }
    return (
        <Box
            sx={{
                order: order ? order : 'unset',
                height: '100%',
                width: '200px',
                borderRadius: '10px',
                p: 0.5,
                border: `3px solid ${_id === checkedItem?._id ? 'cornflowerblue' : 'transparent'}`,
                "& svg": {
                    color: _id === checkedItem?._id ? 'cornflowerblue' : 'silver'
                },
                position: 'relative'
            }}
            onClick={handleCheck}
        >
            <Box
                sx={{
                    backgroundImage: `url("${image || PlaceholderIgm}")`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    borderRadius: '5px',
                    height: '100%',
                    width: '100%',
                }}
            >
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'end'
                }}>
                    {
                        _id === checkedItem?._id
                            ? <CheckCircle/>
                            : <RadioButtonUnchecked/>
                    }
                </Box>
                <Box
                    sx={{
                        position: 'absolute',
                        left: '10px',
                        bottom: '10px',
                        p: '4px 8px',
                        width: 'fit-content',
                        bgcolor: 'trba(0, 0, 0, 0.4)',
                        backdropFilter: 'blur(5px)',
                        borderRadius: '20px',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: 600
                    }}
                >
                    <TruncateSingleText str={title} width={'150px'}/>
                </Box>
            </Box>
        </Box>
    )
}