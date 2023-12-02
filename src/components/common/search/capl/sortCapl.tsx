import {FormControl, MenuItem, Select, SxProps} from "@mui/material";
import React, {useMemo} from "react";
import {CrudSorting, useTranslate} from "@refinedev/core";

type TProps = {
    setSortBy: (value: string) => void,
    setSorters: (sorter: CrudSorting) => void,
    sortBy: string,
    sorters: CrudSorting,
    styles?: SxProps
}

const SortCapl = ({setSortBy, setSorters, sorters, sortBy, styles}: TProps) => {

    const translate = useTranslate();

    const currentSorterOrders = useMemo(() => {
        return {
            createdAt_asc:
                sorters?.find((item: any) => item.field === "createdAt_asc")?.order || "asc",
            createdAt_desc:
                sorters?.find((item: any) => item.field === "createdAt_desc")?.order || "desc",
            fullName_asc:
                sorters?.find((item: any) => item.field === "fullName_asc")?.order || "asc",
            fullName_desc:
                sorters?.find((item: any) => item.field === "fullName_desc")?.order || "desc",
            date_asc:
                sorters?.find((item: any) => item.field === "date_asc")?.order || "asc",
            date_desc:
                sorters?.find((item: any) => item.field === "date_desc")?.order || "desc",
        };
    }, [sorters]);

    const toggleSort = (field: keyof typeof currentSorterOrders) => {
        const newOrder = field?.split('_')[1] as "asc" | "desc";
        setSorters([
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
                value={sorters[0]?.field ? sorters[0]?.field : sortBy ? sortBy : ""}
                sx={{
                    fontSize: {xs: '14px', sm: '16px'},
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
                            title: translate('home.oldest'),
                            value: 'createdAt_asc',
                        },
                        {
                            title: translate('home.newest'),
                            value: 'createdAt_desc',
                        },
                        // {
                        //     title: translate("home.sortByABC.title") + ' ' + translate("home.sortByABC.a-z"),
                        //     value: 'title_asc'
                        // },
                        // {
                        //     title: translate("home.sortByABC.title") + ' ' + translate("home.sortByABC.z-a"),
                        //     value: 'title_desc'
                        // },
                        {
                            title: translate("capl.create.fullName") + '  ' + '↑',
                            value: 'fullName_asc'
                        },
                        {
                            title: translate("capl.create.fullName") + '  ' + '↓',
                            value: 'fullName_desc'
                        },
                        {
                            title: translate("capl.create.date") + '  ' + '↑',
                            value: 'date_asc'
                        },
                        {
                            title: translate("capl.create.date") + '  ' + '↓',
                            value: 'date_desc'
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
export default SortCapl;
