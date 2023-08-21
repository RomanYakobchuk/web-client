import {Button, CircularProgress, SxProps} from "@mui/material";
import {BookmarkBorderOutlined, BookmarkOutlined} from "@mui/icons-material";
import React, {useContext, useEffect, useLayoutEffect, useState, MouseEvent} from "react";
import {useGetIdentity, useNotification, useOne, useTranslate} from "@refinedev/core";

import {axiosInstance} from "../../authProvider";
import {IGetIdentity, ProfileProps} from "../../interfaces/common";
import {buttonStyle} from "../../styles";
import {ColorModeContext} from "../../contexts";
import {AppContext} from "../../contexts/AppContext";

interface IProps {
    id: string,
    color?: string | any,
    type: 'favoritePlaces' | string,
    showText: boolean,
    bgColor?: string | any,
    style?: SxProps
}

const BookMark = ({id, color, bgColor, type, showText, style}: IProps) => {

    const {open} = useNotification();
    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);
    const {favoritePlaces, setFavoritePlaces} = useContext(AppContext);

    const [book, setBook] = useState<any>();
    const [addDelFav, setAddDelFav] = useState(false);


    useEffect(() => {
        const isInclude = favoritePlaces.includes(id);
        isInclude ? setBook(true) : setBook(false)
    }, [favoritePlaces])

    const toFromBook = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setAddDelFav(true)

        await axiosInstance.post(`/users/${type === 'favoritePlaces' ? 'addDeleteFavoritePlace' : 'addDeleteFavoriteNews'}/${id}`, {
            id
        });
        if (book) {
            setFavoritePlaces(favoritePlaces.filter(value => value !== id))
            open?.({
                type: 'success',
                message: translate('notifications.deleteSuccess', {"resource": translate('profile.my_fav_places')})
            })
        } else if (!book) {
            setFavoritePlaces([...favoritePlaces, id])
            open?.({
                type: "success",
                message: translate('notifications.addSuccess', {"resource": translate('profile.my_fav_places')})
            })
        }
        // localStorage.setItem(
        //     "user",
        //     JSON.stringify(data?.data?.user)
        // );
        setAddDelFav(false)
        setBook(!book)
    }
    return (
        <Button
            variant={'contained'}
            sx={{
                display: 'flex',
                bgcolor: bgColor ? bgColor : mode === "dark" ? "#605454" : "#ffffff",
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: showText ? 'space-evenly' : 'center',
                gap: 1,
                textTransform: 'inherit',
                boxShadow: 'none',
                borderRadius: showText ? '20px' : '0 10px 0 10px',
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
                                color: color ? color : '#fcfcfc'
                            }}/>
                        </> :
                        <>
                            {showText && translate('home.show.addToFav')}
                            <BookmarkBorderOutlined sx={{
                                fontSize: 26,
                                cursor: 'pointer',
                                transition: '300ms linear',
                                color: color ? color : '#fcfcfc'
                            }}/>
                        </>
            }
        </Button>
    );
};
export default BookMark;
