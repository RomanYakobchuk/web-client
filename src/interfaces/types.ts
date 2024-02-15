import {CrudFilters} from "@refinedev/core";
import {INews, PropertyProps} from "@/interfaces/common";

export type SetFilterType =
    ((filters: CrudFilters, behavior?: ("merge" | "replace" | undefined)) => void)
    & ((setter: (prevFilters: CrudFilters) => CrudFilters) => void);

export type EstablishmentType = "cafe" | "bar" | "restaurant" | "";

export type IFavPlaces = {
    _id?: string,
    type: string,
    item: string | PropertyProps | INews
}