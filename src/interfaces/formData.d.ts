import {FieldValues, UseFormHandleSubmit} from "react-hook-form";
import {Dispatch, SetStateAction} from "react";
import {IFreeSeatsList, IMDEditor, INewsDateEvent, IPicture, IWorkDay, IEstablishment} from "./common";
import {BaseRecord, CreateResponse, UpdateResponse} from "@refinedev/core";
import {StateFormEstablishment} from "@/components/establishment/utills/formDataReducer";
import {StateFormNews} from "@/components/news/utills/newsFormDataReducer";

export interface IFormDataSeats {
    onFinishHandler: (data: FieldValues) => Promise<void> | void,
    handleSubmit: UseFormHandleSubmit<FieldValues, undefined>,
    establishmentId: string | IEstablishment,
    list: IFreeSeatsList[],
    setList: Dispatch<SetStateAction<IFreeSeatsList[]>>
}

export interface INewsDataProps {
    handleSubmit: UseFormHandleSubmit<FieldValues, undefined>,
    onFinishHandler: (data: FieldValues) => Promise<void> | void,
    defaultPictures: IPicture[],
    state: StateFormNews,
    handleChange: (type: keyof StateFormNews, value: any) => void,
}
export interface INewsDataFormPlace {
    isPlace: boolean,
    place: { address: string, city: string },
    location: google.maps.LatLngLiteral | { lat: number, lng: number },
}
export type TItemList = Array<{value: string,_id?: string}>;
export interface IEstablishmentFormProps {
    onFinish?: (values: FieldValues) => Promise<void | CreateResponse<BaseRecord> | UpdateResponse<BaseRecord>>,
    defaultPictures: IPicture[],
    handleSubmit: UseFormHandleSubmit<FieldValues, undefined>,
    onFinishHandler: (data: FieldValues) => Promise<void> | void,
    state: StateFormEstablishment,
    searchManagerInput?: string,
    searchInputValue?: string,
    handleChange: (type: keyof StateFormEstablishment, value: any) => void,
    setSearchManagerInput?: (item: string) => void,
    setSearchInputValue?: (item: string) => void,
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