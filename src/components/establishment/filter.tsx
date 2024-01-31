import {
    Box,
    FormControl
} from "@mui/material";
import React, {Dispatch, ReactNode, useContext, useEffect, useState} from "react";
import {CrudFilters, CrudSorting, LogicalFilter, useTranslate} from "@refinedev/core";
import {useLocation} from "react-router-dom";
import {useDebounce} from "use-debounce";

import {ColorModeContext} from "@/contexts";
import {
    CustomOpenContentBtn,
    FilterBtn,
    ModalWindow,
    NearbyEstablishmentBtn,
    SearchCity,
    VariantComponent
} from "../index";
import {useMobile, usePosition} from "@/hook";
import {EstablishmentType, SetFilterType} from "@/interfaces/types";
import {
    SearchButtonFilterComponent,
    SearchByAverageCheckComponent, SearchByFreeSeats,
    SearchByTypeComponent,
    SearchInputComponent
} from "../common/search";
import SortEstablishmentComponent from "../common/search/establishment/sortEstablishmentComponent";
import {IFreeSeatsProps, PropertyProps} from "@/interfaces/common";


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

const FilterInstitutions = ({
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
    const {state: locationState} = useLocation();
    const {position, error} = usePosition();
    const {mode} = useContext(ColorModeContext);
    const {width, height} = useMobile();

    const [freeSeats, setFreeSeats] = useState({} as IFreeSeatsProps);
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
                    field: 'title_like',
                    value: searchValue ?? '',
                    operator: 'eq'
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
                field: 'title_like',
                value: searchValue?.length > 0 ? searchValue : "",
                operator: 'eq'
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

    const isFilterBtnAbsolute = height - 100 >= 400;

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
                        <FilterBtn
                            setOpenFilter={setOpenFilter}
                            filterLength={filterLength}
                            isShowAllFilters={isShowAllFilters}
                        />
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
                            alignItems: 'start',
                            gap: 1
                        }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'start',
                                flexWrap: 'wrap',
                                gap: {xs: 2, sm: 1, md: 2},
                            }}>
                                <SearchByTypeComponent
                                    defaultSetFilters={defaultSetFilters}
                                    setFilters={setFilters}
                                    type={type}
                                    setCurrent={setCurrent}
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
                            <FilterBtn
                                setOpenFilter={setOpenFilter}
                                filterLength={filterLength}
                                isShowAllFilters={isShowAllFilters}
                            />
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
                mt: {xs: 1, sm: 0}
            }}>
                <NearbyEstablishmentBtn
                    error={error}
                    location={position as PropertyProps['location']}/>
            </Box>
            <ModalWindow
                timeOut={700}
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
                                alignItems: 'start'
                            }}>
                                {
                                    !isShowAllFilters && (
                                        <>
                                            {SearchByCityComponent}
                                            <SearchByTypeComponent
                                                defaultSetFilters={defaultSetFilters}
                                                setFilters={setFilters}
                                                type={type}
                                                setCurrent={setCurrent}
                                                isShowAllFilters={isShowAllFilters}
                                                setType={setType}
                                            />
                                        </>
                                    )
                                }
                                <CustomOpenContentBtn
                                    style={{
                                        bgcolor: mode === 'dark' ? '#000' : '#fff',
                                        p: '10px'
                                    }}
                                    openText={translate('')}
                                >
                                    <SearchByFreeSeats freeSeats={freeSeats} setFreeSeats={setFreeSeats}/>
                                </CustomOpenContentBtn>
                                <SearchByAverageCheckComponent
                                    valueGte={valueGte}
                                    setValueGte={setValueGte}
                                    valueLte={valueLte}
                                    setValueLte={setValueLte}
                                    setFilters={setFilters}
                                />
                            </Box>
                            <Box sx={{
                                // position: isFilterBtnAbsolute ? 'absolute' : 'unset',
                                // bottom: '15px',
                                // left: 0,
                                // right: 0,
                                width: '90%',
                                margin: '0 auto'
                            }}>
                                <SearchButtonFilterComponent
                                    setOpenFilter={setOpenFilter}
                                    handleReplace={handleReplace}
                                    handleSearch={handleSearch}
                                />
                            </Box>
                        </Box>
                    )
                }
            </ModalWindow>
        </Box>
    );
};
export default FilterInstitutions;
