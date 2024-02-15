import {FieldValues, UseFormHandleSubmit} from "react-hook-form";
import {Dispatch, SetStateAction} from "react";
import {IFreeSeatsList, IMDEditor, INewsDateEvent, IPicture, IWorkDay, PropertyProps} from "./common";
import {BaseRecord, CreateResponse, UpdateResponse} from "@refinedev/core";

export interface IFormDataSeats {
    onFinishHandler: (data: FieldValues) => Promise<void> | void,
    handleSubmit: UseFormHandleSubmit<FieldValues, undefined>,
    establishmentId: string | PropertyProps,
    list: IFreeSeatsList[],
    setList: Dispatch<SetStateAction<IFreeSeatsList[]>>
}

export interface INewsDataProps {
    handleSubmit: UseFormHandleSubmit<FieldValues, undefined>,
    onFinishHandler: (data: FieldValues) => Promise<void> | void,
    establishmentInfo: PropertyProps,
    defaultPictures: IPicture[],
    pictures: IPicture[] | File[],
    setPictures: Dispatch<SetStateAction<IPicture[] | File[]>>,
    setEstablishmentInfo: Dispatch<SetStateAction<PropertyProps>>,
    title: string,
    setTitle: (value: string) => void,
    category: string,
    setCategory: (value: string) => void,
    dateEvent: INewsDateEvent[],
    setDateEvent: Dispatch<SetStateAction<INewsDateEvent[]>>,
    description: string,
    setDescription: IMDEditor['set'] | ((value: string) => void),
    status: string,
    setStatus: (value: string) => void,
    isDatePublished: boolean,
    setIsDatePublished: (value: boolean) => void,
    datePublished: any,
    setDatePublished: any,
    place: INewsDataFormPlace,
    setPlace: Dispatch<SetStateAction<INewsDataFormPlace>>
}
export interface INewsDataFormPlace {
    isPlace: boolean,
    place: { address: string, city: string },
    location: google.maps.LatLngLiteral | { lat: number, lng: number },
}
export interface IEstablishmentFormProps {
    onFinish?: (values: FieldValues) => Promise<void | CreateResponse<BaseRecord> | UpdateResponse<BaseRecord>>,
    setSendNotifications: (value: boolean) => void,
    sendNotifications: boolean,
    defaultPictures: IPicture[],
    handleSubmit: UseFormHandleSubmit<FieldValues, undefined>,
    onFinishHandler: (data: FieldValues) => Promise<void> | void,
    setPictures: (item: IPicture[] | File[]) => void,
    pictures: IPicture[] | File[],
    type: string,
    setType: (item: string) => void,
    workScheduleWeekend: PropertyProps["workSchedule"]["weekend"],
    setWorkScheduleWeekend: (item: setWorkScheduleWeekend) => void,
    location: google.maps.LatLngLiteral | { lat: number, lng: number },
    setLocation: (item: { lat: number, lng: number }) => void,
    tags: Array<any> | any,
    setTags: (item: any) => void,
    place: { address: string, city: string },
    setPlace: ({address: string, city: string}) => void,
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
    searchManagerInput?: string,
    setSearchManagerInput?: (item: string) => void,
    searchInputValue?: string,
    setSearchInputValue?: (item: string) => void,
    title: string,
    setTitle: (value: string) => void,
    averageCheck: string,
    setAverageCheck: (value: string) => void,
}

export type Nullable<T> = {
    [P in keyof T]: T[P] | null;
};

export interface IEstablishmentFilterVariables {
    city: string,
    title: string,
    type: string,
    averageCheckLte: number,
    averageCheckGte: number,
}