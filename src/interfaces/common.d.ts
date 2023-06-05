import {FormEventHandler, ReactNode} from "react";
import {FieldValues} from "react-hook-form";
import {BaseRecord, CreateResponse, UpdateResponse} from "@refinedev/core";

export interface IUserLoginProps {
    email: string,
    password: string
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
    error?: any
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
    allInstitutions: Array | undefined,
    isActivated: boolean,
    dOB: Date | any,
    phone: number,
    phoneVerify: boolean,
    isAdmin?: boolean,
    favoritePlaces: Array | undefined,
    favoriteNews?: Array | undefined,
    myReviews: Array | undefined,
    createdAt?: Date | any,
    otherProps?: any
    user_comments: IComment[] | [],
    blocked?: {
        isBlocked?: boolean,
        whyBlock?: string
    } ,
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
    description: string,
    otherPhoto: Array | undefined,
    place: {
        city: string,
        address: string
    },
    type: string,
    mainPhoto: string,
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
    features: Array<string>,
    createdBy?: string | any,
    variantForDisplay?: string | any,
    news?: any,
    createdAt?: Date | any,
    views?: {
        viewsNumber?: number
    }
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
    institutionId: {
        _id: string,
        mainPhoto: string,
        title: string,
        type: string
    },
    parentCommentId: string | any,
    replies: IComment[],
    containerId?: string
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
    mainPhoto: string,
    photos?: Array<string>,
    category: string,
    description: string,
    status?: string,
    createdBy?: string,
    createdAt: Date | any
}

export interface IWorkDay {
    days: {
        from: string,
        to: string
    },
    time: {
        from: Date | string | any,
        to: Date | string | any,
    }
}

export interface ICity {
    name: string;
    _id: string;
}

export interface FormProps {
    type: string,
    register: any,
    onFinish: (values: FieldValues) => Promise<void | CreateResponse<BaseRecord> | UpdateResponse<BaseRecord>>,
    formLoading: boolean,
    handleSubmit: FormEventHandler<HTMLFormElement> | undefined,
    handleImageChange: (file) => void,
    onFinishHandler: (data: FieldValues) => Promise<void> | void,
    propertyImage: { name: string, url: string },
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
    institutionId?: string | any,
    title: string,
    index?: number,
    createdAt: Date | any,
    status?: "published" | "draft" | "rejected",
    mainPhoto?: Array<string> | any,
    otherPhoto?: any,
    description: string,
    category?: "general" | "event" | "promotions",
    createdBy?: string,
    variantForDisplay?: string,
    dateEvent: [{
        date?: Date,
        schedule?: {
            from: string | any,
            to: string | any
        },
        time?: {
            from: Date | any,
            to: Date | any
        },
    }],
    publishAt?: {
        isPublish: boolean,
        datePublish: Date | any
    },
    place?: {
        city?: string,
        address?: string,
        isPlace?: boolean,
        location: {
            lat: number | any,
            lng: number | any
        }
    }
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
    title?: string
}

export interface IOptions {
    label: string | ReactNode;
    options: IOptionGroup[];
    userId?: string,
    title?: string
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
    category: { id: number };
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

export interface IPlaceFormProps {
    onFinish?: (values: FieldValues) => Promise<void | CreateResponse<BaseRecord> | UpdateResponse<BaseRecord>>,
    formLoading: boolean,
    handleSubmit: FormEventHandler<HTMLFormElement> | any,
    onFinishHandler: (data: FieldValues) => Promise<void> | void,
    setMainPhoto: (item: any) => void,
    setOtherPhoto: (item: any) => void,
    otherPhoto: any,
    mainPhoto: any,
    open: boolean,
    titleAction: string,
    setOpen: (item: any) => void,
    type: string,
    setType: (item: string) => void,
    workScheduleWeekend: PropertyProps["workSchedule"]["weekend"],
    setWorkScheduleWeekend: (item: setWorkScheduleWeekend) => void,
    location: google.maps.LatLngLiteral | any,
    setLocation: any,
    tags: Array<any> | any,
    setTags: (item: any) => void,
    place: { address: string, city: string },
    setPlace: (item: { address: string, city: string }) => void,
    features: Array<any> | any,
    setFeatures: (item: any) => void,
    contacts: Array<any> | any,
    setContacts: (item: any) => void,
    workSchedule?: PropertyProps["workSchedule"] | any,
    setWorkSchedule?: (item: PropertyProps["workSchedule"] | any) => void,
    workDays: IWorkDay[],
    setWorkDays: (item: PropertyProps["workSchedule"]["workDays"]) => void,
    description: string,
    setDescription: (value?: string, event?: any, state?: any) => void,
    createdBy: string,
    setCreatedBy: (item: string) => void,
    variantForDisplay: string,
    setVariantForDisplay: (item: string) => void,
    searchManagerInput?: string,
    setSearchManagerInput?: (item: string) => void,
    searchInputValue?: string,
    setSearchInputValue?: (item: string) => void,
    title: string,
    setTitle: (value: string) => void,
    averageCheck: string,
    setAverageCheck: (value: string) => void,
}

export interface INewsDataProps {
    handleSubmit: any,
    onFinishHandler: any,
    mainPhoto: string | any,
    setMainPhoto: any,
    otherPhoto: any,
    setOtherPhoto: (item: any) => void,
    currentInstitutionId: string,
    setCurrentInstitutionId: (item: string) => void,
    userInstitutions?: any,
    title: string,
    setTitle: (value: string) => void,
    category: string,
    setCategory: (value: string) => void,
    workDays: any,
    setWorkDays: any,
    description: string,
    setDescription: (value: string) => void,
    status: string,
    setStatus: (value: string) => void,
    isDatePublished: boolean,
    setIsDatePublished: (value: boolean) => void,
    datePublished: any,
    setDatePublished: any,
    variantForDisplay: string,
    setVariantForDisplay: (value: string) => void,
    formLoading: boolean
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
    memberType?: 'user'| 'institution',
    createdAt?: Date | any
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
        text: string
    }
}


export interface IReserve {
    institution: PropertyProps | any,
    _id: string,
    fullName: string,
    user?: string,
    writeMe: boolean,
    whoPay: string,
    eventType: string,
    date: Date | any,
    isActive: string,
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
        }]
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