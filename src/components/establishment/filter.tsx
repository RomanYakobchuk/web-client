import {
    Box,
    FormControl
} from "@mui/material";
import React, {Dispatch, ReactNode, useContext, useEffect, useLayoutEffect, useMemo, useState} from "react";
import {CrudFilters, CrudSorting, LogicalFilter, useTranslate} from "@refinedev/core";
import {useDebounce} from "use-debounce";

import {ColorModeContext} from "@/contexts";
import {
    CustomOpenContentBtn,
    FilterBtn,
    ModalWindow,
    SearchCity,
    VariantComponent
} from "../index";
import {useMobile} from "@/hook";
import {EstablishmentType, SetFilterType} from "@/interfaces/types";
import {
    SearchButtonFilterComponent,
    SearchByAverageCheckComponent, SearchByFreeSeats,
    SearchByTypeComponent,
    SearchInputComponent
} from "../common/search";
import SortEstablishmentComponent from "../common/search/establishment/sortEstablishmentComponent";
import {IFreeSeatsProps} from "@/interfaces/common";

interface IProps {
    setFilters: SetFilterType,
    setSearchValue: (value: string) => void,
    sorters: CrudSorting,
    setSorters: (sorter: CrudSorting) => void,
    searchValue: string,
    filters: CrudFilters,
    setCurrent: Dispatch<React.SetStateAction<number>>,
    currentFilterValues: {
        title: string,
        city_like: string,
        propertyType: EstablishmentType,
        averageCheck_lte: number,
        averageCheck_gte: number,
    }
}

const FilterEstablishments = ({
                                  setFilters: defaultSetFilters,
                                  sorters,
                                  setSorters: defaultSetSorters,
                                  setSearchValue,
                                  searchValue,
                                  filters,
                                  setCurrent,
                                  currentFilterValues
                              }: IProps) => {

    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);
    const {width} = useMobile();

    const [newFilters, setFilters] = useState<CrudFilters>(filters);
    const [freeSeats, setFreeSeats] = useState({} as IFreeSeatsProps);
    const [filterLength, setFilterLength] = useState<number>(0);
    const [openFilter, setOpenFilter] = useState(false);
    const [searchCity, setSearchCity] = useState<string>(currentFilterValues?.city_like);
    const [type, setType] = useState<EstablishmentType>(currentFilterValues?.propertyType);
    const [valueGte, setValueGte] = useState<number>(currentFilterValues?.averageCheck_gte);
    const [valueLte, setValueLte] = useState<number>(currentFilterValues?.averageCheck_lte);
    const [debouncedSearchText] = useDebounce(searchValue, 500);
    const [debouncedSearchCity] = useDebounce(searchCity, 500);

    const isShowAllFilters = width > 600;


    // useEffect(() => {
    //     setFilters([
    //         {
    //             field: 'averageCheck',
    //             operator: 'lte',
    //             value: valueLte ? valueLte : 2000
    //         },
    //         {
    //             field: 'averageCheck',
    //             operator: 'gte',
    //             value: valueGte ? valueGte : 20
    //         },
    //         {
    //             field: 'title',
    //             operator: 'eq',
    //             value: searchValue || "",
    //         },
    //         {
    //             field: "propertyType",
    //             operator: "eq",
    //             value: type
    //         },
    //         {
    //             field: "city",
    //             operator: "contains",
    //             value: searchCity || ""
    //         }
    //     ])
    // }, [valueGte, valueLte, type, searchCity]);

    useLayoutEffect(() => {
        if (currentFilterValues) {
            // for (const filter of filters as LogicalFilter[]) {
            //     if (filter?.field === "averageCheck" && filter?.operator === 'lte') {
            //     }
            //     if (filter?.field === "averageCheck" && filter?.operator === 'gte') {
            //     }
            //     if (filter?.field === "propertyType" && filter?.value) {
            //     }
            //     if (filter?.field === "title") {
            //     }
            //     if (filter?.field === 'city' && filter?.value) {
            //     }
            // }
            setValueLte(currentFilterValues?.averageCheck_lte)
            setValueGte(currentFilterValues?.averageCheck_gte)
            setType(currentFilterValues?.propertyType)
            setSearchCity(currentFilterValues?.city_like)
            setFilterLength(filters?.length);
        }
    }, [currentFilterValues]);
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
        // defaultSetSorters(newSorters)
        setOpenFilter(false)
    }

    const handleSearchByTitle = (value: string) => {
        defaultSetFilters([
            {
                field: 'title',
                value: value,
                operator: 'eq'
            }
        ])
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
                handleSearchByValue={handleSearchByTitle}
                isButton={width > 500}
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
                                    sorters={sorters}

                                    // setSortBy={setSortBy}
                                    defaultSetSorters={defaultSetSorters}
                                    // sortBy={sortBy}
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
                                    sorters={sorters}
                                    // setSortBy={setSortBy}
                                    defaultSetSorters={defaultSetSorters}
                                    // sortBy={sortBy}
                                />
                                <VariantComponent type={'establishment'}/>
                            </Box>
                        </Box>
                    )
                }
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
export default FilterEstablishments;
