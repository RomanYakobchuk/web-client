import {useEffect, useState} from "react";

import {socket} from "@/socketClient";
import {INotification} from '@/interfaces/common'
import {useShow, useTranslate} from "@refinedev/core";
import {useUserInfo} from "@/hook";
import {UserNotificationPage} from "@/components/notifications";

const Notifications = () => {

    const translate = useTranslate();

    return (
        <div style={{
            // height: '100%',
        }}>
            <UserNotificationPage/>
        </div>
    );
};
export default Notifications;
