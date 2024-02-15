import {Button, CircularProgress, SxProps} from "@mui/material";
import {BookmarkBorderOutlined, BookmarkOutlined} from "@mui/icons-material";
import React, {useContext, useEffect, useState, MouseEvent} from "react";
import {useNotification, useTranslate} from "@refinedev/core";

import {axiosInstance} from "@/authProvider";
import {AppContext} from "@/contexts/AppContext";
import {CustomDrawer} from "@/components";
import {useMobile} from "@/hook";

interface IProps {
    id: string,
    color?: string | any,
    type: 'establishmentNews' | 'establishment',
    showText: boolean,
    bgColor?: string | any,
    style?: SxProps,
    title?: string
}

const BookMarkButton = ({id, color, bgColor, type, showText, style, title}: IProps) => {

    const {width} = useMobile();
    const {open} = useNotification();
    const translate = useTranslate();
    const {favoritePlaces, setFavoritePlaces} = useContext(AppContext);
    const [book, setBook] = useState<boolean>(false);
    const [addDelFav, setAddDelFav] = useState(false);

    useEffect(() => {
        const isInclude = favoritePlaces.some((value) => value.item === id && value.type === type);
        setBook(isInclude)
    }, [favoritePlaces, id, type])

    const toFromBook = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setAddDelFav(true)

        // await axiosInstance.post(`/users/addDeleteFavoritePlace`, {
        //     // id,
        //     placeId: id,
        //     refPath: type
        // });
        // if (book && id && type) {
        //     setFavoritePlaces(favoritePlaces.filter(value => !(value.item === id && value.type === type)))
        //     open?.({
        //         type: 'success',
        //         message: translate('notifications.deleteSuccess', {"resource": translate('profile.my_fav_places')})
        //     })
        // } else if (!book) {
        //     setFavoritePlaces([...favoritePlaces, {type: type, item: id}])
        //     open?.({
        //         type: "success",
        //         message: translate('notifications.addSuccess', {"resource": translate('profile.my_fav_places')})
        //     })
        // }
        // setAddDelFav(false)
        // setBook(!book)
    }
    return (
        <>
            <Button
                id={'caplBookmarkButton'}
                variant={'text'}
                sx={{
                    display: 'flex',
                    bgcolor: bgColor,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: showText ? 'space-evenly' : 'center',
                    gap: 1,
                    textTransform: 'inherit',
                    boxShadow: 'none',
                    p: '5px',
                    "& svg": {
                        fontSize: {xs: '26px', sm: '30px'},
                    },
                    ...style
                }}
                onClick={toFromBook}
            >
                {
                    addDelFav
                        ? <CircularProgress color={"secondary"} size={26}/>
                        : book
                            ?
                            <>
                                {showText && translate('home.show.delFromFav')}
                                <BookmarkOutlined sx={{
                                    fontSize: 26,
                                    cursor: 'pointer',
                                    transition: '300ms linear',
                                    color: color ? color : 'common.black'
                                }}/>
                            </> :
                            <>
                                {showText && translate('home.show.addToFav', {type: translate(`${type === 'establishment' ? 'home' : 'news'}.theOne`)})}
                                <BookmarkBorderOutlined sx={{
                                    fontSize: 26,
                                    cursor: 'pointer',
                                    transition: '300ms linear',
                                    color: color ? color : '#fcfcfc'
                                }}/>
                            </>
                }
                <CustomDrawer
                    anchor={"bottom"}
                    open={addDelFav}
                    toggleDrawer={setAddDelFav}
                    isOnlySwiper={true}
                    closeWithOtherData={() => setAddDelFav(false)}
                    title={'SAVE'}
                    isScaleRoot={true}
                    swiperClasses={'caplBookmarkButton'}
                    swiperDefaultSnap={300}
                    swiperSnapPoints={[300]}
                >
                    {title || ''} {title && ' - '} {type} - {id}
                </CustomDrawer>
            </Button>
        </>
    );
};
export default BookMarkButton;
