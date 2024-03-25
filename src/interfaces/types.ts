import {CrudFilters} from "@refinedev/core";
import {INews, IEstablishment} from "@/interfaces/common";

export type SetFilterType =
    ((filters: CrudFilters, behavior?: ("merge" | "replace" | undefined)) => void)
    & ((setter: (prevFilters: CrudFilters) => CrudFilters) => void);

export type EstablishmentType = "cafe" | "bar" | "restaurant" | "";

export type IFavPlaces = {
    _id?: string,
    type: string,
    item: string | IEstablishment | INews
}

export type TStatus = "draft" | "rejected" | "accepted";

export type TButtonVariant = "text" | "outlined" | "contained";