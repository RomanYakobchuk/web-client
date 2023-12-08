import {INotification} from "@/interfaces/common";

export const getNewNotificationStatus = (value: INotification['status'], role: 'user' | "manager") => {
    const status = {
        usual: 'message',
        accepted: description(role, "accepted"),
        rejected: description(role, 'rejected'),
    }
    return status[value]
}
const description = (role: 'user' | "manager", type: 'accepted' | "rejected") => {
    const resAccepted = {
        user: 'accepted',
        manager: 'userAccepted',
    }
    const resRejected = {
        user: 'rejected',
        manager: 'userRejected',
    }
    const byType = {
        accepted: resAccepted[role],
        rejected: resRejected[role]
    }
    return byType[type];
}
