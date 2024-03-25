import React, {useEffect, useState} from "react";
import {useForm, useTranslate} from "@refinedev/core";
import {Button, SxProps} from "@mui/material";
import {Star, StarBorder} from "@mui/icons-material";

import {ISubscribe} from "@/interfaces/common";
import {useUserInfo} from "@/hook";
// import {useSubscribes} from "@/indexedDB";

type IProps = {
    establishmentId: string,
    style?: SxProps,
    showText: boolean,
    subscribe: ISubscribe,
    createdBy: string
}
const SubscribeButton = ({establishmentId, style, subscribe, showText, createdBy}: IProps) => {
    const {user} = useUserInfo();

    const translate = useTranslate();
    // const {findSubscribe, addSubscribe, deleteSubscribe} = useSubscribes();


    const [isSubscribe, setIsSubscribe] = useState<boolean>(subscribe?.establishmentId === establishmentId);

    const {onFinish, mutationResult: {data}} = useForm({
        resource: `subscribe/updateOne/${establishmentId}`,
        action: 'create',
        errorNotification: (data: any) => {
            return {
                type: 'error',
                message: data?.response?.data?.error
            }
        },
        successNotification: (data: any) => {
            console.log(data)
            return {
                type: "success",
                message: data?.data?.message
            }
        }
    });

    // useEffect(() => {
    //     if (establishmentId) {
    //         const isExist = findSubscribe({establishmentId: establishmentId});
    //         setIsSubscribe(!!isExist);
    //     }
    // }, [establishmentId]);

    useEffect(() => {
        if (subscribe) {
            setIsSubscribe(subscribe?.establishmentId === establishmentId);
        }
    }, [subscribe?.establishmentId]);

    const updateSubscribe = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        try {
            await onFinish({});
        } catch (e) {
            setIsSubscribe((prevState) => (!prevState));
        }
    }
    // useEffect(() => {
    //     if (data?.data) {
    //         if (data?.data?.isSubscribe) {
    //             (async () => {
    //                 await addSubscribe({
    //                     _id: establishmentId,
    //                     establishmentId: establishmentId
    //                 })
    //             })()
    //         } else {
    //             (async () => {
    //                await deleteSubscribe(establishmentId)
    //             })()
    //         }
    //         // console.log(data?.data);
    //         //
    //         // setIsSubscribe(data?.data?.isSubscribe);
    //     }
    // }, [data?.data, addSubscribe, deleteSubscribe]);

    return (
        <Button
            disabled={user?._id === createdBy}
            variant={'contained'}
            sx={{
                borderRadius: '7px',
                textTransform: 'capitalize',
                "&:hover": {
                    bgcolor: '#c82645',
                    color: '#e7e7ed'
                },
                "&:hover svg": {
                    color: '#e7e7ed'
                },
                bgcolor: '#ea2a4f',
                color: '#f0f0f5',
                minWidth: '20px',
                p: '5px',
                "& svg": {
                    fontSize: {xs: '26px', sm: '30px'}
                },
                display: 'flex',
                gap: showText ? 1 : 0,
                alignItems: 'center',
                ...style
            }}
            onClick={updateSubscribe}
        >
            {
                isSubscribe ? <Star className={''}/> : <StarBorder/>
            }
            {
                showText && (
                    translate(`notification.subscribe.${isSubscribe}`)
                )
            }
        </Button>
    );
};
export default SubscribeButton;
