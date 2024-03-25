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
    message?: string,
    access_token: string,
    refresh_token: string,
    error?: any,
    favoritePlaces: string[],
    subscribedEstablishments: [{ id: string }];
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
    _id: string,
    name: string,
    status: "admin" | "manager" | "user",
    avatar: string,
    email: string,
    allestablishments?: Array | undefined,
    isActivated: boolean,
    dOB: Date | any,
    uniqueIndicator: {
        value: string,
        type: "public" | "private"
    },
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

export interface IEstablishment {
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
    establishmentId: string | IEstablishment,
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

export interface IUserAgent {
    browser: {
        name: string,
        version: string,
        major: string
    },
    device: {
        model: string | undefined,
        type: string | undefined,
        vendor: string | undefined,
    },
    engine: {
        name: string,
        version: string,
    },
    os: {
        name: string,
        version: string
    }
}

export interface IOAuth {
    userId: string | ProfileProps,
    access_token: string,
    refresh_token: string,
    _id: string,
    userAgent: IUserAgent,
    createdAt?: Date,
    updatedAt?: Date
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
    establishmentId: IEstablishment | any,
    createdBy: ProfileProps | any,
    createdAt: Date
}

export interface INewReview {
    score: number | null,
    title: string,
    text: string,
    quality: number | null,
    atmosphere: number | null,
    service: number | null
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
    establishmentId?: string,
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
    establishmentId?: string | IEstablishment,
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
    establishment: string,
    status: "draft" | "published" | "rejected",
    search: string
}

export interface IOptionGroup {
    value: string;
    label: string | ReactNode;
    userId?: string,
    title?: string,
    id?: string,
    allInfo?: IEstablishment,
    key?: string
}

export interface IOptions {
    label: string | ReactNode;
    options: IOptionGroup[];
    title?: string,
    userId?: string,
    allInfo?: IEstablishment,
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
    establishmentId: string,
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
        establishmentId: string,
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
    _id: string,
    conversationId?: string,
    sender: ProfileProps | string,
    text: string,
    pictures?: [],
    replyTo?: IMessage | any,
    memberType?: 'user' | 'establishment',
    createdAt?: Date | any,
    updatedAt?: Date | any,
    status: 'sent' | 'read',
    read: string[]
}

export interface IConvMembers {
    user: ProfileProps | string,
    connectedAt: Date,
    indicator?: null | string,
    userId?: string,
    showInfoAs: {
        item: "user" | "establishment",
        id?: string | null
    }
}

export interface IConversation {
    _id: string,
    id: string | number,
    members: IConvMembers[],
    lastMessage: {
        sender: string,
        text: string,
        status: "sent" | "read",
        updatedAt: Date
    },
    access: "public" | "private",
    type: "group" | "private",
    depend: {
        item: "establishment" | "user" | "capl",
        id: string | { _id: string, avatar: string, name: string } | IEstablishment | ProfileProps | IReserve
    },
    chatName: string,
    picture: string,
    admin: string | ProfileProps,
    createdAt?: Date,
    updatedAt?: Date
}


export interface IReserve {
    establishment: IEstablishment | string | any,
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
    establishmentStatus: {
        value: "accepted" | "rejected" | "draft",
        reasonRefusal?: string,
        freeDateFor?: [Date | null] | null
    }
}

export interface IReserveFilterVariables {
    search: string,
    userStatus: {
        value: "accepted" | "rejected" | "draft" | string
    },
    establishmentStatus: {
        value: "accepted" | "rejected" | "draft" | string
    },
    establishment: string,
    day: Date
}

export interface ISubscribe {
    _id: string,
    subscriberId: string,
    establishmentId: string,
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
    type: "newReservation" | "newMessage" | "newNews" | "newFunctional" | "newEstablishment" | "newUser",
    isRead: boolean,
    createdAt: Date,
    updateAt: Date
}

export interface CustomObject {
    [key: string]: any;
}
