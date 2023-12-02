import {ChangeEvent, ReactNode} from "react";
import {CredentialResponse} from "./google";
import {ContextStore} from "@uiw/react-md-editor";
import {INewsDataFormPlace} from "./formData";

export interface IUserLoginProps {
    email: string,
    password: string
}

export interface IPicture {
    url: string,
    name: string
}

export interface IColor {
    color: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
}

export interface IGetIdentity {
    user: ProfileProps,
    favoritePlaces: string[]
}

export interface IUser {
    _id: string,
    name: string,
    dOB: Date,
    email: string,

}

export interface IData {
    user: IUser | any,
    access_token: string,
    refresh_token: string,
    error?: any,
    favoritePlaces: string[],
    subscribedEstablishments: [{id: string}];
    countNotReadNotifications: number
}

export interface IUserRegisterProps {
    name: string,
    email: string,
    phone: number,
    password: string
}

export interface CustomButtonProps {
    type?: string,
    title: any,
    backgroundColor: string,
    color: string,
    fullWidth?: boolean,
    icon?: ReactNode,
    disabled?: boolean,
    handleClick?: () => void,

    width?: string | any
}

export interface ProfileProps {
    _id: any,
    name: string,
    status: string,
    avatar: string,
    email: string,
    allInstitutions?: Array | undefined,
    isActivated: boolean,
    dOB: Date | any,
    phone: number,
    phoneVerify: boolean,
    isAdmin?: boolean,
    favoritePlaces?: Array | undefined,
    favoriteNews?: Array | undefined,
    myReviews?: Array | undefined,
    createdAt?: Date | any,
    otherProps?: any
    user_comments?: IComment[] | [],
    blocked?: {
        isBlocked?: boolean,
        whyBlock?: string
    },
}

export interface IProfilePropsFilterVariables {
    search: string,
    isBlocked?: boolean,
    isActivated?: boolean,
    phoneVerify?: boolean,
    status: "user" | "manager" | "admin",
    title: string
}

export interface PropertyProps {
    otherProps?: any,
    _id: string,
    title: string,
    reviewsLength?: number,
    description: string,
    sendNotifications: boolean,
    pictures: {
        name: string,
        url: string
    }[],
    place: {
        city: string,
        address: string
    },
    type: string,
    workSchedule: {
        workDays: IWorkDay[],
        weekend: string,
    },
    location: {
        lng: number,
        lat: number
    },
    contacts: Array<string> | any,
    tags: Array<string>,
    verify?: "draft" | "rejected" | "published",
    rating: number,
    ratings?: Array<string> | Array<object> | any,
    reviews?: Array<String> | any,
    averageCheck: string,
    features: [{
        value: string
    }],
    createdBy?: string | any,
    variantForDisplay?: string | any,
    news?: any,
    createdAt?: Date | any,
    viewsContainer?: {
        viewsNumber?: number
    },
    freeSeats: string | IFreeSeats
}

export interface IFreeSeats {
    _id: string,
    establishmentId: string | PropertyProps,
    list: IFreeSeatsList[],
    allFreeSeats: number,
    isCombineTheSeats: boolean,
    createdAt?: Date,
    updatedAt?: Date,
}

export interface IFreeSeatsList {
    table: number,
    numberOfSeats: number,
    status: "free" | "reserved" | "",
    description?: string
}
export interface IFreeSeatsProps {
    isCombineTheSeats: boolean,
    table: number,
    numberOfSeats: number,
    status: IFreeSeatsList['status']
}
export interface IPropertyPropsFilterVariables {
    averageCheck_gte: number,
    averageCheck_lte: number,
    type: string,
    tag: string,
    title: string,
    city: string,
    search: string,
    verify?: "published" | "draft" | "rejected"
}

export interface IReviews {
    text: {
        like: string,
        notLike: string
    },
    _id: string,
    grade: number,
    institutionId: PropertyProps | any,
    createdBy: ProfileProps | any,
    createdAt: Date
}

export interface IComment {
    createdBy: ProfileProps | any,
    text: string,
    _id: string,
    createdAt: Date | any,
    establishmentId: {
        _id: string,
        pictures: IPicture[],
        title: string,
        type: string
    } | string,
    parentId: string | IComment,
    replies: IComment[],
    containerId?: string,
    repliesLength: number
}

export interface NewsProps {
    _id: string,
    index?: number,
    institutionId?: string,
    title: string,
    place: {
        city: string,
        address: string
    },
    dateEvent: [{
        schedule?: {
            from?: string,
            to?: string
        },
        time?: {
            from?: string,
            to?: string
        }
    }],
    pictures?: {
        name: string,
        url: string
    }[],
    category: string,
    description: string,
    status?: string,
    createdBy?: string,
    createdAt: Date | any
}

export interface IWorkDay {
    days: {
        from: number,
        to: number
    },
    time: {
        from: string,
        to: string,
    }
}

export interface ICity {
    name: string;
    _id: string;
}

