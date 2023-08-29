import {useForm, useGetIdentity, useTranslate} from "@refinedev/core";
import {Button, CircularProgress, SxProps} from "@mui/material";
import {Star, StarBorder} from "@mui/icons-material";

import {IGetIdentity, ISubscribe, ProfileProps} from "../../interfaces/common";
import React, {useEffect, useState} from "react";

type IProps = {
    establishmentId: string,
    style?: SxProps,
    showText: boolean,
    subscribe: ISubscribe
}
const SubscribeButton = ({establishmentId, style, subscribe, showText}: IProps) => {
    const translate = useTranslate();

    const [isSubscribe, setIsSubscribe] = useState(false);

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
    }, [subscribe, establishmentId]);

    const updateSubscribe = async () => {
        try {
            setIsSubscribe((prevState) => (!prevState));
            await onFinish({});
        } catch (e) {
            setIsSubscribe((prevState) => (!prevState));
        }
    }

    return (
        <Button
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
                display: 'flex',
                gap: showText ? 1 : 0,
                alignItems: 'center',
                ...style
            }}
            onClick={updateSubscribe}
        >
            {
                isSubscribe ? <Star/> : <StarBorder/>
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
