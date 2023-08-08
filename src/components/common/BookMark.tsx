import {Button, CircularProgress} from "@mui/material";
import {BookmarkBorderOutlined, BookmarkOutlined} from "@mui/icons-material";
import React, {useContext, useEffect, useLayoutEffect, useState} from "react";
import {useGetIdentity, useNotification, useOne, useTranslate} from "@refinedev/core";

import {axiosInstance} from "../../authProvider";
import {ProfileProps} from "../../interfaces/common";
import {buttonStyle} from "../../styles";
import {ColorModeContext} from "../../contexts";

interface IProps {
    id: string,
    otherProps?: any,
    color?: string | any,
    type: string,
    showText: boolean
}

const BookMark = ({id, otherProps: setFavoritePlaces, color, type, showText}: IProps) => {

    const {data: myProfile} = useGetIdentity<ProfileProps | any>();
    const {open} = useNotification();
    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);

    const [book, setBook] = useState<any>();
    const [addDelFav, setAddDelFav] = useState(false);


    useEffect(() => {
        const isInclude = myProfile[type]?.includes(id);
        isInclude ? setBook(true) : setBook(false)
    }, [myProfile[type]])

    const toFromBook = async () => {
        setAddDelFav(true)

        const data: any = await axiosInstance.post(`/users/${type === 'favoritePlaces' ? 'addDeleteFavoritePlace' : 'addDeleteFavoriteNews'}`, {
            id
        });
        if (book) {
            open?.({
                type: 'success',
                message: translate('notifications.deleteSuccess', {"resource": translate('profile.my_fav_places')})
            })
        } else if (!book) {
            open?.({
                type: "success",
                message: translate('notifications.addSuccess', {"resource": translate('profile.my_fav_places')})
            })
        }
        localStorage.setItem(
            "user",
            JSON.stringify(data?.data?.user)
        );
        setAddDelFav(false)
        setBook(!book)
    }
    return (
        <Button
            variant={'contained'}
            sx={{
                display: 'flex',
                bgcolor: mode === "dark" ? "#605454" : "#ffffff",
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: showText ? 'space-evenly' : 'center',
                gap: 1,
                textTransform: 'inherit',
                boxShadow: 'none',
                borderRadius: showText ? '20px' : '0 0 0 15px',
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
