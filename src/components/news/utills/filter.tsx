import {
    Box,
    Button, FormControl, FormHelperText,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import {CancelOutlined, TuneOutlined} from "@mui/icons-material";
import React, {useEffect, useMemo, useState} from "react";
import {CrudFilter, CrudFilters, CrudSorting, LogicalFilter, useTranslate} from "@refinedev/core";

import {buttonStyle, selectStyle} from "../../../styles";
import SearchCity from "../../search/searchCity";
import {SetFilterType} from "../../../interfaces/types";


interface IProps {
    setFilters: SetFilterType,
    sortBy: string,
    setSortBy: (value: string) => void,
    setSearchValue: (value: string) => void,
    sorters: CrudSorting,
    setSorters: (sorter: CrudSorting) => void,
    searchValue: string,
    filters: CrudFilters,
}

const FilterNews = ({
                        setFilters: defaultSetFilters,
                        sortBy,
                        sorters,
                        setSorters: defaultSetSorters,
                        setSortBy,
                        setSearchValue,
                        searchValue,
                        filters,
                    }: IProps) => {

    const translate = useTranslate();

    const [openFilter, setOpenFilter] = useState(false);
    const [newFilters, setFilters] = useState<CrudFilters>([{}] as CrudFilters);
    const [newSorters, setNewSorters] = useState<CrudSorting>([{}] as CrudSorting);
    const [category, setCategory] = useState<string>("");
    const [dateEventGte, setDateEventGte] = useState<Date | null>(null);
    const [dateEventLte, setDateEventLte] = useState<Date | null>(null);
    const [searchCity, setSearchCity] = useState<string>("");


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
        setNewSorters([
            {
                field,
                order: newOrder,
            },
        ]);
    };

    const currentFilterValues = useMemo(() => {
        const logicalFilters = newFilters!?.flatMap((item: CrudFilter) =>
            "field" in item ? item : [],
        );
        return {
            title:
                logicalFilters?.find((item: any) => item.field === "title")?.value || "",
            category:
                logicalFilters?.find((item: any) => item.field === "category")?.value || "",
            city:
                logicalFilters?.find((item: any) => item.field === "city")?.value || ""

        };
    }, [newFilters]);
    useEffect(() => {
        setFilters([
            {
                field: 'date_event',
                operator: 'lte',
                value: dateEventLte ? dateEventLte : null
            },
            {
                field: 'date_event',
                operator: 'gte',
                value: dateEventGte ? dateEventGte : null
            },
            {
                field: 'title',
                value: searchValue?.length > 0 ? searchValue : "",
                operator: 'contains'
            },
            {
                field: "category",
                operator: "eq",
                value: category
            },
        ])
    }, [dateEventGte, dateEventLte, category, searchCity])

    useEffect(() => {
        if (sorters) {
            setNewSorters([
                {
                    field: sorters[0]?.field,
                    order: sorters[0]?.order
                }
            ])
        }
    }, [sorters])

    useEffect(() => {
        if (filters?.length > 0) {
            for (const filter of filters as LogicalFilter[]) {
                if (filter?.field === "date_event" && filter?.operator === 'lte') {
                    setDateEventLte(filter?.value)
                } else if (filter?.field === "date_event" && filter?.operator === 'gte') {
                    setDateEventGte(filter?.value)
                } else if (filter?.field === "category") {
                    setCategory(filter?.value)
                } else if (filter?.field === "title" && filter?.value) {
                    setSearchValue(filter?.value)
                } else if (filter?.field === 'city_like' && filter?.value) {
                    setSearchCity(filter?.value)
                }
            }
        }
    }, [filters])

    const handleSearch = () => {
        defaultSetFilters(newFilters)
        defaultSetSorters(newSorters)
        setOpenFilter(false)
    }

    const handleReplace = () => {
        setSearchValue("")
        setSearchCity("")
        defaultSetFilters([], "replace")
        defaultSetSorters([{field: "", order: "asc"}])
        setOpenFilter(false)
        setDateEventGte(null)
        setDateEventLte(null)
    }


    return (
        <Box sx={{
            width: '100%',
            gap: 2,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Box sx={{
                width: '100%',
                position: 'relative',
            }}>
                <TextField fullWidth variant={"outlined"} color={"info"}
                           sx={{
                               fontSize: {xs: '10px', sm: '16px'},
                               "> div": {
                                   borderRadius: '50px',
                               },
                               "& div input": {
                                   pr: '30px'
                               }
                           }}
                           size="small"
                           placeholder={translate("home.search")}
                           value={searchValue ? searchValue : ""}
                           onChange={(e) => {
                               setSearchValue(e.target.value)
                               setFilters([{
                                   field: 'title',
                                   operator: 'contains',
                                   value: e.currentTarget.value ? e.currentTarget.value : undefined
                               }])
                           }}/>
                <CancelOutlined onClick={() => {
                    setSearchValue("")
                }} sx={{
                    position: 'absolute',
                    right: '5px',
                    top: "8px",
                    cursor: 'pointer'
                }}/>
            </Box>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <TuneOutlined
                    sx={{
                        cursor: 'pointer'
                    }}
                    onClick={() => setOpenFilter(true)}
                />
                {
                    openFilter &&
                    (<Box
                        sx={{
                            position: 'fixed',
                            minHeight: '100vh',
                            top: 0,
                            right: 0,
                            left: {xs: 0, md: 'auto'},
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 100,
                            bgcolor: 'rgba(47,37,37,0.5)'
                        }}>
                        <Box
                            sx={{
                                width: {xs: '320px', sm: '450px'},
                                bgcolor: 'primary.main',
                                p: '20px',
                                borderRadius: '10px'
                            }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: '100%',
                                justifyContent: {xs: 'space-between', sm: 'start', md: 'end'},
                                gap: 2
                            }}>
                                <FormControl sx={{width: '100%',}}>
                                    <FormHelperText
                                        sx={{
                                            fontSize: '14px',
                                            mb: 0.5,
                                            color: 'text.primary'
                                        }}
                                    >
                                        {translate('posts.fields.category.title')}
                                    </FormHelperText>
                                    <Select
                                        variant={"outlined"}
                                        size="small"
                                        color={"info"}
                                        displayEmpty
                                        fullWidth
                                        required
                                        inputProps={{'aria-label': 'Without label'}}
                                        sx={{
                                            fontSize: {xs: '12px', sm: '16px'},
                                            ...selectStyle
                                        }}
                                        value={category ?? currentFilterValues.category}
                                        onChange={(e) => {
                                            setCategory(e.target.value)
                                            setFilters([{
                                                field: 'category',
                                                operator: 'eq',
                                                value: e.target.value ? e.target.value : undefined
                                            }])
                                        }}>
                                        <MenuItem value={""}>{translate("home.sortByType.all")}</MenuItem>
                                        {
                                            ["general", "promotions", "events"].map((type) => (
                                                <MenuItem key={type}
                                                          value={type}>{translate(`news.sortByCategory.${type}`)}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                                <FormControl
                                    sx={{width: '100%',}}>
                                    <SearchCity
                                        searchCity={searchCity}
                                        setSearchCity={setSearchCity}
                                    />
                                </FormControl>
                                <FormControl
                                    sx={{width: '100%',}}>
                                    <FormHelperText
                                        sx={{
                                            fontSize: '14px',
                                            mb: 0.5,
                                            color: 'text.primary'
                                        }}
                                    >
                                        {translate('home.sort')}
                                    </FormHelperText>
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
                                            ...selectStyle
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
                                <FormControl
                                    sx={{width: '100%',}}>
                                    <FormHelperText
                                        sx={{
                                            fontSize: '14px',
                                            mb: 0.5,
                                            color: (theme) => theme.palette.text.primary
                                        }}
                                    >
                                        {translate('news.dateEvent.title')}
                                    </FormHelperText>
                                    <Box sx={{
                                        width: '100%'
                                    }}>
                                        <Box sx={{
                                            display: "flex",
                                            width: "100%",
                                            justifyContent: "start",
                                            alignItems: "center",
                                            gap: 1
                                        }}>
                                            {/*<LocalizationProvider dateAdapter={AdapterDayjs}>*/}
                                            {/*    <DatePicker*/}
                                            {/*        sx={{*/}
                                            {/*            ...textFieldStyle,*/}
                                            {/*            "> div": {*/}
                                            {/*                fontSize: '14px'*/}
                                            {/*            },*/}
                                            {/*            "> div > input": {*/}
                                            {/*                p: '7px 10px'*/}
                                            {/*            }*/}
                                            {/*        }}*/}
                                            {/*        views={['year', 'month', 'day']}*/}
                                            {/*        value={dateEventGte ? dateEventGte : ''}*/}
                                            {/*        onChange={(value) => {*/}
                                            {/*            setDateEventGte(value)*/}
                                            {/*        }}*/}
                                            {/*    />*/}
                                            {/*</LocalizationProvider>*/}
                                            -
                                            {/*<LocalizationProvider dateAdapter={AdapterDayjs}>*/}
                                            {/*    <DatePicker*/}
                                            {/*        sx={{*/}
                                            {/*            ...textFieldStyle,*/}
                                            {/*            "> div": {*/}
                                            {/*                fontSize: '14px'*/}
                                            {/*            },*/}
                                            {/*            "> div > input": {*/}
                                            {/*                p: '7px 10px'*/}
                                            {/*            }*/}
                                            {/*        }}*/}
                                            {/*        views={['year', 'month', 'day']}*/}
                                            {/*        value={dateEventLte ? dateEventLte : ''}*/}
                                            {/*        onChange={(value) => {*/}
                                            {/*            setDateEventLte(value)*/}
                                            {/*        }}*/}
                                            {/*    />*/}
                                            {/*</LocalizationProvider>*/}
                                        </Box>
                                    </Box>
                                </FormControl>
                                <Button
                                    onClick={handleReplace}
                                    color={"inherit"}
                                    variant={"outlined"}
                                >
                                    {
                                        translate("home.reset")
                                    }
                                </Button>
                                <Box sx={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <Button
                                        sx={{
                                            width: '35%',
                                            ...buttonStyle
                                        }}
                                        color={"error"}
                                        variant={"contained"}
                                        onClick={() => setOpenFilter(false)}
                                    >
                                        {translate("buttons.cancel")}
                                    </Button>
                                    <Button
                                        variant={"contained"}
                                        color={"info"}
                                        sx={{
                                            width: '60%',
                                            ...buttonStyle
                                        }}
                                        onClick={handleSearch}>
                                        {translate("buttons.search")}
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Box>)
                }
            </Box>
        </Box>
    );
};
export default FilterNews;
