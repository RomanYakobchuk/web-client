import {useNotification} from "@refinedev/core";

import {axiosInstance} from "@/authProvider";
import {
    ACCESS_TOKEN_KEY,
    localFavPlacesKey,
    localKeyEstablishment,
    localKeyLeaveCommentAs,
    REFRESH_TOKEN_KEY, USER_PROPERTY
} from "@/config/const";
import {googleLogout} from "@react-oauth/google";
import {deleteIndexedDB} from "@/indexedDB/indexedDBInit";

type TRes = {
    logOutCurrentDevice: () => Promise<void>,
    logOutAllDevice: () => Promise<void>,
    logOutSpecificSession: (id: string) => Promise<void>,
}
export const useUserLogout = (): TRes => {
    const {open} = useNotification();
    const successNotification = () => {
        open?.({
            type: "success",
            message: "Logout success",
            description: 'SUCCESS'
        })
    }
    const errorNotification = () => {
        open?.({
            type: "error",
            message: "Logout error",
            description: 'ERROR'
        })
    }
    const logOutAllDevice = async () => {
        try {
            await logOutUser.allDevice();
            successNotification();
        } catch (e) {
            console.log(e);
            errorNotification();
        }
    }
    const logOutCurrentDevice = async () => {
        try {
            await logOutUser.currentDevice();
            successNotification();
        } catch (e) {
            console.log(e);
            errorNotification();
        }
    }
    const logOutSpecificSession = async (id: string) => {
        try {
            if (id) {
                await logOutUser.specificSession(id);
                successNotification();
            }
        } catch (e) {
            console.log(e);
            errorNotification();
        }
    }
    return {
        logOutAllDevice,
        logOutCurrentDevice,
        logOutSpecificSession,
    }
}
export const logOutUser = {
    specificSession: async (id: string) => {
        await axiosInstance.post(`/auth/logoutSpecificDevices/${id}`);
    },
    currentDevice: async () => {
        await axiosInstance.post('/auth/logout');
    },
    allDevice: async () => {
        await axiosInstance.post('/auth/logoutAllDevices');
    }
}
export const clearUserAllData = async () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(localKeyLeaveCommentAs);
    localStorage.removeItem(localKeyEstablishment);
    localStorage.removeItem("user");
    localStorage.removeItem(localFavPlacesKey);
    localStorage.removeItem(USER_PROPERTY);
    googleLogout();
    deleteIndexedDB();
    FB?.getLoginStatus(function (response) {
        if (response.status === 'connected') {
            FB?.logout()
        }
    });
}