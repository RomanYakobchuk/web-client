import {FormControl, MenuItem, Select, SxProps} from "@mui/material";
import React, {useMemo} from "react";
import {CrudSorting, useTranslate} from "@refinedev/core";

type TProps = {
    newSorters: CrudSorting,
    setSortBy: (value: string) => void,
    defaultSetSorters: (sorter: CrudSorting) => void,
    sortBy: string,
    styles?: SxProps
}

const SortNewsComponent = ({newSorters, setSortBy, defaultSetSorters, sortBy, styles}: TProps) => {

    const translate = useTranslate();

    const currentSorterOrders = useMemo(() => {
        return {
            createdAt_asc:
                newSorters?.find((item: any) => item.field === "createdAt_asc")?.order || "asc",
            createdAt_desc:
                newSorters?.find((item: any) => item.field === "createdAt_desc")?.order || "desc",
            title_asc:
                newSorters?.find((item: any) => item.field === "title_asc")?.order || "asc",
            title_desc:
                newSorters?.find((item: any) => item.field === "title_desc")?.order || "desc",
        };
    }, [newSorters]);

    const toggleSort = (field: keyof typeof currentSorterOrders) => {
        const newOrder = field?.split('_')[1] as "asc" | "desc";
        defaultSetSorters([
            {
                field,
                order: newOrder,
            },
        ]);
    };

    return (
        <FormControl
            sx={{
                width: '100%',
                maxWidth: '200px',
                ...styles
            }}
        >
            <Select
                variant={"outlined"}
                size="small"
                color={"info"}
                fullWidth
                displayEmpty
                required
                inputProps={{'aria-label': 'Without label'}}
                value={newSorters[0]?.field ? newSorters[0]?.field : sortBy ? sortBy : ""}
                sx={{
                    fontSize: {xs: '12px', sm: '16px'},
                    borderRadius: '7px',
                    borderColor: 'common.white',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                }}
                onChange={
                    (e: any) => {
                        setSortBy(e.target.value)
                        toggleSort(e.target.value)
                    }
                }
            >
                <MenuItem value={""}>{translate("home.default")}</MenuItem>
                {
                    [
                        {
                            title: 'Найстаріші',
                            value: 'createdAt_asc',
                        },
                        {
                            title: 'Найновіші',
                            value: 'createdAt_desc',
                        },
                        {
                            title: translate("home.sortByABC.title") + ' ' + translate("home.sortByABC.a-z"),
                            value: 'title_asc'
                        },
                        {
                            title: translate("home.sortByABC.title") + ' ' + translate("home.sortByABC.z-a"),
                            value: 'title_desc'
                        },
                        {
                            title: translate("news.dateEvent.title") + '  ' + '↑',
                            value: 'date_event_asc'
                        },
                        {
                            title: translate("news.dateEvent.title") + '  ' + '↓',
                            value: 'date_event_desc'
                        },
                    ].map((type) => (
                        <MenuItem key={type.value}
                                  value={type.value}>{type.title}</MenuItem>
                    ))
                }
            </Select>
        </FormControl>
    );
};
export default SortNewsComponent;
