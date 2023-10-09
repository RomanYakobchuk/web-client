import {
    Box, FormControl, FormHelperText,
} from "@mui/material";
import React, {Dispatch, ReactNode, useContext, useEffect, useState} from "react";
import {CrudFilters, CrudSorting, LogicalFilter, useTranslate} from "@refinedev/core";

import SearchCity from "../../search/searchCity";
import {SetFilterType} from "../../../interfaces/types";
import {
    SearchButtonFilterComponent, SearchByTypeComponent,
    SearchInputComponent,
    SortNewsComponent
} from "../../common/search";
import {useMobile} from "../../../hook";
import ModalWindow from "../../window/modalWindow";
import {FilterBtn} from "../../index";
import {ColorModeContext} from "../../../contexts";


interface IProps {
    setFilters: SetFilterType,
    sortBy: string,
    setSortBy: (value: string) => void,
    setSearchValue: (value: string) => void,
    sorters: CrudSorting,
    setSorters: (sorter: CrudSorting) => void,
    searchValue: string,
    filters: CrudFilters,
    setCurrent: Dispatch<React.SetStateAction<number>>,
}

const arrayType = [
    {
        title: "all",
        value: ""
    },
    {
        title: "general",
        value: "general"
    },
    {
        title: "promotions",
        value: "promotions"
    },
    {
        title: "events",
        value: "events"
    },
]

