import {
    Box,
    Button,
    FormControl
} from "@mui/material";
import {FilterList} from "@mui/icons-material";
import React, {ReactNode, useContext, useEffect, useState} from "react";
import {CrudFilters, CrudSorting, LogicalFilter, useTranslate} from "@refinedev/core";
import {useLocation} from "react-router-dom";
import {useDebounce} from "use-debounce";

import {ColorModeContext} from "../../contexts";
import {ModalWindow, SearchCity, VariantComponent} from "../index";
import {useMobile} from "../../utils";
import {EstablishmentType, SetFilterType} from "../../interfaces/types";
import {
    SearchButtonFilterComponent,
    SearchByAverageCheckComponent,
    SearchByTypeComponent,
    SearchInputComponent
} from "../common/search";
import SortEstablishmentComponent from "../common/search/establishment/sortEstablishmentComponent";


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

const FilterInstitutions = ({
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
    const {state: locationState} = useLocation();
    const {mode} = useContext(ColorModeContext);
    const {width} = useMobile();

    const [filterLength, setFilterLength] = useState<number>(0);
    const [openFilter, setOpenFilter] = useState(false);
    const [newFilters, setFilters] = useState<CrudFilters>([{}] as CrudFilters);
    const [searchCity, setSearchCity] = useState<string>('');
    const [newSorters, setNewSorters] = useState<CrudSorting>([{}] as CrudSorting);
    const [type, setType] = useState<EstablishmentType>("");
    const [valueGte, setValueGte] = useState<number>(0);
    const [valueLte, setValueLte] = useState<number>(2000);
    const [state, _] = useState<any>(locationState ?? "");
    const [debouncedSearchText] = useDebounce(searchValue, 500);
    const [debouncedSearchCity] = useDebounce(searchCity, 500);

    const isShowAllFilters = width > 600;

    const bRButtonFilter = '7px';

    // const currentFilterValues = useMemo(() => {
    //     const logicalFilters = newFilters!?.flatMap((item: CrudFilter) =>
    //         "field" in item ? item : [],
    //     );
    //     return {
    //         tag:
    //             logicalFilters?.find((item: any) => item.field === "tag")?.value || '',
    //         title:
    //             logicalFilters?.find((item: any) => item.field === "title")?.value || "",
    //         propertyType:
    //             logicalFilters?.find((item: any) => item.field === "propertyType")?.value || "",
    //         averageCheck:
    //             logicalFilters?.find((item: any) => item.field === "averageCheck")?.value || 0,
    //         city:
    //             logicalFilters?.find((item: any) => item.field === "city")?.value || ""
    //     };
    // }, [newFilters]);

    useEffect(() => {
        if (!isShowAllFilters) {
            defaultSetFilters([
                {
                    field: 'title',
                    value: searchValue ?? '',
                    operator: 'contains'
                }
            ])
        }
    }, [debouncedSearchText, isShowAllFilters]);

    useEffect(() => {
        setFilters([
            {
                field: 'averageCheck',
                operator: 'lte',
                value: valueLte ? valueLte : 2000
            },
            {
                field: 'averageCheck',
                operator: 'gte',
                value: valueGte ? valueGte : 20
            },
            {
                field: 'title',
                value: searchValue?.length > 0 ? searchValue : "",
                operator: 'contains'
            },
            {
                field: "propertyType",
                operator: "eq",
                value: type
            },
            {
                field: "city",
                operator: "contains",
                value: searchCity ?? ""
            }
        ])
    }, [valueGte, valueLte, type, searchCity]);

    useEffect(() => {
        if (sorters) {
            setNewSorters([
                {
                    field: sorters[0]?.field,
                    order: sorters[0]?.order
                }
            ])
        }
    }, [sorters]);

    useEffect(() => {
        if (filters?.length > 0) {
            let length = 1;
            for (const filter of filters as LogicalFilter[]) {
                if (filter?.field === "averageCheck" && filter?.operator === 'lte') {
                    setValueLte(filter?.value)
                }
                if (filter?.field === "averageCheck" && filter?.operator === 'gte') {
                    setValueGte(filter?.value)
                }
                if (filter?.field === "propertyType" && filter?.value) {
                    setType(filter?.value)
                    length++;
                }
                if (filter?.field === "title" && filter?.value) {
                    setSearchValue(filter?.value)
                }
                if (filter?.field === 'city' && filter?.value) {
                    setSearchCity(filter?.value)
                    length++;
                }
            }
            setFilterLength(length);
        }
    }, [filters]);

    useEffect(() => {
        if (state.value) {
            setSearchValue(state.value)
        }
    }, [state]);

    useEffect(() => {
        if (isShowAllFilters) {
            defaultSetFilters([{
                field: 'city',
                value: searchCity ?? '',
                operator: 'contains'
            }]);
        }
    }, [debouncedSearchCity, isShowAllFilters]);

    const handleSearch = () => {
        defaultSetFilters(newFilters)
        defaultSetSorters(newSorters)
        setOpenFilter(false)
    }

    const handleReplace = () => {
        setSearchValue("");
        setValueGte(0);
        setValueLte(100000);
        setSearchCity("");
        setType('')
        defaultSetFilters([], "replace");
        defaultSetSorters([{field: "", order: "asc"}]);
        setOpenFilter(false);
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

    const filterButton: ReactNode = (
        <Button
            variant={'contained'}
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 1,
                color: 'common.black',
                bgcolor: 'common.white',
                "&:hover": {
                    color: 'common.black',
                    bgcolor: 'common.white'
                },
                height: '40px',
                textTransform: 'unset',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: bRButtonFilter
            }}
            onClick={() => setOpenFilter(true)}
            size={'small'}
        >
            <FilterList sx={{
                width: '25px',
                height: '25px'
            }}/>
            {
                isShowAllFilters ? (
                    translate('buttons.moreFilter')
                ) : (
                    `${filterLength} ${translate('buttons.filtersApplied')}`
                )
            }
        </Button>
    )

    return (
        <Box sx={{
            width: '100%',
            gap: isShowAllFilters ? 2 : 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
            "& input": {
                border: `1px solid ${mode === 'dark' ? '#fff' : '#000'}`
            },
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
                            maxWidth: '350px',
                            width: '100%'
                        }}>
                            {
                                SearchByCityComponent
                            }
                        </Box>
                        {filterButton}
                    </Box>
                )
            }
            <SearchInputComponent
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                defaultSetFilters={defaultSetFilters}
            />
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%'
            }}>
                {
                    isShowAllFilters ? (
                        <Box sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 2,
                            }}>
                                <SearchByTypeComponent
                                    defaultSetFilters={defaultSetFilters}
                                    setFilters={setFilters}
                                    type={type}
                                    isShowAllFilters={isShowAllFilters}
                                    setType={setType}
                                />
                                <SortEstablishmentComponent
                                    newSorters={newSorters}
                                    setSortBy={setSortBy}
                                    defaultSetSorters={defaultSetSorters}
                                    sortBy={sortBy}
                                />
                            </Box>
                            <VariantComponent type={'establishment'}/>
                        </Box>
                    ) : (
                        <Box sx={{
                            width: '100%',
                            "& > button": {
                                width: '100%'
                            },
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1
                        }}>
                            {filterButton}
                            <Box sx={{
                                display: 'flex',
                                width: '100%',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                "& > div": {
                                    width: 'fit-content'
                                }
                            }}>
                                <SortEstablishmentComponent
                                    newSorters={newSorters}
                                    setSortBy={setSortBy}
                                    defaultSetSorters={defaultSetSorters}
                                    sortBy={sortBy}
                                />
                                <VariantComponent type={'establishment'}/>
                            </Box>
                        </Box>
                    )
                }
            </Box>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                width: '100%',
            }}>
                <ModalWindow open={openFilter} setOpen={setOpenFilter} title={
                    <Box sx={{
                        fontSize: {xs: '20px', md: '24px'},
                        fontWeight: 600,
                        width: '100%',
                        textAlign: 'center'
                    }}>
                        {translate('buttons.filter')}
                    </Box>
                }>
                    {
                        openFilter && (
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
                                                    defaultSetFilters={defaultSetFilters}
                                                    setFilters={setFilters}
                                                    type={type}
                                                    isShowAllFilters={isShowAllFilters}
                                                    setType={setType}
                                                />
                                            </>
                                        )
                                    }
                                    <SearchByAverageCheckComponent
                                        valueGte={valueGte}
                                        setValueGte={setValueGte}
                                        valueLte={valueLte}
                                        setValueLte={setValueLte}
                                        setFilters={setFilters}
                                    />
                                </Box>
                                <SearchButtonFilterComponent
                                    setOpenFilter={setOpenFilter}
                                    handleReplace={handleReplace}
                                    handleSearch={handleSearch}
                                />
                            </Box>
                        )
                    }
                </ModalWindow>
            </Box>
        </Box>
    );
};
export default FilterInstitutions;
