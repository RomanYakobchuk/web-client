import {INotification} from "@/interfaces/common";
import {axiosInstance} from "@/authProvider";
import {socket} from "@/socketClient";

type TValue = {
    status: INotification['status'],
    forUser: { role: "user" | "manager" | "admin", userId?: string },
    description: string,
    typeNotification: INotification['type'],
    userId: string
}
type TRes = {
    sendNotification: (value: TValue) => Promise<void>
}
const SOCKET_URL = import.meta.env.VITE_APP_SOCKET_API;

export const useSendNotification = (): TRes => {
    const sendNotification = async (value: TValue) => {
        const {forUser, typeNotification, userId, status, description} = value;
        const res = await axiosInstance.post(`${SOCKET_URL}/socket/api/v1/notification/create`, {
            userId: userId,
            description: description,
            status: status,
            forUser: forUser,
            typeNotification: typeNotification,
            isRead: false,
            isDelete: false
        })
        if (res?.data) {
            socket?.emit('createNewNotification', {
                userId: forUser?.userId,
                notification: res?.data
            })
        }
    }

    return {
        sendNotification
    }
}