const FilterNews = ({
                        setFilters: defaultSetFilters,
                        sortBy,
                        sorters,
                        setSorters: defaultSetSorters,
                        setSortBy,
                        setSearchValue,
                        searchValue,
                        filters,
                        setCurrent
                    }: IProps) => {

    const translate = useTranslate();
    const {width, height} = useMobile();
    const {mode} = useContext(ColorModeContext);

    const [filterLength, setFilterLength] = useState<number>(0);
    const [openFilter, setOpenFilter] = useState(false);
    const [newFilters, setFilters] = useState<CrudFilters>([{}] as CrudFilters);
    const [newSorters, setNewSorters] = useState<CrudSorting>([{}] as CrudSorting);
    const [category, setCategory] = useState<string>("");
    const [dateEventGte, setDateEventGte] = useState<Date | null>(null);
    const [dateEventLte, setDateEventLte] = useState<Date | null>(null);
    const [searchCity, setSearchCity] = useState<string>("");


    // const currentFilterValues = useMemo(() => {
    //     const logicalFilters = newFilters!?.flatMap((item: CrudFilter) =>
    //         "field" in item ? item : [],
    //     );
    //     return {
    //         title:
    //             logicalFilters?.find((item: LogicalFilter) => item.field === "title")?.value || "",
    //         category:
    //             logicalFilters?.find((item: LogicalFilter) => item.field === "category")?.value || "",
    //         city:
    //             logicalFilters?.find((item: LogicalFilter) => item.field === "city")?.value || ""
    //     };
    // }, [newFilters]);
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
            let length = 1;
            for (const filter of filters as LogicalFilter[]) {
                if (filter?.field === "date_event" && filter?.operator === 'lte') {
                    setDateEventLte(filter?.value)
                } else if (filter?.field === "date_event" && filter?.operator === 'gte') {
                    setDateEventGte(filter?.value)
                    length++;
                } else if (filter?.field === "category") {
                    setCategory(filter?.value)
                } else if (filter?.field === "title" && filter?.value) {
                    setSearchValue(filter?.value)
                } else if (filter?.field === 'city_like' && filter?.value) {
                    setSearchCity(filter?.value)
                    length++;
                }
            }
            setFilterLength(length)
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
        setCategory('')
        setDateEventLte(null)
    }

    const SearchByCityComponent: ReactNode = (
        <FormControl
            sx={{
                height: '100%',
                width: '100%',
                "& input::placeholder": {
                    color: 'common.white'
                }
            }}>
            <SearchCity searchCity={searchCity} setSearchCity={setSearchCity}/>
        </FormControl>
    )

    const isShowAllFilters = width > 600;
    const isHorizontalContent = width > 1100;

    const isFilterBtnAbsolute = height - 100 >= 400;

    return (
        <Box sx={{
            width: '100%',
            gap: 2,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            "& input": {
                border: `1px solid ${mode === 'dark' ? '#fff' : '#000'}`
            },
        }}>
            <Box sx={{
                width: '100%',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: isHorizontalContent ? 2 : 1
            }}>
                {
                    isShowAllFilters && (
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            height: '40px'
                        }}>
                            <Box sx={{
                                height: '100%',
                                minWidth: '30%',
                                maxWidth: isHorizontalContent ? '100%' : '350px',
                                width: '100%'
                            }}>
                                {
                                    SearchByCityComponent
                                }
                            </Box>
                            {
                                !isHorizontalContent && (
                                    <FilterBtn
                                        setOpenFilter={setOpenFilter}
                                        filterLength={filterLength}
                                        isShowAllFilters={isShowAllFilters}
                                    />
                                )
                            }
                        </Box>
                    )
                }
                <SearchInputComponent
                    styleSx={{
                        margin: '0'
                    }}
                    isButton={false}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    defaultSetFilters={defaultSetFilters}
                />
                {
                    !isShowAllFilters && (
                        <FilterBtn
                            btnStyle={{
                                width: '100%'
                            }}
                            setOpenFilter={setOpenFilter}
                            filterLength={filterLength}
                            isShowAllFilters={isShowAllFilters}
                        />
                    )
                }
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: isHorizontalContent ? 'start' : 'center',
                    flexDirection: isHorizontalContent ? 'column' : 'row',
                    gap: isHorizontalContent ? 2 : 0
                }}>
                    {
                        isShowAllFilters && (
                            <SearchByTypeComponent
                                arrayType={arrayType}
                                fieldName={'category'}
                                sortTranslatePath={'news.sortByCategory'}
                                defaultSetFilters={defaultSetFilters}
                                setFilters={setFilters}
                                type={category}
                                isShowAllFilters={isShowAllFilters}
                                setType={setCategory}
                                setCurrent={setCurrent}
                            />
                        )
                    }
                    <SortNewsComponent
                        styles={{
                            maxWidth: '280px'
                        }}
                        newSorters={newSorters}
                        setSortBy={setSortBy}
                        defaultSetSorters={defaultSetSorters}
                        sortBy={sortBy}
                    />
                </Box>
            </Box>
            <ModalWindow
                open={openFilter}
                setOpen={setOpenFilter}
                title={
                    <Box sx={{
                        fontSize: {xs: '20px', md: '24px'},
                        fontWeight: 600,
                        width: '100%',
                        textAlign: 'center'
                    }}>
                        {translate('buttons.filter')}
                    </Box>
                }
            >
                {
                    openFilter &&
                    (
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            height: '100%',
                            pt: 2
                        }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 3,
                            }}>
                                {
                                    !isShowAllFilters && (
                                        <>
                                            {SearchByCityComponent}
                                            <SearchByTypeComponent
                                                arrayType={arrayType}
                                                fieldName={'category'}
                                                sortTranslatePath={'news.sortByCategory'}
                                                defaultSetFilters={defaultSetFilters}
                                                setFilters={setFilters}
                                                type={category}
                                                isShowAllFilters={isShowAllFilters}
                                                setType={setCategory}
                                                setCurrent={setCurrent}
                                            />
                                        </>
                                    )
                                }
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
                            </Box>
                            <Box sx={{
                                width: '90%',
                                margin: '0 auto',
                                position: isFilterBtnAbsolute ? 'absolute' : 'unset',
                                bottom: '20px'
                            }}>
                                <SearchButtonFilterComponent
                                    setOpenFilter={setOpenFilter}
                                    handleReplace={handleReplace}
                                    handleSearch={handleSearch}/>
                            </Box>
                        </Box>
                    )
                }
            </ModalWindow>
        </Box>
    );
};
export default FilterNews;
