import {CrudFilters} from "@refinedev/core";

export type SetFilterType = ((filters: CrudFilters, behavior?: ("merge" | "replace" | undefined)) => void) & ((setter: (prevFilters: CrudFilters) => CrudFilters) => void);

export type EstablishmentType = "cafe" | "bar" | "restaurant" | "";
