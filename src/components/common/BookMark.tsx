import {CircularProgress} from "@mui/material";
import {BookmarkBorderOutlined, BookmarkOutlined} from "@mui/icons-material";
import React, {useEffect, useLayoutEffect, useState} from "react";
import {useGetIdentity, useNotification, useOne, useTranslate} from "@refinedev/core";

import {axiosInstance} from "../../authProvider";
import {ProfileProps} from "../../interfaces/common";

interface IProps {
    id: string,
    otherProps?: any,
    color?: string | any,
    type: string
}

const BookMark = ({id, otherProps: setFavoritePlaces, color, type}: IProps) => {

    const {data: myProfile} = useGetIdentity<ProfileProps | any>();
    const {open} = useNotification();
    const translate = useTranslate();
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
        <>
            {
                addDelFav
                    ? <CircularProgress color={"secondary"}/>
                    : book
                        ? <BookmarkOutlined onClick={toFromBook} sx={{
                            fontSize: 40,
                            cursor: 'pointer',
                            transition: '300ms linear',
                            color: color ? color : '#fcfcfc'
                        }}/>
                        : <BookmarkBorderOutlined onClick={toFromBook} sx={{
                            fontSize: 40,
                            cursor: 'pointer',
                            transition: '300ms linear',
                            color: color ? color : '#fcfcfc'
                        }}/>
            }
        </>
    );
};
export default BookMark;
