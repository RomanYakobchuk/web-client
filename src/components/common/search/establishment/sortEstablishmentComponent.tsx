import {FormControl, MenuItem, Select} from "@mui/material";
import {CrudSorting, useTranslate} from "@refinedev/core";
import React, {useMemo} from "react";

interface IProps {
    newSorters: CrudSorting,
    setSortBy: (value: string) => void,
    defaultSetSorters: (sorter: CrudSorting) => void,
    sortBy: string
}
const SortEstablishmentComponent = ({newSorters, setSortBy, defaultSetSorters, sortBy}: IProps) => {

    const translate = useTranslate();

    const bRButtonFilter = '7px';

    const currentSorterOrders = useMemo(() => {
        return {
            rating_asc:
                newSorters?.find((item: any) => item.field === "rating_asc")?.order || "asc",
            rating_desc:
                newSorters?.find((item: any) => item.field === "rating_desc")?.order || "desc",
            createdAt_asc:
                newSorters?.find((item: any) => item.field === "createdAt_asc")?.order || "asc",
            createdAt_desc:
                newSorters?.find((item: any) => item.field === "createdAt_desc")?.order || "desc",
            title_asc:
                newSorters?.find((item: any) => item.field === "title_asc")?.order || "asc",
            title_desc:
                newSorters?.find((item: any) => item.field === "title_desc")?.order || "desc",
            averageCheck_asc:
                newSorters?.find((item: any) => item.field === "averageCheck_asc")?.order || -1,
            averageCheck_desc:
                newSorters?.find((item: any) => item.field === "averageCheck_desc")?.order || 1,
        };
    }, [newSorters]);
    const toggleSort = (field: keyof typeof currentSorterOrders) => {
        const newOrder = field?.split('_')[1] as "asc" | 'desc';
        defaultSetSorters([
            {
                field,
                order: newOrder,
            },
        ])
    };

    return (
        <FormControl
            sx={{
                width: '100%',
                maxWidth: '200px'
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
                    borderRadius: bRButtonFilter,
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
                            title: translate("home.sortRating") + '  ' + '↑',
                            value: "rating_asc",
                        },
                        {
                            title: translate("home.sortRating") + '  ' + '↓',
                            value: "rating_desc",
                        },
                        {
                            title: translate('home.oldest'),
                            value: 'createdAt_asc',
                        },
                        {
                            title: translate('home.newest'),
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
                            title: translate("home.create.averageCheck") + '  ' + '↑',
                            value: 'averageCheck_asc'
                        },
                        {
                            title: translate("home.create.averageCheck") + '  ' + '↓',
                            value: 'averageCheck_desc'
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
export default SortEstablishmentComponent
