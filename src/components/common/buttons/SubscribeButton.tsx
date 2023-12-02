import React, {useEffect, useState} from "react";
import {useForm, useTranslate} from "@refinedev/core";
import {Button, SxProps} from "@mui/material";
import {Star, StarBorder} from "@mui/icons-material";

import {ISubscribe} from "@/interfaces/common";
import {useUserInfo} from "@/hook";

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

    const [isSubscribe, setIsSubscribe] = useState<boolean>(subscribe?.institutionId === establishmentId);

    const {onFinish} = useForm({
        resource: `subscribe/updateOne/${establishmentId}`,
        action: 'create',
        errorNotification: (data: any) => {
            return {
                type: 'error',
                message: data?.response?.data?.error
            }
        },
        successNotification: (data: any) => {
            return {
                type: "success",
                message: data?.data?.message
            }
        }
    });

    useEffect(() => {
        if (subscribe) {
            setIsSubscribe(subscribe?.institutionId === establishmentId);
        }
    }, [subscribe?.institutionId]);

    const updateSubscribe = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        try {
            const res = await onFinish({});
            if (res?.data) {
                setIsSubscribe(res?.data?.isSubscribe);
            }
        } catch (e) {
            setIsSubscribe((prevState) => (!prevState));
        }
    }

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