export interface IConv {
    _id?: string,
    members?: string[],
    createdAt?: string
}


export interface IChat {
    members?: string[],

    _id?: string,

    message?: string
}


export interface IStar {
    otherProps?: any,
    stars?: number | any,
}


export interface INews {
    _id: string,
    institutionId?: string | PropertyProps,
    title: string,
    index?: number,
    createdAt: Date | any,
    status?: "published" | "draft" | "rejected",
    pictures: IPicture[],
    description: string,
    category?: "general" | "events" | "promotions",
    createdBy?: string,
    variantForDisplay?: string,
    dateEvent: INewsDateEvent[],
    publishAt?: {
        isPublish: boolean,
        datePublish: Date | any
    },
    place: INewsDataFormPlace
}

export interface INewsFilterVariables {
    date_event_gte: Date | any,
    date_event_lte: Date | any,
    title: string,
    category: "general" | "event" | "promotions",
    institution: string,
    status: "draft" | "published" | "rejected",
    search: string
}

export interface IOptionGroup {
    value: string;
    label: string | ReactNode;
    userId?: string,
    title?: string,
    id?: string,
    allInfo?: PropertyProps,
    key?: string
}

export interface IOptions {
    label: string | ReactNode;
    options: IOptionGroup[];
    title?: string,
    userId?: string,
    allInfo?: PropertyProps,
    id?: string,
    value?: string,
    key?: string
}


export interface ICategory {
    id: number;
    title: string;
}

export interface IPost {
    id: number;
    title: string;
    content: string;
    status: "published" | "draft" | "rejected";
    category: {
        id: number
    };
}

export interface IPostFilterVariables {
    _id: string;
    category: string;
    title: string;
    createdAt: Date
}

export interface IMenuItem {
    description: string,
    institutionId: string,
    title: string,
    category: string,
    weight: number,
    price: number,
    image: string,
    createdAt?: Date
}

export interface IMenu {
    category: string[] | any,
    menu: {
        createdAt?: Date,
        createdBy: string,
        fileMenu?: string,
        institutionId: string,
        items?: IMenuItem[],
        _id: string
    }
}

export interface INewsDateEvent {
    schedule?: {
        from?: Date | string | null,
        to?: Date | string | null
    },
    time?: {
        from?: string | Date | null,
        to?: string | Date | null
    }
}

export interface IMDEditor {
    set: ((value?: string, event?: ChangeEvent<HTMLTextAreaElement> | undefined, state?: ContextStore | undefined) => void) | undefined
}

export interface IConv {
    _id: string,
    members: string[],
    createdAt: string
}

export interface IMessage {
    _id?: string,
    conversationId?: string,
    sender: ProfileProps,
    text: string,
    pictures?: [],
    replyTo?: IMessage | any,
    memberType?: 'user' | 'institution',
    createdAt?: Date | any,
    isSent: boolean,
    isDelivered: boolean,
    isRead: boolean,
    isError: boolean
}

export interface IConversation {
    _id: string,
    userId: ProfileProps,
    managerId: ProfileProps,
    institutionId: PropertyProps,
    userName: string,
    institutionTitle: string,
    createdAt?: Date | any,
    lastMessage: {
        sender: string,
        text: string,
        updatedAt: Date
    },
    updatedAt: Date
}


export interface IReserve {
    institution: PropertyProps | string | any,
    _id: string,
    isAllowedEdit: boolean,
    fullName: string,
    user: string,
    isClientAppeared: boolean,
    manager: string,
    writeMe: boolean,
    whoPay: string,
    eventType: string,
    date: Date | string,
    isActive?: string,
    comment: string,
    desiredAmount: number,
    numberPeople: number,
    userStatus: {
        value: "accepted" | "rejected" | "draft",
        reasonRefusal?: string
    },
    institutionStatus: {
        value: "accepted" | "rejected" | "draft",
        reasonRefusal?: string,
        freeDateFor: [{
            day: Date,
            time: Date
        }] | null
    }
}

export interface IReserveFilterVariables {
    search: string,
    userStatus: {
        value: "accepted" | "rejected" | "draft" | string
    },
    institutionStatus: {
        value: "accepted" | "rejected" | "draft" | string
    },
    institution: string,
    day: Date
}

export interface ISubscribe {
    _id: string,
    subscriberId: string,
    institutionId: string,
    createdAt?: Date,
    updatedAt?: Date,
}

export interface INotificationSubscribe {
    _id: string,
    subscribeId: string,
    newsId: string,
    createdAt?: Date,
    updatedAt?: Date,
}

export interface INotification {
    _id: string,
    isDelete: boolean,
    forUser: {
        role: "manager" | "admin" | "user",
        userId?: string | ProfileProps
    },
    status: "usual" | "accepted" | "rejected",
    userId: string | ProfileProps,
    message: string,
    description: string,
    type: "newReservation" | "newMessage" | "newNews" |"newFunctional" | "newEstablishment" | "newUser",
    isRead: boolean,
    createdAt: Date,
    updateAt: Date
}