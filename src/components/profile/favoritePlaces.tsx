import {PropertyProps} from "../../interfaces/common";
import {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import {AppContext} from "../../contexts/AppContext";
import {useFetch, useMobile} from "../../hook";
import {Loading} from "../index";
import {Box} from "@mui/material";

interface IProps {
    currentFavoritePlace: PropertyProps,
    setCurrentFavoritePlace: Dispatch<SetStateAction<PropertyProps>>
}

const FavoritePlaces = ({setCurrentFavoritePlace, currentFavoritePlace}: IProps) => {

    const {favoritePlaces} = useContext(AppContext);
    const {device} = useMobile();

    if (favoritePlaces?.length <= 0) {
        return null;
    }

    const [allInfoByFavPlaces, setAllInfoByFavPlaces] = useState<PropertyProps[]>([]);
    const {data, isLoading, isError} = useFetch<PropertyProps[]>({url: '/users/getUserFavPlaces', method: 'get'});

    useEffect(() => {
        if (data && data?.length > 0) {
            setAllInfoByFavPlaces(data)
        }
    }, [data]);

    const someStyle = !device ? {
        pb: '10px',
        '&::-webkit-scrollbar': {
            height: '7px',
            bgcolor: 'transparent',
            borderRadius: '5px'
        },
        '&::-webkit-scrollbar-track': {
            'webkitBoxShadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',
            outline: '1px solid slategrey',
            bgcolor: 'steelblue',
            borderRadius: '5px',
        }
    } : {
        '&::-webkit-scrollbar': {
            display: 'none'
        },
        '&::-webkit-scrollbar-track': {
            display: 'none'
        },
        '&::-webkit-scrollbar-thumb': {
            display: 'none'
        }
    };

    const handleChangeEstablishment = (item: PropertyProps) => {
        if (item?._id !== currentFavoritePlace?._id) {
            setCurrentFavoritePlace(item)
        }
    }

    useEffect(() => {
        if (currentFavoritePlace?._id && allInfoByFavPlaces?.length > 0) {
            const newList = [...allInfoByFavPlaces];
            const currentIndex = newList.findIndex(item => item?._id === currentFavoritePlace?._id);
            if (currentIndex !== -1) {
                newList.splice(currentIndex, 1);
                newList.sort((a, b) => a.title.localeCompare(b.title));

                // робимо елемент з currentFavoritePlace._id першим
                newList.unshift(allInfoByFavPlaces[currentIndex]);
            }
            setAllInfoByFavPlaces(newList)
        }
    }, [currentFavoritePlace?._id, allInfoByFavPlaces?.length]);

    if (isLoading) return <Loading height={'140px'}/>

    if (isError) return <Box sx={{
        color: 'common.white'
    }}>
        <p>Something went wrong</p>
        <div>
            {' '}💀 {'\n'}
            {'<'})){'>'} {'\n'}
            _| \_
        </div>
    </Box>;

    return (
        <Box sx={{
            width: '100%',
            overflowY: 'auto',
            ...someStyle
        }}>
            <Box sx={{
                width: 'fit-content',
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                {
                    allInfoByFavPlaces?.length > 0 && allInfoByFavPlaces?.map((item, index) => (
                            <Box
                                key={index}
                                onClick={() => handleChangeEstablishment(item)}
                                sx={{
                                    width: '120px',
                                    cursor: 'pointer',
                                    height: '120px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 0.5,
                                    p: '5px',
                                    borderRadius: '20px',
                                    border: `2px solid ${currentFavoritePlace?._id === item?._id ? 'blue' : 'silver'}`,
                                    "&:hover": {
                                        border: `2px solid blue`,
                                    }
                                }}
                            >
                                {
                                    item?.pictures?.length > 0 && (
                                        <img
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                borderRadius: '15px'
                                            }}
                                            src={item?.pictures[0]?.url}
                                            alt={item?.pictures[0]?.name}
                                        />
                                    )
                                }
                                <Box
                                    component={'span'}
                                    sx={{
                                        color: 'common.white'
                                    }}
                                >
                                    {item?.title}
                                </Box>
                            </Box>
                        )
                    )
                }
            </Box>
        </Box>
    );
};

export default FavoritePlaces